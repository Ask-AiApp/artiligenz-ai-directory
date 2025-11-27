#!/usr/bin/env python3
"""
Master script to run the entire Artiligenz AI Directory data sourcing and build pipeline.

Execution Order:
1. init_master.py        (Ensure master CSV exists)
2. validate_master.py    (Check for errors in the CSV)
3. enrich_favicons.py    (Fill in missing favicon URLs)
4. build_summaries.py    (Generate or update summaries using Gemini API)
5. build_directory.py    (Generate directory.json and directory.js)
6. convert_summaries_to_js (NEW STEP: Convert companies_summaries.json to company_summaries.js)
"""
import os, sys, json
import subprocess
import time

# Base path relative to this script
BASE_DIR = os.path.dirname(os.path.dirname(__file__)) or '.'
DATA_DIR = os.path.join(BASE_DIR, 'data')
KIT_DIR = os.path.join(BASE_DIR, 'data-sourcing-kit')

# Paths for the final outputs
SUMMARIES_JSON = os.path.join(DATA_DIR, 'companies_summaries.json')
SUMMARIES_JS   = os.path.join(DATA_DIR, 'company_summaries.js')
DIRECTORY_JSON = os.path.join(DATA_DIR, 'directory.json')
DIRECTORY_JS   = os.path.join(DATA_DIR, 'directory.js')

# List of scripts to run in order
PIPELINE_SCRIPTS = [
    'init_master.py',
    'validate_master.py',
    'enrich_favicons.py',
    'build_summaries.py',
    'build_directory.py',
]

def run_script(script_name):
    """Execute a Python script using subprocess and check its return code."""
    script_path = os.path.join(KIT_DIR, script_name)
    if not os.path.exists(script_path):
        print(f"ERROR: Script not found at {script_path}")
        sys.exit(1)

    print(f"\n[STEP] Running {script_name}...")
    try:
        # Use Popen to allow real-time output display, but check return code later
        process = subprocess.Popen(
            [sys.executable, script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        
        # Stream output in real-time
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())

        # Check return code
        if process.wait() != 0:
            print(f"\n[FATAL ERROR] {script_name} failed. Halting pipeline.")
            sys.exit(1)
        
        print(f"[SUCCESS] {script_name} finished.")

    except Exception as e:
        print(f"\n[FATAL ERROR] Failed to execute {script_name}: {e}")
        sys.exit(1)


def convert_json_to_js(json_path, js_path, var_name):
    """Converts a JSON file to a JavaScript file that defines a global variable."""
    if not os.path.exists(json_path):
        print(f"ERROR: Cannot convert. Source JSON not found at {json_path}")
        return

    print(f"\n[STEP] Converting {os.path.basename(json_path)} to {os.path.basename(js_path)}...")
    
    try:
        # 1. Load JSON data
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 2. Convert data to a JSON string representation
        json_content = json.dumps(data, indent=2)

        # 3. Create the JS file content
        js_content = (
            f"// Auto-generated from {os.path.basename(json_path)}\n"
            f"// Do not edit by hand. Regenerate using the pipeline script.\n\n"
            f"window.{var_name} = {json_content};\n"
        )

        # 4. Write the JS file
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print(f"[SUCCESS] Converted to {os.path.basename(js_path)}. Variable: window.{var_name}")
    
    except Exception as e:
        print(f"[FATAL ERROR] Failed to convert JSON to JS for {var_name}: {e}")
        sys.exit(1)


def main():
    print("--- Artiligenz AI Directory Pipeline Start ---")
    
    # 1. Run all Python data processing scripts
    for script in PIPELINE_SCRIPTS:
        run_script(script)

    # 2. Run the dedicated conversion steps for the front-end
    print("\n--- Starting Final Conversion Steps (JSON -> JS) ---")
    
    # The build_directory.py usually creates directory.js, but let's ensure summaries is done
    convert_json_to_js(SUMMARIES_JSON, SUMMARIES_JS, 'CompanySummaries')
    
    # Also ensure directory.json (created by build_directory.py) is converted to directory.js
    # (Although build_directory.py likely does this, this acts as a robust check/override)
    if os.path.exists(DIRECTORY_JSON) and not os.path.exists(DIRECTORY_JS):
         convert_json_to_js(DIRECTORY_JSON, DIRECTORY_JS, 'Directory')

    print("\n--- Pipeline Complete! ---")
    print("Web dashboard data files (.js) have been updated.")

if __name__ == '__main__':
    main()
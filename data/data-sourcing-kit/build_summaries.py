#!/usr/bin/env python3
import os, csv, json, re, requests, time, sys
from datetime import datetime
# Note: The original script used BeautifulSoup, but we will rely on
# Google Search Grounding via the Gemini API for rich, factual summaries.

# Base directory is one level up from data-sourcing-kit/
BASE = os.path.dirname(os.path.dirname(__file__)) or '.'
# Input data file
DATA = os.path.join(BASE, 'data', 'AI_Ecosystems_launch_list.csv')
# Output JSON file
OUT  = os.path.join(BASE, 'data', 'companies_summaries.json')

# --- Gemini API Configuration ---
# API Key will be provided by the runtime environment if left empty.
API_KEY = ""
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent"
MAX_RETRIES = 5

def generate_grounded_summary(name, chip_label, url):
    """
    Generates a summary using the Gemini API with Google Search grounding.
    Implements exponential backoff for request resilience.
    """
    system_prompt = (
        "You are a concise, world-class business analyst. "
        "Your task is to generate a high-quality summary of the company. "
        "The summary must be between 100 and 200 words. "
        "Provide a factual description of its main products/services, target users, "
        "and its specific role within the AI ecosystem segment."
    )
    user_query = (
        f"Write a summary for the company '{name}'. "
        f"The company is in the segment '{chip_label}'. "
        f"Use information grounded in up-to-date web results. "
        f"Its primary website is {url}."
    )

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "tools": [{"google_search": {}}],
        "systemInstruction": {"parts": [{"text": system_prompt}]}
    }

    # Exponential Backoff
    for attempt in range(MAX_RETRIES):
        try:
            r = requests.post(
                f"{API_URL}?key={API_KEY}",
                headers={'Content-Type': 'application/json'},
                data=json.dumps(payload),
                timeout=20
            )

            if r.status_code == 200:
                result = r.json()
                text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')

                if text:
                    # Check for grounding sources (optional but good practice)
                    grounding = result.get('candidates', [{}])[0].get('groundingMetadata', {}).get('groundingAttributions', [])
                    source_text = f"Grounded via Gemini/Google Search (sources: {len(grounding)})"
                    return text.strip(), source_text
                else:
                    print(f"  [WARN] API returned no text for {name}.")
                    return None, None
            elif r.status_code == 429:
                # Too many requests, retry
                wait_time = 2 ** attempt
                print(f"  [RATE LIMIT] Attempt {attempt+1}/{MAX_RETRIES}. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  [ERROR] API status code {r.status_code} for {name}: {r.text}")
                return None, None

        except requests.exceptions.RequestException as e:
            print(f"  [ERROR] Request failed for {name}: {e}")
            if attempt < MAX_RETRIES - 1:
                wait_time = 2 ** attempt
                print(f"  [RETRY] Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  [FAIL] Max retries reached for {name}.")
                return None, None

    return None, None # Fallback after all retries fail

def s(v):
    """Safely convert value to stripped string."""
    return str(v or '').strip()

if not os.path.exists(DATA):
    print(f"Error: Data file not found at {DATA}. Run init_master.py first.", file=sys.stderr)
    sys.exit(1)

# Load existing summaries if the file exists to avoid regenerating all of them
if os.path.exists(OUT):
    try:
        out = json.load(open(OUT, 'r', encoding='utf-8'))
    except json.JSONDecodeError:
        out = {}
else:
    out = {}


print('Starting summary generation...')
rows = list(csv.DictReader(open(DATA, 'r', encoding='utf-8')))
summary_count = 0

for row in rows:
    # Determine the entity name, URL, type, and associated chip/parent
    name = (s(row.get('Orbiting Entity')) or s(row.get('Parent Company')))
    url = (s(row.get('Orbiting Entity URL')) or s(row.get('Parent Company URL')))
    chip_label = (s(row.get('chip_label')) or s(row.get('chip_category')))
    entity_type = 'orbit' if s(row.get('Orbiting Entity')) else 'parent'
    parent_name = s(row.get('Parent Company')) if entity_type == 'orbit' else None

    if not name: continue

    # Check if a summary already exists and is not a manual/API fallback
    existing_entry = out.get(name, {})
    if existing_entry.get('summary') and 'fallback' not in existing_entry.get('source', '').lower():
         print(f"  [SKIP] Summary exists and is finalized for {name}")
         continue

    print(f"  [GENERATE] Summary for {name} ({entity_type})...")
    
    # --- New LLM Generation ---
    generated_summary, source_desc = generate_grounded_summary(name, chip_label, url)
    
    if generated_summary:
        summary = generated_summary
        source = source_desc
        summary_count += 1
    else:
        # Fallback to a simple manual placeholder if LLM generation fails
        summary = (
            f"{name} is an entry in the AI ecosystem. "
            f"This entry is pending a rich, AI-generated summary. "
            f"It is categorized under the '{chip_label}' segment."
        )
        source = 'manual_fallback'

    out[name] = {
        'name': name,
        'type': entity_type,
        'url': url,
        'parent': parent_name,
        'summary': summary,
        'source': source,
        'last_updated': datetime.now().isoformat(timespec='seconds') + 'Z',
        'notes': ''
    }
    
    # Save after each successful generation to ensure progress is saved
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2)

print(f'\nFinished. Generated {summary_count} new or updated summaries. File saved to {OUT}')
# NOTE: A separate process (like a build script) must convert the JSON to the
# client-side company_summaries.js format for the web directory.
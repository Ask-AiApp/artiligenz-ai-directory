window.Directory = window.Directory || { nodes: [], edges: [] };
window.Directory.nodes = window.Directory.nodes || [];
window.Directory.edges = window.Directory.edges || [];


// Additional edges for global Suns
window.Directory.edges.push(
  // ===== FOUNDATION MODELS EDGES =====
  // OpenAI edges
  {
    data: {
      id: "edge:parent:OpenAI->orbit:OpenAI|ChatGPT",
      source: "parent:OpenAI",
      target: "orbit:OpenAI|ChatGPT",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:OpenAI->orbit:OpenAI|DALL-E",
      source: "parent:OpenAI",
      target: "orbit:OpenAI|DALL-E",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:OpenAI->orbit:OpenAI|Sora",
      source: "parent:OpenAI",
      target: "orbit:OpenAI|Sora",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:OpenAI->orbit:OpenAI|Voice Engine",
      source: "parent:OpenAI",
      target: "orbit:OpenAI|Voice Engine",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:OpenAI->orbit:OpenAI|OpenAI API",
      source: "parent:OpenAI",
      target: "orbit:OpenAI|OpenAI API",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:OpenAI->orbit:OpenAI|GPT Store",
      source: "parent:OpenAI",
      target: "orbit:OpenAI|GPT Store",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Google Gemini edges
  {
    data: {
      id: "edge:parent:Gemini->orbit:Google-Gemini|Gemini Chat",
      source: "parent:Gemini",
      target: "orbit:Google-Gemini|Gemini Chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Gemini->orbit:Google-Gemini|Google AI Studio",
      source: "parent:Gemini",
      target: "orbit:Google-Gemini|Google AI Studio",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Gemini->orbit:Google-Gemini|Imagen 2",
      source: "parent:Gemini",
      target: "orbit:Google-Gemini|Imagen 2",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Gemini->orbit:Google-Gemini|Vertex AI",
      source: "parent:Gemini",
      target: "orbit:Google-Gemini|Vertex AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Gemini->orbit:Google-Gemini|Gemini API",
      source: "parent:Gemini",
      target: "orbit:Google-Gemini|Gemini API",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Anthropic edges
  {
    data: {
      id: "edge:parent:Anthropic->orbit:Anthropic|Claude.ai",
      source: "parent:Anthropic",
      target: "orbit:Anthropic|Claude.ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Anthropic->orbit:Anthropic|Claude API",
      source: "parent:Anthropic",
      target: "orbit:Anthropic|Claude API",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Anthropic->orbit:Anthropic|Amazon Bedrock (Claude)",
      source: "parent:Anthropic",
      target: "orbit:Anthropic|Amazon Bedrock (Claude)",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Meta-Llama edges
  {
    data: {
      id: "edge:parent:Meta-Llama->orbit:Meta-Llama|Meta AI Assistant",
      source: "parent:Meta-Llama",
      target: "orbit:Meta-Llama|Meta AI Assistant",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Meta-Llama->orbit:Meta-Llama|Code Llama",
      source: "parent:Meta-Llama",
      target: "orbit:Meta-Llama|Code Llama",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Meta-Llama->orbit:Meta-Llama|Ray-Ban Meta",
      source: "parent:Meta-Llama",
      target: "orbit:Meta-Llama|Ray-Ban Meta",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Meta-Llama->orbit:Meta-Llama|Quest VR",
      source: "parent:Meta-Llama",
      target: "orbit:Meta-Llama|Quest VR",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Meta-Llama->orbit:Meta-Llama|Hugging Face Models",
      source: "parent:Meta-Llama",
      target: "orbit:Meta-Llama|Hugging Face Models",
      relation: "has-orbit",
      weight: 1
    }
  },

  // xAI edges
  {
    data: {
      id: "edge:parent:xAI->orbit:xAI|Grok on X",
      source: "parent:xAI",
      target: "orbit:xAI|Grok on X",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:xAI->orbit:xAI|Grok API",
      source: "parent:xAI",
      target: "orbit:xAI|Grok API",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:xAI->orbit:xAI|Open Weights (Grok-1)",
      source: "parent:xAI",
      target: "orbit:xAI|Open Weights (Grok-1)",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Cohere edges
  {
    data: {
      id: "edge:parent:Cohere->orbit:Cohere|Coral",
      source: "parent:Cohere",
      target: "orbit:Cohere|Coral",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Cohere->orbit:Cohere|Cohere Platform",
      source: "parent:Cohere",
      target: "orbit:Cohere|Cohere Platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Cohere->orbit:Cohere|Embed API",
      source: "parent:Cohere",
      target: "orbit:Cohere|Embed API",
      relation: "has-orbit",
      weight: 1
    }
  },

  // DeepSeek edges
  {
    data: {
      id: "edge:parent:DeepSeek->orbit:DeepSeek|DeepSeek Chat",
      source: "parent:DeepSeek",
      target: "orbit:DeepSeek|DeepSeek Chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:DeepSeek->orbit:DeepSeek|DeepSeek API",
      source: "parent:DeepSeek",
      target: "orbit:DeepSeek|DeepSeek API",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:DeepSeek->orbit:DeepSeek|Open Weights",
      source: "parent:DeepSeek",
      target: "orbit:DeepSeek|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // 01AI edges
  {
    data: {
      id: "edge:parent:01AI->orbit:01AI|Yi Chat / 01.AI Platform",
      source: "parent:01AI",
      target: "orbit:01AI|Yi Chat / 01.AI Platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:01AI->orbit:01AI|Yi API",
      source: "parent:01AI",
      target: "orbit:01AI|Yi API",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:01AI->orbit:01AI|Yi-VL",
      source: "parent:01AI",
      target: "orbit:01AI|Yi-VL",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:01AI->orbit:01AI|Open Weights",
      source: "parent:01AI",
      target: "orbit:01AI|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Mistral AI edges
  {
    data: {
      id: "edge:parent:Mistral->orbit:Mistral|Le Chat",
      source: "parent:Mistral",
      target: "orbit:Mistral|Le Chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Mistral->orbit:Mistral|La Plateforme",
      source: "parent:Mistral",
      target: "orbit:Mistral|La Plateforme",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Mistral->orbit:Mistral|Codestral",
      source: "parent:Mistral",
      target: "orbit:Mistral|Codestral",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Mistral->orbit:Mistral|Open Weights",
      source: "parent:Mistral",
      target: "orbit:Mistral|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // AI21 edges
  {
    data: {
      id: "edge:parent:AI21->orbit:AI21|Wordtune",
      source: "parent:AI21",
      target: "orbit:AI21|Wordtune",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:AI21->orbit:AI21|AI21 Studio",
      source: "parent:AI21",
      target: "orbit:AI21|AI21 Studio",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:AI21->orbit:AI21|Contextual Answers",
      source: "parent:AI21",
      target: "orbit:AI21|Contextual Answers",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:AI21->orbit:AI21|Jamba Model",
      source: "parent:AI21",
      target: "orbit:AI21|Jamba Model",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Baidu edges
  {
    data: {
      id: "edge:parent:Baidu->orbit:Baidu|Ernie Bot",
      source: "parent:Baidu",
      target: "orbit:Baidu|Ernie Bot",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Baidu->orbit:Baidu|Ernie 4.0",
      source: "parent:Baidu",
      target: "orbit:Baidu|Ernie 4.0",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Baidu->orbit:Baidu|Wenxin Workshop",
      source: "parent:Baidu",
      target: "orbit:Baidu|Wenxin Workshop",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Baidu->orbit:Baidu|Ernie API",
      source: "parent:Baidu",
      target: "orbit:Baidu|Ernie API",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Baidu->orbit:Baidu|Baidu AI Cloud",
      source: "parent:Baidu",
      target: "orbit:Baidu|Baidu AI Cloud",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Alibaba edges
  {
    data: {
      id: "edge:parent:Alibaba->orbit:Alibaba|Tongyi Qianwen",
      source: "parent:Alibaba",
      target: "orbit:Alibaba|Tongyi Qianwen",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Alibaba->orbit:Alibaba|Qwen-Coder",
      source: "parent:Alibaba",
      target: "orbit:Alibaba|Qwen-Coder",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Alibaba->orbit:Alibaba|Qwen-VL",
      source: "parent:Alibaba",
      target: "orbit:Alibaba|Qwen-VL",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Alibaba->orbit:Alibaba|ModelScope",
      source: "parent:Alibaba",
      target: "orbit:Alibaba|ModelScope",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Alibaba->orbit:Alibaba|DashScope API",
      source: "parent:Alibaba",
      target: "orbit:Alibaba|DashScope API",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Tencent edges
  {
    data: {
      id: "edge:parent:Tencent->orbit:Tencent|Hunyuan Assistant",
      source: "parent:Tencent",
      target: "orbit:Tencent|Hunyuan Assistant",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Tencent->orbit:Tencent|Hunyuan-VL",
      source: "parent:Tencent",
      target: "orbit:Tencent|Hunyuan-VL",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Tencent->orbit:Tencent|Hunyuan-DiT",
      source: "parent:Tencent",
      target: "orbit:Tencent|Hunyuan-DiT",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Tencent->orbit:Tencent|Tencent Cloud AI",
      source: "parent:Tencent",
      target: "orbit:Tencent|Tencent Cloud AI",
      relation: "has-orbit",
      weight: 1
    }
  },

  // TII edges
  {
    data: {
      id: "edge:parent:TII->orbit:TII|Falcon 180B",
      source: "parent:TII",
      target: "orbit:TII|Falcon 180B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:TII->orbit:TII|Falcon 40B",
      source: "parent:TII",
      target: "orbit:TII|Falcon 40B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:TII->orbit:TII|Falcon 7B",
      source: "parent:TII",
      target: "orbit:TII|Falcon 7B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:TII->orbit:TII|Hugging Face models",
      source: "parent:TII",
      target: "orbit:TII|Hugging Face models",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:TII->orbit:TII|TII API",
      source: "parent:TII",
      target: "orbit:TII|TII API",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Databricks edges
  {
    data: {
      id: "edge:parent:Databricks->orbit:Databricks|MPT-7B",
      source: "parent:Databricks",
      target: "orbit:Databricks|MPT-7B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Databricks->orbit:Databricks|MPT-30B",
      source: "parent:Databricks",
      target: "orbit:Databricks|MPT-30B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Databricks->orbit:Databricks|MPT-Instruct",
      source: "parent:Databricks",
      target: "orbit:Databricks|MPT-Instruct",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Databricks->orbit:Databricks|Databricks Mosaic AI",
      source: "parent:Databricks",
      target: "orbit:Databricks|Databricks Mosaic AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Databricks->orbit:Databricks|Open Weights",
      source: "parent:Databricks",
      target: "orbit:Databricks|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // BigScience edges
  {
    data: {
      id: "edge:parent:BigScience->orbit:BigScience|BLOOM 176B",
      source: "parent:BigScience",
      target: "orbit:BigScience|BLOOM 176B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:BigScience->orbit:BigScience|BLOOMZ",
      source: "parent:BigScience",
      target: "orbit:BigScience|BLOOMZ",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:BigScience->orbit:BigScience|BLOOMChat",
      source: "parent:BigScience",
      target: "orbit:BigScience|BLOOMChat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:BigScience->orbit:BigScience|Hugging Face integration",
      source: "parent:BigScience",
      target: "orbit:BigScience|Hugging Face integration",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:BigScience->orbit:BigScience|Open Weights",
      source: "parent:BigScience",
      target: "orbit:BigScience|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Zhipu edges
  {
    data: {
      id: "edge:parent:Zhipu->orbit:Zhipu|ChatGLM-4",
      source: "parent:Zhipu",
      target: "orbit:Zhipu|ChatGLM-4",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Zhipu->orbit:Zhipu|ChatGLM-6B",
      source: "parent:Zhipu",
      target: "orbit:Zhipu|ChatGLM-6B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Zhipu->orbit:Zhipu|GLM-4-All Tools",
      source: "parent:Zhipu",
      target: "orbit:Zhipu|GLM-4-All Tools",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Zhipu->orbit:Zhipu|Open Weights",
      source: "parent:Zhipu",
      target: "orbit:Zhipu|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Zhipu->orbit:Zhipu|Zhipu API",
      source: "parent:Zhipu",
      target: "orbit:Zhipu|Zhipu API",
      relation: "has-orbit",
      weight: 1
    }
  },

  // G42 edges
  {
    data: {
      id: "edge:parent:G42->orbit:G42|Jais 30B",
      source: "parent:G42",
      target: "orbit:G42|Jais 30B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:G42->orbit:G42|Jais Chat",
      source: "parent:G42",
      target: "orbit:G42|Jais Chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:G42->orbit:G42|Open Weights",
      source: "parent:G42",
      target: "orbit:G42|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:G42->orbit:G42|G42 Cloud",
      source: "parent:G42",
      target: "orbit:G42|G42 Cloud",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Google-BERT edges
  {
    data: {
      id: "edge:parent:Google-BERT->orbit:Google-BERT|BERT Base",
      source: "parent:Google-BERT",
      target: "orbit:Google-BERT|BERT Base",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Google-BERT->orbit:Google-BERT|BERT Large",
      source: "parent:Google-BERT",
      target: "orbit:Google-BERT|BERT Large",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Google-BERT->orbit:Google-BERT|DistilBERT",
      source: "parent:Google-BERT",
      target: "orbit:Google-BERT|DistilBERT",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Google-BERT->orbit:Google-BERT|TensorFlow Hub",
      source: "parent:Google-BERT",
      target: "orbit:Google-BERT|TensorFlow Hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Google-BERT->orbit:Google-BERT|Hugging Face Transformers",
      source: "parent:Google-BERT",
      target: "orbit:Google-BERT|Hugging Face Transformers",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Google-PaLM edges
  {
    data: {
      id: "edge:parent:Google-PaLM->orbit:Google-PaLM|PaLM 2",
      source: "parent:Google-PaLM",
      target: "orbit:Google-PaLM|PaLM 2",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Google-PaLM->orbit:Google-PaLM|Med-PaLM",
      source: "parent:Google-PaLM",
      target: "orbit:Google-PaLM|Med-PaLM",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Google-PaLM->orbit:Google-PaLM|Sec-PaLM",
      source: "parent:Google-PaLM",
      target: "orbit:Google-PaLM|Sec-PaLM",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Google-PaLM->orbit:Google-PaLM|Google Cloud Vertex AI",
      source: "parent:Google-PaLM",
      target: "orbit:Google-PaLM|Google Cloud Vertex AI",
      relation: "has-orbit",
      weight: 1
    }
  },

  // EleutherAI edges
  {
    data: {
      id: "edge:parent:EleutherAI->orbit:EleutherAI|GPT-NeoX-20B",
      source: "parent:EleutherAI",
      target: "orbit:EleutherAI|GPT-NeoX-20B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:EleutherAI->orbit:EleutherAI|Pythia suite",
      source: "parent:EleutherAI",
      target: "orbit:EleutherAI|Pythia suite",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:EleutherAI->orbit:EleutherAI|Open Weights",
      source: "parent:EleutherAI",
      target: "orbit:EleutherAI|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:EleutherAI->orbit:EleutherAI|GitHub repository",
      source: "parent:EleutherAI",
      target: "orbit:EleutherAI|GitHub repository",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Meta-OPT edges
  {
    data: {
      id: "edge:parent:Meta-OPT->orbit:Meta-OPT|OPT-175B",
      source: "parent:Meta-OPT",
      target: "orbit:Meta-OPT|OPT-175B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Meta-OPT->orbit:Meta-OPT|OPT-30B",
      source: "parent:Meta-OPT",
      target: "orbit:Meta-OPT|OPT-30B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Meta-OPT->orbit:Meta-OPT|Open Weights",
      source: "parent:Meta-OPT",
      target: "orbit:Meta-OPT|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Meta-OPT->orbit:Meta-OPT|Research code",
      source: "parent:Meta-OPT",
      target: "orbit:Meta-OPT|Research code",
      relation: "has-orbit",
      weight: 1
    }
  },

  // NVIDIA edges
  {
    data: {
      id: "edge:parent:NVIDIA->orbit:NVIDIA|Nemotron-4 340B",
      source: "parent:NVIDIA",
      target: "orbit:NVIDIA|Nemotron-4 340B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:NVIDIA->orbit:NVIDIA|Nemotron-3 8B",
      source: "parent:NVIDIA",
      target: "orbit:NVIDIA|Nemotron-3 8B",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:NVIDIA->orbit:NVIDIA|NVIDIA NeMo framework",
      source: "parent:NVIDIA",
      target: "orbit:NVIDIA|NVIDIA NeMo framework",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:NVIDIA->orbit:NVIDIA|NGC catalog",
      source: "parent:NVIDIA",
      target: "orbit:NVIDIA|NGC catalog",
      relation: "has-orbit",
      weight: 1
    }
  },

  // LLaVA edges
  {
    data: {
      id: "edge:parent:LLaVA->orbit:LLaVA|LLaVA-1.6",
      source: "parent:LLaVA",
      target: "orbit:LLaVA|LLaVA-1.6",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:LLaVA->orbit:LLaVA|LLaVA-NeXT",
      source: "parent:LLaVA",
      target: "orbit:LLaVA|LLaVA-NeXT",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:LLaVA->orbit:LLaVA|Open Weights",
      source: "parent:LLaVA",
      target: "orbit:LLaVA|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:LLaVA->orbit:LLaVA|Hugging Face",
      source: "parent:LLaVA",
      target: "orbit:LLaVA|Hugging Face",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Microsoft-Phi edges
  {
    data: {
      id: "edge:parent:Microsoft-Phi->orbit:Microsoft-Phi|Phi-3 Mini",
      source: "parent:Microsoft-Phi",
      target: "orbit:Microsoft-Phi|Phi-3 Mini",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Microsoft-Phi->orbit:Microsoft-Phi|Phi-3 Medium",
      source: "parent:Microsoft-Phi",
      target: "orbit:Microsoft-Phi|Phi-3 Medium",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Microsoft-Phi->orbit:Microsoft-Phi|Phi-3 Vision",
      source: "parent:Microsoft-Phi",
      target: "orbit:Microsoft-Phi|Phi-3 Vision",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Microsoft-Phi->orbit:Microsoft-Phi|Azure AI Studio",
      source: "parent:Microsoft-Phi",
      target: "orbit:Microsoft-Phi|Azure AI Studio",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Microsoft-Phi->orbit:Microsoft-Phi|Open Weights",
      source: "parent:Microsoft-Phi",
      target: "orbit:Microsoft-Phi|Open Weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // ===== EXISTING EDGES (KEEP THESE AT THE END) =====
  // Naver edges
  {
    data: {
      id: "edge:parent:Naver->orbit:Naver|HyperCLOVA Chat",
      source: "parent:Naver",
      target: "orbit:Naver|HyperCLOVA Chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Naver->orbit:Naver|SearchGPT",
      source: "parent:Naver",
      target: "orbit:Naver|SearchGPT",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Naver->orbit:Naver|CLOVA API",
      source: "parent:Naver",
      target: "orbit:Naver|CLOVA API",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Naver->orbit:Naver|LINE Messenger AI",
      source: "parent:Naver",
      target: "orbit:Naver|LINE Messenger AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Kakao Brain edges
  {
    data: {
      id: "edge:parent:Kakao-Brain->orbit:Kakao-Brain|KoGPT",
      source: "parent:Kakao-Brain",
      target: "orbit:Kakao-Brain|KoGPT",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Kakao-Brain->orbit:Kakao-Brain|Karlo",
      source: "parent:Kakao-Brain",
      target: "orbit:Kakao-Brain|Karlo",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Kakao-Brain->orbit:Kakao-Brain|KakaoTalk AI",
      source: "parent:Kakao-Brain",
      target: "orbit:Kakao-Brain|KakaoTalk AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Kakao-Brain->orbit:Kakao-Brain|AI API Platform",
      source: "parent:Kakao-Brain",
      target: "orbit:Kakao-Brain|AI API Platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Yandex edges
  {
    data: {
      id: "edge:parent:Yandex->orbit:Yandex|YandexGPT Chat",
      source: "parent:Yandex",
      target: "orbit:Yandex|YandexGPT Chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Yandex->orbit:Yandex|Alice Assistant",
      source: "parent:Yandex",
      target: "orbit:Yandex|Alice Assistant",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Yandex->orbit:Yandex|Yandex Cloud AI",
      source: "parent:Yandex",
      target: "orbit:Yandex|Yandex Cloud AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // SAP AI edges
  {
    data: {
      id: "edge:parent:SAP-AI->orbit:SAP-AI|Joule Copilot",
      source: "parent:SAP-AI",
      target: "orbit:SAP-AI|Joule Copilot",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:SAP-AI->orbit:SAP-AI|SAP AI Core",
      source: "parent:SAP-AI",
      target: "orbit:SAP-AI|SAP AI Core",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:SAP-AI->orbit:SAP-AI|SAP Business AI",
      source: "parent:SAP-AI",
      target: "orbit:SAP-AI|SAP Business AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Siemens AI edges
  {
    data: {
      id: "edge:parent:Siemens-AI->orbit:Siemens-AI|Industrial Copilot",
      source: "parent:Siemens-AI",
      target: "orbit:Siemens-AI|Industrial Copilot",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Siemens-AI->orbit:Siemens-AI|Teamcenter AI",
      source: "parent:Siemens-AI",
      target: "orbit:Siemens-AI|Teamcenter AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Siemens-AI->orbit:Siemens-AI|Siemens Xcelerator AI",
      source: "parent:Siemens-AI",
      target: "orbit:Siemens-AI|Siemens Xcelerator AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Bosch AI edges
  {
    data: {
      id: "edge:parent:Bosch-AI->orbit:Bosch-AI|Automotive AI",
      source: "parent:Bosch-AI",
      target: "orbit:Bosch-AI|Automotive AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Bosch-AI->orbit:Bosch-AI|Smart Home AI",
      source: "parent:Bosch-AI",
      target: "orbit:Bosch-AI|Smart Home AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Bosch-AI->orbit:Bosch-AI|Bosch AI Cloud",
      source: "parent:Bosch-AI",
      target: "orbit:Bosch-AI|Bosch AI Cloud",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // NEC edges
  {
    data: {
      id: "edge:parent:NEC->orbit:NEC|Bio-Idiom",
      source: "parent:NEC",
      target: "orbit:NEC|Bio-Idiom",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:NEC->orbit:NEC|Video Analytics AI",
      source: "parent:NEC",
      target: "orbit:NEC|Video Analytics AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:NEC->orbit:NEC|NEC Cloud AI",
      source: "parent:NEC",
      target: "orbit:NEC|NEC Cloud AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Preferred Networks edges
  {
    data: {
      id: "edge:parent:Preferred-Networks->orbit:Preferred-Networks|Optuna",
      source: "parent:Preferred-Networks",
      target: "orbit:Preferred-Networks|Optuna",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Preferred-Networks->orbit:Preferred-Networks|MN-Core AI",
      source: "parent:Preferred-Networks",
      target: "orbit:Preferred-Networks|MN-Core AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Preferred-Networks->orbit:Preferred-Networks|PaintsChainer",
      source: "parent:Preferred-Networks",
      target: "orbit:Preferred-Networks|PaintsChainer",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // C3.ai edges
  {
    data: {
      id: "edge:parent:C3-ai->orbit:C3-ai|C3 Generative AI",
      source: "parent:C3-ai",
      target: "orbit:C3-ai|C3 Generative AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:C3-ai->orbit:C3-ai|Enterprise AI Apps",
      source: "parent:C3-ai",
      target: "orbit:C3-ai|Enterprise AI Apps",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:C3-ai->orbit:C3-ai|C3 AI Platform",
      source: "parent:C3-ai",
      target: "orbit:C3-ai|C3 AI Platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Palantir edges
  {
    data: {
      id: "edge:parent:Palantir-AIP->orbit:Palantir-AIP|Gotham Platform",
      source: "parent:Palantir-AIP",
      target: "orbit:Palantir-AIP|Gotham Platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Palantir-AIP->orbit:Palantir-AIP|Foundry Platform",
      source: "parent:Palantir-AIP",
      target: "orbit:Palantir-AIP|Foundry Platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Palantir-AIP->orbit:Palantir-AIP|Ontology SDK",
      source: "parent:Palantir-AIP",
      target: "orbit:Palantir-AIP|Ontology SDK",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // ServiceNow edges
  {
    data: {
      id: "edge:parent:ServiceNow-AI->orbit:ServiceNow-AI|Now Assist",
      source: "parent:ServiceNow-AI",
      target: "orbit:ServiceNow-AI|Now Assist",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:ServiceNow-AI->orbit:ServiceNow-AI|AI Integration Hub",
      source: "parent:ServiceNow-AI",
      target: "orbit:ServiceNow-AI|AI Integration Hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:ServiceNow-AI->orbit:ServiceNow-AI|Now Platform AI",
      source: "parent:ServiceNow-AI",
      target: "orbit:ServiceNow-AI|Now Platform AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Workday edges
  {
    data: {
      id: "edge:parent:Workday-AI->orbit:Workday-AI|Skills Cloud",
      source: "parent:Workday-AI",
      target: "orbit:Workday-AI|Skills Cloud",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Workday-AI->orbit:Workday-AI|Talent Optimization",
      source: "parent:Workday-AI",
      target: "orbit:Workday-AI|Talent Optimization",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Workday-AI->orbit:Workday-AI|Workday Extend AI",
      source: "parent:Workday-AI",
      target: "orbit:Workday-AI|Workday Extend AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Intuit edges
  {
    data: {
      id: "edge:parent:Intuit-AI->orbit:Intuit-AI|Intuit Assist",
      source: "parent:Intuit-AI",
      target: "orbit:Intuit-AI|Intuit Assist",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Intuit-AI->orbit:Intuit-AI|QuickBooks AI",
      source: "parent:Intuit-AI",
      target: "orbit:Intuit-AI|QuickBooks AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Intuit-AI->orbit:Intuit-AI|GenOS",
      source: "parent:Intuit-AI",
      target: "orbit:Intuit-AI|GenOS",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Qualcomm edges
  {
    data: {
      id: "edge:parent:Qualcomm-AI->orbit:Qualcomm-AI|Snapdragon Platforms",
      source: "parent:Qualcomm-AI",
      target: "orbit:Qualcomm-AI|Snapdragon Platforms",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Qualcomm-AI->orbit:Qualcomm-AI|AI Hub",
      source: "parent:Qualcomm-AI",
      target: "orbit:Qualcomm-AI|AI Hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Qualcomm-AI->orbit:Qualcomm-AI|AI Engine SDK",
      source: "parent:Qualcomm-AI",
      target: "orbit:Qualcomm-AI|AI Engine SDK",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // AMD edges
  {
    data: {
      id: "edge:parent:AMD-AI->orbit:AMD-AI|Instinct MI300",
      source: "parent:AMD-AI",
      target: "orbit:AMD-AI|Instinct MI300",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:AMD-AI->orbit:AMD-AI|Ryzen AI",
      source: "parent:AMD-AI",
      target: "orbit:AMD-AI|Ryzen AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:AMD-AI->orbit:AMD-AI|Infinity Hub",
      source: "parent:AMD-AI",
      target: "orbit:AMD-AI|Infinity Hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Arm edges
  {
    data: {
      id: "edge:parent:Arm-AI->orbit:Arm-AI|Ethos NPU",
      source: "parent:Arm-AI",
      target: "orbit:Arm-AI|Ethos NPU",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Arm-AI->orbit:Arm-AI|Cortex-A/M CPUs",
      source: "parent:Arm-AI",
      target: "orbit:Arm-AI|Cortex-A/M CPUs",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Arm-AI->orbit:Arm-AI|Arm NN",
      source: "parent:Arm-AI",
      target: "orbit:Arm-AI|Arm NN",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Infosys edges
  {
    data: {
      id: "edge:parent:Infosys-Topaz->orbit:Infosys-Topaz|AI Services",
      source: "parent:Infosys-Topaz",
      target: "orbit:Infosys-Topaz|AI Services",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Infosys-Topaz->orbit:Infosys-Topaz|Data Analytics",
      source: "parent:Infosys-Topaz",
      target: "orbit:Infosys-Topaz|Data Analytics",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Infosys-Topaz->orbit:Infosys-Topaz|Infosys Cobalt",
      source: "parent:Infosys-Topaz",
      target: "orbit:Infosys-Topaz|Infosys Cobalt",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Wipro edges
  {
    data: {
      id: "edge:parent:Wipro-ai360->orbit:Wipro-ai360|AI Consulting",
      source: "parent:Wipro-ai360",
      target: "orbit:Wipro-ai360|AI Consulting",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Wipro-ai360->orbit:Wipro-ai360|Industry Solutions",
      source: "parent:Wipro-ai360",
      target: "orbit:Wipro-ai360|Industry Solutions",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:Wipro-ai360->orbit:Wipro-ai360|Wipro Holmes",
      source: "parent:Wipro-ai360",
      target: "orbit:Wipro-ai360|Wipro Holmes",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // TCS edges
  {
    data: {
      id: "edge:parent:TCS-AI->orbit:TCS-AI|Enterprise AI",
      source: "parent:TCS-AI",
      target: "orbit:TCS-AI|Enterprise AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:TCS-AI->orbit:TCS-AI|TCS CMI",
      source: "parent:TCS-AI",
      target: "orbit:TCS-AI|TCS CMI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:TCS-AI->orbit:TCS-AI|Ignio AIOps",
      source: "parent:TCS-AI",
      target: "orbit:TCS-AI|Ignio AIOps",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // JioBrain edges
  {
    data: {
      id: "edge:parent:JioBrain->orbit:JioBrain|Jio Services AI",
      source: "parent:JioBrain",
      target: "orbit:JioBrain|Jio Services AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:JioBrain->orbit:JioBrain|JioMart AI",
      source: "parent:JioBrain",
      target: "orbit:JioBrain|JioMart AI",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:JioBrain->orbit:JioBrain|AI APIs",
      source: "parent:JioBrain",
      target: "orbit:JioBrain|AI APIs",
      relation: "has-orbit",
      weight: 1
    }
  }
);
window.Directory = window.Directory || { nodes: [], edges: [] };
window.Directory.nodes = window.Directory.nodes || [];
window.Directory.edges = window.Directory.edges || [];


// Additional edges for global Suns
window.Directory.edges.push(
  // ===== FOUNDATION MODELS EDGES =====
  // OpenAI edges
  {
    data: {
      id: "edge:parent:openai->orbit:openai|chatgpt",
      source: "parent:openai",
      target: "orbit:openai|chatgpt",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:openai->orbit:openai|dall-e",
      source: "parent:openai",
      target: "orbit:openai|dall-e",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:openai->orbit:openai|sora",
      source: "parent:openai",
      target: "orbit:openai|sora",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:openai->orbit:openai|voice-engine",
      source: "parent:openai",
      target: "orbit:openai|voice-engine",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:openai->orbit:openai|openai-api",
      source: "parent:openai",
      target: "orbit:openai|openai-api",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:openai->orbit:openai|gpt-store",
      source: "parent:openai",
      target: "orbit:openai|gpt-store",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Google Gemini edges
  {
    data: {
      id: "edge:parent:gemini->orbit:google-gemini|gemini-chat",
      source: "parent:gemini",
      target: "orbit:google-gemini|gemini-chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:gemini->orbit:google-gemini|google-ai-studio",
      source: "parent:gemini",
      target: "orbit:google-gemini|google-ai-studio",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:gemini->orbit:google-gemini|imagen-2",
      source: "parent:gemini",
      target: "orbit:google-gemini|imagen-2",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:gemini->orbit:google-gemini|vertex-ai",
      source: "parent:gemini",
      target: "orbit:google-gemini|vertex-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:gemini->orbit:google-gemini|gemini-api",
      source: "parent:gemini",
      target: "orbit:google-gemini|gemini-api",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Anthropic edges
  {
    data: {
      id: "edge:parent:anthropic->orbit:anthropic|claude-ai",
      source: "parent:anthropic",
      target: "orbit:anthropic|claude-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:anthropic->orbit:anthropic|claude-api",
      source: "parent:anthropic",
      target: "orbit:anthropic|claude-api",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:anthropic->orbit:anthropic|amazon-bedrock-claude",
      source: "parent:anthropic",
      target: "orbit:anthropic|amazon-bedrock-claude",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Meta-Llama edges
  {
    data: {
      id: "edge:parent:meta-llama->orbit:meta-llama|meta-ai-assistant",
      source: "parent:meta-llama",
      target: "orbit:meta-llama|meta-ai-assistant",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:meta-llama->orbit:meta-llama|code-llama",
      source: "parent:meta-llama",
      target: "orbit:meta-llama|code-llama",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:meta-llama->orbit:meta-llama|ray-ban-meta",
      source: "parent:meta-llama",
      target: "orbit:meta-llama|ray-ban-meta",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:meta-llama->orbit:meta-llama|quest-vr",
      source: "parent:meta-llama",
      target: "orbit:meta-llama|quest-vr",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:meta-llama->orbit:meta-llama|hugging-face-models",
      source: "parent:meta-llama",
      target: "orbit:meta-llama|hugging-face-models",
      relation: "has-orbit",
      weight: 1
    }
  },

  // xAI edges
  {
    data: {
      id: "edge:parent:xai->orbit:xai|grok-on-x",
      source: "parent:xai",
      target: "orbit:xai|grok-on-x",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:xai->orbit:xai|grok-api",
      source: "parent:xai",
      target: "orbit:xai|grok-api",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:xai->orbit:xai|open-weights-grok-1",
      source: "parent:xai",
      target: "orbit:xai|open-weights-grok-1",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Cohere edges
  {
    data: {
      id: "edge:parent:cohere->orbit:cohere|coral",
      source: "parent:cohere",
      target: "orbit:cohere|coral",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:cohere->orbit:cohere|cohere-platform",
      source: "parent:cohere",
      target: "orbit:cohere|cohere-platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:cohere->orbit:cohere|embed-api",
      source: "parent:cohere",
      target: "orbit:cohere|embed-api",
      relation: "has-orbit",
      weight: 1
    }
  },

  // DeepSeek edges
  {
    data: {
      id: "edge:parent:deepseek->orbit:deepseek|deepseek-chat",
      source: "parent:deepseek",
      target: "orbit:deepseek|deepseek-chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:deepseek->orbit:deepseek|deepseek-api",
      source: "parent:deepseek",
      target: "orbit:deepseek|deepseek-api",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:deepseek->orbit:deepseek|open-weights",
      source: "parent:deepseek",
      target: "orbit:deepseek|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // 01AI edges
  {
    data: {
      id: "edge:parent:01ai->orbit:01ai|yi-chat-01-ai-platform",
      source: "parent:01ai",
      target: "orbit:01ai|yi-chat-01-ai-platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:01ai->orbit:01ai|yi-api",
      source: "parent:01ai",
      target: "orbit:01ai|yi-api",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:01ai->orbit:01ai|yi-vl",
      source: "parent:01ai",
      target: "orbit:01ai|yi-vl",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:01ai->orbit:01ai|open-weights",
      source: "parent:01ai",
      target: "orbit:01ai|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Mistral AI edges
  {
    data: {
      id: "edge:parent:mistral->orbit:mistral|le-chat",
      source: "parent:mistral",
      target: "orbit:mistral|le-chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:mistral->orbit:mistral|la-plateforme",
      source: "parent:mistral",
      target: "orbit:mistral|la-plateforme",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:mistral->orbit:mistral|codestral",
      source: "parent:mistral",
      target: "orbit:mistral|codestral",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:mistral->orbit:mistral|open-weights",
      source: "parent:mistral",
      target: "orbit:mistral|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // AI21 edges
  {
    data: {
      id: "edge:parent:ai21->orbit:ai21|wordtune",
      source: "parent:ai21",
      target: "orbit:ai21|wordtune",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:ai21->orbit:ai21|ai21-studio",
      source: "parent:ai21",
      target: "orbit:ai21|ai21-studio",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:ai21->orbit:ai21|contextual-answers",
      source: "parent:ai21",
      target: "orbit:ai21|contextual-answers",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:ai21->orbit:ai21|jamba-model",
      source: "parent:ai21",
      target: "orbit:ai21|jamba-model",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Baidu edges
  {
    data: {
      id: "edge:parent:baidu->orbit:baidu|ernie-bot",
      source: "parent:baidu",
      target: "orbit:baidu|ernie-bot",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:baidu->orbit:baidu|ernie-4-0",
      source: "parent:baidu",
      target: "orbit:baidu|ernie-4-0",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:baidu->orbit:baidu|wenxin-workshop",
      source: "parent:baidu",
      target: "orbit:baidu|wenxin-workshop",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:baidu->orbit:baidu|ernie-api",
      source: "parent:baidu",
      target: "orbit:baidu|ernie-api",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:baidu->orbit:baidu|baidu-ai-cloud",
      source: "parent:baidu",
      target: "orbit:baidu|baidu-ai-cloud",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Alibaba edges
  {
    data: {
      id: "edge:parent:alibaba->orbit:alibaba|tongyi-qianwen",
      source: "parent:alibaba",
      target: "orbit:alibaba|tongyi-qianwen",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:alibaba->orbit:alibaba|qwen-coder",
      source: "parent:alibaba",
      target: "orbit:alibaba|qwen-coder",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:alibaba->orbit:alibaba|qwen-vl",
      source: "parent:alibaba",
      target: "orbit:alibaba|qwen-vl",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:alibaba->orbit:alibaba|modelscope",
      source: "parent:alibaba",
      target: "orbit:alibaba|modelscope",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:alibaba->orbit:alibaba|dashscope-api",
      source: "parent:alibaba",
      target: "orbit:alibaba|dashscope-api",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Tencent edges
  {
    data: {
      id: "edge:parent:tencent->orbit:tencent|hunyuan-assistant",
      source: "parent:tencent",
      target: "orbit:tencent|hunyuan-assistant",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tencent->orbit:tencent|hunyuan-vl",
      source: "parent:tencent",
      target: "orbit:tencent|hunyuan-vl",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tencent->orbit:tencent|hunyuan-dit",
      source: "parent:tencent",
      target: "orbit:tencent|hunyuan-dit",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tencent->orbit:tencent|tencent-cloud-ai",
      source: "parent:tencent",
      target: "orbit:tencent|tencent-cloud-ai",
      relation: "has-orbit",
      weight: 1
    }
  },

  // TII edges
  {
    data: {
      id: "edge:parent:tii->orbit:tii|falcon-180b",
      source: "parent:tii",
      target: "orbit:tii|falcon-180b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tii->orbit:tii|falcon-40b",
      source: "parent:tii",
      target: "orbit:tii|falcon-40b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tii->orbit:tii|falcon-7b",
      source: "parent:tii",
      target: "orbit:tii|falcon-7b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tii->orbit:tii|hugging-face-models",
      source: "parent:tii",
      target: "orbit:tii|hugging-face-models",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tii->orbit:tii|tii-api",
      source: "parent:tii",
      target: "orbit:tii|tii-api",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Databricks edges
  {
    data: {
      id: "edge:parent:databricks->orbit:databricks|mpt-7b",
      source: "parent:databricks",
      target: "orbit:databricks|mpt-7b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:databricks->orbit:databricks|mpt-30b",
      source: "parent:databricks",
      target: "orbit:databricks|mpt-30b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:databricks->orbit:databricks|mpt-instruct",
      source: "parent:databricks",
      target: "orbit:databricks|mpt-instruct",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:databricks->orbit:databricks|databricks-mosaic-ai",
      source: "parent:databricks",
      target: "orbit:databricks|databricks-mosaic-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:databricks->orbit:databricks|open-weights",
      source: "parent:databricks",
      target: "orbit:databricks|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // BigScience edges
  {
    data: {
      id: "edge:parent:bigscience->orbit:bigscience|bloom-176b",
      source: "parent:bigscience",
      target: "orbit:bigscience|bloom-176b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:bigscience->orbit:bigscience|bloomz",
      source: "parent:bigscience",
      target: "orbit:bigscience|bloomz",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:bigscience->orbit:bigscience|bloomchat",
      source: "parent:bigscience",
      target: "orbit:bigscience|bloomchat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:bigscience->orbit:bigscience|hugging-face-integration",
      source: "parent:bigscience",
      target: "orbit:bigscience|hugging-face-integration",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:bigscience->orbit:bigscience|open-weights",
      source: "parent:bigscience",
      target: "orbit:bigscience|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Zhipu edges
  {
    data: {
      id: "edge:parent:zhipu->orbit:zhipu|chatglm-4",
      source: "parent:zhipu",
      target: "orbit:zhipu|chatglm-4",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:zhipu->orbit:zhipu|chatglm-6b",
      source: "parent:zhipu",
      target: "orbit:zhipu|chatglm-6b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:zhipu->orbit:zhipu|glm-4-all-tools",
      source: "parent:zhipu",
      target: "orbit:zhipu|glm-4-all-tools",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:zhipu->orbit:zhipu|open-weights",
      source: "parent:zhipu",
      target: "orbit:zhipu|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:zhipu->orbit:zhipu|zhipu-api",
      source: "parent:zhipu",
      target: "orbit:zhipu|zhipu-api",
      relation: "has-orbit",
      weight: 1
    }
  },

  // G42 edges
  {
    data: {
      id: "edge:parent:g42->orbit:g42|jais-30b",
      source: "parent:g42",
      target: "orbit:g42|jais-30b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:g42->orbit:g42|jais-chat",
      source: "parent:g42",
      target: "orbit:g42|jais-chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:g42->orbit:g42|open-weights",
      source: "parent:g42",
      target: "orbit:g42|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:g42->orbit:g42|g42-cloud",
      source: "parent:g42",
      target: "orbit:g42|g42-cloud",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Google-BERT edges
  {
    data: {
      id: "edge:parent:google-bert->orbit:google-bert|bert-base",
      source: "parent:google-bert",
      target: "orbit:google-bert|bert-base",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:google-bert->orbit:google-bert|bert-large",
      source: "parent:google-bert",
      target: "orbit:google-bert|bert-large",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:google-bert->orbit:google-bert|distilbert",
      source: "parent:google-bert",
      target: "orbit:google-bert|distilbert",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:google-bert->orbit:google-bert|tensorflow-hub",
      source: "parent:google-bert",
      target: "orbit:google-bert|tensorflow-hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:google-bert->orbit:google-bert|hugging-face-transformers",
      source: "parent:google-bert",
      target: "orbit:google-bert|hugging-face-transformers",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Google-PaLM edges
  {
    data: {
      id: "edge:parent:google-palm->orbit:google-palm|palm-2",
      source: "parent:google-palm",
      target: "orbit:google-palm|palm-2",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:google-palm->orbit:google-palm|med-palm",
      source: "parent:google-palm",
      target: "orbit:google-palm|med-palm",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:google-palm->orbit:google-palm|sec-palm",
      source: "parent:google-palm",
      target: "orbit:google-palm|sec-palm",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:google-palm->orbit:google-palm|google-cloud-vertex-ai",
      source: "parent:google-palm",
      target: "orbit:google-palm|google-cloud-vertex-ai",
      relation: "has-orbit",
      weight: 1
    }
  },

  // EleutherAI edges
  {
    data: {
      id: "edge:parent:eleutherai->orbit:eleutherai|gpt-neox-20b",
      source: "parent:eleutherai",
      target: "orbit:eleutherai|gpt-neox-20b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:eleutherai->orbit:eleutherai|pythia-suite",
      source: "parent:eleutherai",
      target: "orbit:eleutherai|pythia-suite",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:eleutherai->orbit:eleutherai|open-weights",
      source: "parent:eleutherai",
      target: "orbit:eleutherai|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:eleutherai->orbit:eleutherai|github-repository",
      source: "parent:eleutherai",
      target: "orbit:eleutherai|github-repository",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Meta-OPT edges
  {
    data: {
      id: "edge:parent:meta-opt->orbit:meta-opt|opt-175b",
      source: "parent:meta-opt",
      target: "orbit:meta-opt|opt-175b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:meta-opt->orbit:meta-opt|opt-30b",
      source: "parent:meta-opt",
      target: "orbit:meta-opt|opt-30b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:meta-opt->orbit:meta-opt|open-weights",
      source: "parent:meta-opt",
      target: "orbit:meta-opt|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:meta-opt->orbit:meta-opt|research-code",
      source: "parent:meta-opt",
      target: "orbit:meta-opt|research-code",
      relation: "has-orbit",
      weight: 1
    }
  },

  // NVIDIA edges
  {
    data: {
      id: "edge:parent:nvidia->orbit:nvidia|nemotron-4-340b",
      source: "parent:nvidia",
      target: "orbit:nvidia|nemotron-4-340b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:nvidia->orbit:nvidia|nemotron-3-8b",
      source: "parent:nvidia",
      target: "orbit:nvidia|nemotron-3-8b",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:nvidia->orbit:nvidia|nvidia-nemo-framework",
      source: "parent:nvidia",
      target: "orbit:nvidia|nvidia-nemo-framework",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:nvidia->orbit:nvidia|ngc-catalog",
      source: "parent:nvidia",
      target: "orbit:nvidia|ngc-catalog",
      relation: "has-orbit",
      weight: 1
    }
  },

  // LLaVA edges
  {
    data: {
      id: "edge:parent:llava->orbit:llava|llava-1-6",
      source: "parent:llava",
      target: "orbit:llava|llava-1-6",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:llava->orbit:llava|llava-next",
      source: "parent:llava",
      target: "orbit:llava|llava-next",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:llava->orbit:llava|open-weights",
      source: "parent:llava",
      target: "orbit:llava|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:llava->orbit:llava|hugging-face",
      source: "parent:llava",
      target: "orbit:llava|hugging-face",
      relation: "has-orbit",
      weight: 1
    }
  },

  // Microsoft-Phi edges
  {
    data: {
      id: "edge:parent:microsoft-phi->orbit:microsoft-phi|phi-3-mini",
      source: "parent:microsoft-phi",
      target: "orbit:microsoft-phi|phi-3-mini",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:microsoft-phi->orbit:microsoft-phi|phi-3-medium",
      source: "parent:microsoft-phi",
      target: "orbit:microsoft-phi|phi-3-medium",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:microsoft-phi->orbit:microsoft-phi|phi-3-vision",
      source: "parent:microsoft-phi",
      target: "orbit:microsoft-phi|phi-3-vision",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:microsoft-phi->orbit:microsoft-phi|azure-ai-studio",
      source: "parent:microsoft-phi",
      target: "orbit:microsoft-phi|azure-ai-studio",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:microsoft-phi->orbit:microsoft-phi|open-weights",
      source: "parent:microsoft-phi",
      target: "orbit:microsoft-phi|open-weights",
      relation: "has-orbit",
      weight: 1
    }
  },

  // ===== EXISTING EDGES (KEEP THESE AT THE END) =====
  // Naver edges
  {
    data: {
      id: "edge:parent:naver->orbit:naver|hyperclova-chat",
      source: "parent:naver",
      target: "orbit:naver|hyperclova-chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:naver->orbit:naver|searchgpt",
      source: "parent:naver",
      target: "orbit:naver|searchgpt",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:naver->orbit:naver|clova-api",
      source: "parent:naver",
      target: "orbit:naver|clova-api",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:naver->orbit:naver|line-messenger-ai",
      source: "parent:naver",
      target: "orbit:naver|line-messenger-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Kakao Brain edges
  {
    data: {
      id: "edge:parent:kakao-brain->orbit:kakao-brain|kogpt",
      source: "parent:kakao-brain",
      target: "orbit:kakao-brain|kogpt",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:kakao-brain->orbit:kakao-brain|karlo",
      source: "parent:kakao-brain",
      target: "orbit:kakao-brain|karlo",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:kakao-brain->orbit:kakao-brain|kakaotalk-ai",
      source: "parent:kakao-brain",
      target: "orbit:kakao-brain|kakaotalk-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:kakao-brain->orbit:kakao-brain|ai-api-platform",
      source: "parent:kakao-brain",
      target: "orbit:kakao-brain|ai-api-platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Yandex edges
  {
    data: {
      id: "edge:parent:yandex->orbit:yandex|yandexgpt-chat",
      source: "parent:yandex",
      target: "orbit:yandex|yandexgpt-chat",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:yandex->orbit:yandex|alice-assistant",
      source: "parent:yandex",
      target: "orbit:yandex|alice-assistant",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:yandex->orbit:yandex|yandex-cloud-ai",
      source: "parent:yandex",
      target: "orbit:yandex|yandex-cloud-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // SAP AI edges
  {
    data: {
      id: "edge:parent:sap-ai->orbit:sap-ai|joule-copilot",
      source: "parent:sap-ai",
      target: "orbit:sap-ai|joule-copilot",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:sap-ai->orbit:sap-ai|sap-ai-core",
      source: "parent:sap-ai",
      target: "orbit:sap-ai|sap-ai-core",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:sap-ai->orbit:sap-ai|sap-business-ai",
      source: "parent:sap-ai",
      target: "orbit:sap-ai|sap-business-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Siemens AI edges
  {
    data: {
      id: "edge:parent:siemens-ai->orbit:siemens-ai|industrial-copilot",
      source: "parent:siemens-ai",
      target: "orbit:siemens-ai|industrial-copilot",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:siemens-ai->orbit:siemens-ai|teamcenter-ai",
      source: "parent:siemens-ai",
      target: "orbit:siemens-ai|teamcenter-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:siemens-ai->orbit:siemens-ai|siemens-xcelerator-ai",
      source: "parent:siemens-ai",
      target: "orbit:siemens-ai|siemens-xcelerator-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Bosch AI edges
  {
    data: {
      id: "edge:parent:bosch-ai->orbit:bosch-ai|automotive-ai",
      source: "parent:bosch-ai",
      target: "orbit:bosch-ai|automotive-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:bosch-ai->orbit:bosch-ai|smart-home-ai",
      source: "parent:bosch-ai",
      target: "orbit:bosch-ai|smart-home-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:bosch-ai->orbit:bosch-ai|bosch-ai-cloud",
      source: "parent:bosch-ai",
      target: "orbit:bosch-ai|bosch-ai-cloud",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // NEC edges
  {
    data: {
      id: "edge:parent:nec->orbit:nec|bio-idiom",
      source: "parent:nec",
      target: "orbit:nec|bio-idiom",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:nec->orbit:nec|video-analytics-ai",
      source: "parent:nec",
      target: "orbit:nec|video-analytics-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:nec->orbit:nec|nec-cloud-ai",
      source: "parent:nec",
      target: "orbit:nec|nec-cloud-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Preferred Networks edges
  {
    data: {
      id: "edge:parent:preferred-networks->orbit:preferred-networks|optuna",
      source: "parent:preferred-networks",
      target: "orbit:preferred-networks|optuna",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:preferred-networks->orbit:preferred-networks|mn-core-ai",
      source: "parent:preferred-networks",
      target: "orbit:preferred-networks|mn-core-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:preferred-networks->orbit:preferred-networks|paintschainer",
      source: "parent:preferred-networks",
      target: "orbit:preferred-networks|paintschainer",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // C3.ai edges
  {
    data: {
      id: "edge:parent:c3-ai->orbit:c3-ai|c3-generative-ai",
      source: "parent:c3-ai",
      target: "orbit:c3-ai|c3-generative-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:c3-ai->orbit:c3-ai|enterprise-ai-apps",
      source: "parent:c3-ai",
      target: "orbit:c3-ai|enterprise-ai-apps",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:c3-ai->orbit:c3-ai|c3-ai-platform",
      source: "parent:c3-ai",
      target: "orbit:c3-ai|c3-ai-platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Palantir edges
  {
    data: {
      id: "edge:parent:palantir-aip->orbit:palantir-aip|gotham-platform",
      source: "parent:palantir-aip",
      target: "orbit:palantir-aip|gotham-platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:palantir-aip->orbit:palantir-aip|foundry-platform",
      source: "parent:palantir-aip",
      target: "orbit:palantir-aip|foundry-platform",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:palantir-aip->orbit:palantir-aip|ontology-sdk",
      source: "parent:palantir-aip",
      target: "orbit:palantir-aip|ontology-sdk",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // ServiceNow edges
  {
    data: {
      id: "edge:parent:servicenow-ai->orbit:servicenow-ai|now-assist",
      source: "parent:servicenow-ai",
      target: "orbit:servicenow-ai|now-assist",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:servicenow-ai->orbit:servicenow-ai|ai-integration-hub",
      source: "parent:servicenow-ai",
      target: "orbit:servicenow-ai|ai-integration-hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:servicenow-ai->orbit:servicenow-ai|now-platform-ai",
      source: "parent:servicenow-ai",
      target: "orbit:servicenow-ai|now-platform-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Workday edges
  {
    data: {
      id: "edge:parent:workday-ai->orbit:workday-ai|skills-cloud",
      source: "parent:workday-ai",
      target: "orbit:workday-ai|skills-cloud",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:workday-ai->orbit:workday-ai|talent-optimization",
      source: "parent:workday-ai",
      target: "orbit:workday-ai|talent-optimization",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:workday-ai->orbit:workday-ai|workday-extend-ai",
      source: "parent:workday-ai",
      target: "orbit:workday-ai|workday-extend-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Intuit edges
  {
    data: {
      id: "edge:parent:intuit-ai->orbit:intuit-ai|intuit-assist",
      source: "parent:intuit-ai",
      target: "orbit:intuit-ai|intuit-assist",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:intuit-ai->orbit:intuit-ai|quickbooks-ai",
      source: "parent:intuit-ai",
      target: "orbit:intuit-ai|quickbooks-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:intuit-ai->orbit:intuit-ai|genos",
      source: "parent:intuit-ai",
      target: "orbit:intuit-ai|genos",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Qualcomm edges
  {
    data: {
      id: "edge:parent:qualcomm-ai->orbit:qualcomm-ai|snapdragon-platforms",
      source: "parent:qualcomm-ai",
      target: "orbit:qualcomm-ai|snapdragon-platforms",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:qualcomm-ai->orbit:qualcomm-ai|ai-hub",
      source: "parent:qualcomm-ai",
      target: "orbit:qualcomm-ai|ai-hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:qualcomm-ai->orbit:qualcomm-ai|ai-engine-sdk",
      source: "parent:qualcomm-ai",
      target: "orbit:qualcomm-ai|ai-engine-sdk",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // AMD edges
  {
    data: {
      id: "edge:parent:amd-ai->orbit:amd-ai|instinct-mi300",
      source: "parent:amd-ai",
      target: "orbit:amd-ai|instinct-mi300",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:amd-ai->orbit:amd-ai|ryzen-ai",
      source: "parent:amd-ai",
      target: "orbit:amd-ai|ryzen-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:amd-ai->orbit:amd-ai|infinity-hub",
      source: "parent:amd-ai",
      target: "orbit:amd-ai|infinity-hub",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Arm edges
  {
    data: {
      id: "edge:parent:arm-ai->orbit:arm-ai|ethos-npu",
      source: "parent:arm-ai",
      target: "orbit:arm-ai|ethos-npu",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:arm-ai->orbit:arm-ai|cortex-a-m-cpus",
      source: "parent:arm-ai",
      target: "orbit:arm-ai|cortex-a-m-cpus",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:arm-ai->orbit:arm-ai|arm-nn",
      source: "parent:arm-ai",
      target: "orbit:arm-ai|arm-nn",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Infosys edges
  {
    data: {
      id: "edge:parent:infosys-topaz->orbit:infosys-topaz|ai-services",
      source: "parent:infosys-topaz",
      target: "orbit:infosys-topaz|ai-services",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:infosys-topaz->orbit:infosys-topaz|data-analytics",
      source: "parent:infosys-topaz",
      target: "orbit:infosys-topaz|data-analytics",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:infosys-topaz->orbit:infosys-topaz|infosys-cobalt",
      source: "parent:infosys-topaz",
      target: "orbit:infosys-topaz|infosys-cobalt",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // Wipro edges
  {
    data: {
      id: "edge:parent:wipro-ai360->orbit:wipro-ai360|ai-consulting",
      source: "parent:wipro-ai360",
      target: "orbit:wipro-ai360|ai-consulting",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:wipro-ai360->orbit:wipro-ai360|industry-solutions",
      source: "parent:wipro-ai360",
      target: "orbit:wipro-ai360|industry-solutions",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:wipro-ai360->orbit:wipro-ai360|wipro-holmes",
      source: "parent:wipro-ai360",
      target: "orbit:wipro-ai360|wipro-holmes",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // TCS edges
  {
    data: {
      id: "edge:parent:tcs-ai->orbit:tcs-ai|enterprise-ai",
      source: "parent:tcs-ai",
      target: "orbit:tcs-ai|enterprise-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tcs-ai->orbit:tcs-ai|tcs-cmi",
      source: "parent:tcs-ai",
      target: "orbit:tcs-ai|tcs-cmi",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:tcs-ai->orbit:tcs-ai|ignio-aiops",
      source: "parent:tcs-ai",
      target: "orbit:tcs-ai|ignio-aiops",
      relation: "has-orbit",
      weight: 1
    }
  },
  
  // JioBrain edges
  {
    data: {
      id: "edge:parent:jiobrain->orbit:jiobrain|jio-services-ai",
      source: "parent:jiobrain",
      target: "orbit:jiobrain|jio-services-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:jiobrain->orbit:jiobrain|jiomart-ai",
      source: "parent:jiobrain",
      target: "orbit:jiobrain|jiomart-ai",
      relation: "has-orbit",
      weight: 1
    }
  },
  {
    data: {
      id: "edge:parent:jiobrain->orbit:jiobrain|ai-apis",
      source: "parent:jiobrain",
      target: "orbit:jiobrain|ai-apis",
      relation: "has-orbit",
      weight: 1
    }
  }
);
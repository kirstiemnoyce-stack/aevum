// ===================================================================
// IMAGE GENERATION API — Multi-provider support
// ===================================================================
// Providers: OpenAI DALL-E, Stability AI, Replicate
// API keys are stored encrypted in localStorage
// ===================================================================

export type ImageProvider = 'openai' | 'stability' | 'replicate';

export interface ImageProviderConfig {
  id: ImageProvider;
  name: string;
  description: string;
  website: string;
  signupUrl: string;
  costPerImage: string;
  docsUrl: string;
}

export const IMAGE_PROVIDERS: ImageProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI DALL-E 3',
    description: 'Best quality, most reliable. Great for detailed, artistic images.',
    website: 'platform.openai.com',
    signupUrl: 'https://platform.openai.com/signup',
    costPerImage: '~$0.04–$0.08',
    docsUrl: 'https://platform.openai.com/docs/guides/images',
  },
  {
    id: 'stability',
    name: 'Stability AI',
    description: 'Fast, affordable. Good for artistic and stylised images.',
    website: 'platform.stability.ai',
    signupUrl: 'https://platform.stability.ai',
    costPerImage: '~$0.01–$0.03',
    docsUrl: 'https://platform.stability.ai/docs',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: 'Access to many open-source models (SDXL, Flux, etc.).',
    website: 'replicate.com',
    signupUrl: 'https://replicate.com',
    costPerImage: '~$0.01–$0.05',
    docsUrl: 'https://replicate.com/docs',
  },
];

// Simple XOR encryption for API keys (not military-grade, but protects from casual snooping)
function encrypt(text: string, key: string = 'aevum-key-v1'): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function decrypt(encoded: string, key: string = 'aevum-key-v1'): string {
  try {
    const text = atob(encoded);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return '';
  }
}

export function storeApiKey(provider: ImageProvider, apiKey: string): void {
  localStorage.setItem(`aevum_apikey_${provider}`, encrypt(apiKey));
}

export function getApiKey(provider: ImageProvider): string {
  const stored = localStorage.getItem(`aevum_apikey_${provider}`);
  return stored ? decrypt(stored) : '';
}

export function removeApiKey(provider: ImageProvider): void {
  localStorage.removeItem(`aevum_apikey_${provider}`);
}

export function hasApiKey(provider: ImageProvider): boolean {
  return !!getApiKey(provider);
}

export function getDefaultProvider(): ImageProvider {
  const saved = localStorage.getItem('aevum_default_image_provider') as ImageProvider;
  if (saved && IMAGE_PROVIDERS.find(p => p.id === saved)) return saved;
  // Return first provider with a key, or openai as default
  for (const p of IMAGE_PROVIDERS) {
    if (hasApiKey(p.id)) return p.id;
  }
  return 'openai';
}

export function setDefaultProvider(provider: ImageProvider): void {
  localStorage.setItem('aevum_default_image_provider', provider);
}

// ===================================================================
// API CALLS — Each provider's generate function
// ===================================================================

export interface GenerationResult {
  imageUrl: string;
  provider: ImageProvider;
  model: string;
}

// OpenAI DALL-E 3
async function generateOpenAI(prompt: string, apiKey: string): Promise<GenerationResult> {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return { imageUrl: data.data[0].url, provider: 'openai', model: 'dall-e-3' };
}

// Stability AI
async function generateStability(prompt: string, apiKey: string): Promise<GenerationResult> {
  const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'image/*',
    },
    body: new URLSearchParams({
      prompt,
      output_format: 'png',
      aspect_ratio: '1:1',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || err.name || `Stability API error: ${response.status}`);
  }

  // Stability returns raw image bytes
  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
  return { imageUrl, provider: 'stability', model: 'sd3' };
}

// Replicate (using Flux Schnell as default — fast and cheap)
async function generateReplicate(prompt: string, apiKey: string): Promise<GenerationResult> {
  // Start the prediction
  const startResponse = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiKey}`,
      'Prefer': 'wait', // Wait for result (up to 60s)
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '1:1',
        output_format: 'png',
        output_quality: 80,
      },
    }),
  });

  if (!startResponse.ok) {
    const err = await startResponse.json().catch(() => ({}));
    throw new Error(err.detail || `Replicate API error: ${startResponse.status}`);
  }

  const prediction = await startResponse.json();

  // If using Prefer: wait, the result comes back directly
  if (prediction.output) {
    const output = prediction.output;
    const imageUrl = Array.isArray(output) ? output[0] : output;
    return { imageUrl, provider: 'replicate', model: 'flux-schnell' };
  }

  // Otherwise poll for result
  const getResult = async (): Promise<string> => {
    const pollResponse = await fetch(prediction.urls.get, {
      headers: { 'Authorization': `Token ${apiKey}` },
    });
    const pollData = await pollResponse.json();

    if (pollData.status === 'succeeded') {
      const out = pollData.output;
      return Array.isArray(out) ? out[0] : out;
    }
    if (pollData.status === 'failed') {
      throw new Error(pollData.error || 'Replicate generation failed');
    }
    // Wait and retry
    await new Promise(r => setTimeout(r, 1000));
    return getResult();
  };

  const imageUrl = await getResult();
  return { imageUrl, provider: 'replicate', model: 'flux-schnell' };
}

// Main generate function — dispatches to the right provider
export async function generateImage(
  prompt: string,
  provider?: ImageProvider
): Promise<GenerationResult> {
  const prov = provider || getDefaultProvider();
  const apiKey = getApiKey(prov);

  if (!apiKey) {
    throw new Error(`No API key found for ${prov}. Please add your API key in Settings > Image Generation.`);
  }

  switch (prov) {
    case 'openai':
      return generateOpenAI(prompt, apiKey);
    case 'stability':
      return generateStability(prompt, apiKey);
    case 'replicate':
      return generateReplicate(prompt, apiKey);
    default:
      throw new Error(`Unknown provider: ${prov}`);
  }
}

// Check if any provider is configured
export function isAnyProviderConfigured(): boolean {
  return IMAGE_PROVIDERS.some(p => hasApiKey(p.id));
}

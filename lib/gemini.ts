import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export interface CrisisResult {
  crisis_flag: boolean;
  crisis_level: 'none' | 'low' | 'medium' | 'high';
  crisis_reason: string | null;
}

export interface EmotionTranslationResult {
  summary: string;
  core_emotions: string[];
  underlying_needs: string[];
  triggers: string[];
  intensity_level: 'mild' | 'moderate' | 'intense';
}

export interface ConversationGuideResult {
  what_to_say: string[];
  what_not_to_say: string[];
  conversation_starters: string[];
  next_steps: string[];
  tone_guidance: string;
}

export interface FullTranslationResult {
  crisis: CrisisResult;
  emotion: EmotionTranslationResult;
  guide: ConversationGuideResult;
}

// Sanitize input text
function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 2000);
}

// Parse JSON safely
function parseJSON<T>(text: string): T | null {
  try {
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

// CALL 1 — Crisis Detection
export async function detectCrisis(text: string): Promise<CrisisResult> {
  const sanitized = sanitizeText(text);
  
  const prompt = `You are a mental health safety classifier for a teen support platform.
Analyze this text for crisis signals: self-harm, suicidal ideation, abuse, or immediate danger.
Respond ONLY in JSON:
{ "crisis_flag": boolean, "crisis_level": "none"|"low"|"medium"|"high", "crisis_reason": string|null }

Text to analyze:
${sanitized}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  const parsed = parseJSON<CrisisResult>(response);
  
  if (!parsed) {
    return {
      crisis_flag: false,
      crisis_level: 'none',
      crisis_reason: null
    };
  }
  
  return parsed;
}

// CALL 2 — Emotion Translation
export async function translateEmotions(text: string): Promise<EmotionTranslationResult> {
  const sanitized = sanitizeText(text);
  
  const prompt = `You are a child psychologist helping adults understand teen emotions.
Translate this teen's raw expression into clear, warm language for a parent or counselor.
Respond ONLY in JSON:
{ "summary": string, "core_emotions": string[], "underlying_needs": string[], "triggers": string[], "intensity_level": "mild"|"moderate"|"intense" }

Text to translate:
${sanitized}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  const parsed = parseJSON<EmotionTranslationResult>(response);
  
  if (!parsed) {
    return {
      summary: 'Unable to analyze emotions at this time.',
      core_emotions: [],
      underlying_needs: [],
      triggers: [],
      intensity_level: 'mild'
    };
  }
  
  return parsed;
}

// CALL 3 — Conversation Guide
export async function generateConversationGuide(
  text: string,
  emotion: EmotionTranslationResult
): Promise<ConversationGuideResult> {
  const sanitized = sanitizeText(text);
  
  const prompt = `You are a family therapist. Generate a practical conversation guide for the adult based on the teen's emotional state.
Respond ONLY in JSON:
{ "what_to_say": string[], "what_not_to_say": string[], "conversation_starters": string[], "next_steps": string[], "tone_guidance": string }

Teen's expression:
${sanitized}

Their emotions: ${emotion.core_emotions.join(', ')}
Intensity: ${emotion.intensity_level}
What they need: ${emotion.underlying_needs.join(', ')}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  const parsed = parseJSON<ConversationGuideResult>(response);
  
  if (!parsed) {
    return {
      what_to_say: ['Start with open-ended questions'],
      what_not_to_say: ['Avoid dismissing their feelings'],
      conversation_starters: ['How have you been feeling lately?'],
      next_steps: ['Continue the conversation tomorrow'],
      tone_guidance: 'Be patient and understanding'
    };
  }
  
  return parsed;
}

// Full pipeline
export async function runFullTranslationPipeline(text: string): Promise<FullTranslationResult> {
  // Step 1: Crisis detection
  const crisis = await detectCrisis(text);
  
  // If crisis is medium or high, return early
  if (crisis.crisis_level === 'medium' || crisis.crisis_level === 'high') {
    return {
      crisis,
      emotion: {
        summary: 'Crisis detected - immediate attention needed',
        core_emotions: [],
        underlying_needs: [],
        triggers: [],
        intensity_level: 'intense'
      },
      guide: {
        what_to_say: ['Reach out to professional help immediately'],
        what_not_to_say: ['Do not ignore warning signs'],
        conversation_starters: ['Call crisis hotline'],
        next_steps: ['Contact emergency services if needed'],
        tone_guidance: 'Urgent and supportive'
      }
    };
  }
  
  // Step 2: Translate emotions first
  const emotion = await translateEmotions(text);
  
  // Step 3: Generate guide with actual emotion data
  const guide = await generateConversationGuide(text, emotion);
  
  return {
    crisis,
    emotion,
    guide
  };
}


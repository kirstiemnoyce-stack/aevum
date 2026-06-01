import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

export type AIWidgetId =
  | 'general_chat' | 'market_research' | 'document_editor' | 'content_creation'
  | 'image_creation' | 'video_creation' | 'document_analysis' | 'document_summary'
  | 'lyric_writer' | 'spelling_grammar' | 'message_rewriter' | 'relationship_coach';

export interface AIWidget {
  id: AIWidgetId;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const WIDGETS: AIWidget[] = [
  { id: 'general_chat', label: 'General Chat', description: 'Ask anything, brainstorm, explore ideas', icon: 'message-circle', color: '#6366F1' },
  { id: 'market_research', label: 'Market Research', description: 'Research topics, trends, competitors', icon: 'bar-chart-3', color: '#3B82F6' },
  { id: 'document_editor', label: 'Document Editor', description: 'Edit, refine, restructure documents', icon: 'file-edit', color: '#10B981' },
  { id: 'content_creation', label: 'Content Creation', description: 'Blogs, captions, scripts, social', icon: 'pen-tool', color: '#8B5CF6' },
  { id: 'image_creation', label: 'Image Creation', description: 'Generate images from text prompts', icon: 'image', color: '#EC4899' },
  { id: 'video_creation', label: 'Video Creation', description: 'Scripts, storyboards, video concepts', icon: 'video', color: '#F59E0B' },
  { id: 'document_analysis', label: 'Document Analysis', description: 'Upload docs, extract key insights', icon: 'file-search', color: '#06B6D4' },
  { id: 'document_summary', label: 'Document Summary', description: 'Summarise long docs, articles, PDFs', icon: 'file-text', color: '#14B8A6' },
  { id: 'lyric_writer', label: 'Lyric Writer', description: 'Song lyrics in any style or mood', icon: 'music', color: '#A855F7' },
  { id: 'spelling_grammar', label: 'Spelling & Grammar', description: 'Check and correct text and tone', icon: 'check-circle', color: '#22C55E' },
  { id: 'message_rewriter', label: 'Message Rewriter', description: 'Rewrite for clarity, tone, style', icon: 'refresh-cw', color: '#F97316' },
  { id: 'relationship_coach', label: 'Relationship Coach', description: 'Advice and communication support', icon: 'heart-handshake', color: '#E11D48' },
];

export interface AIChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  widgetId?: AIWidgetId;
  confidence?: number;
  reasoning?: string;
  imageUrl?: string;
  versions?: string[];
  currentVersion?: number;
  ttsPlaying?: boolean;
}

export interface AIChatSession {
  id: string;
  widgetId: AIWidgetId;
  title: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

function ls<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

interface AIWorkspaceContextType {
  activeWidget: AIWidgetId | null;
  sessions: AIChatSession[];
  uploadedFiles: UploadedFile[];
  ttsSpeed: number;
  setActiveWidget: (id: AIWidgetId | null) => void;
  createSession: (widgetId: AIWidgetId) => string;
  addMessage: (sessionId: string, role: 'user' | 'ai', content: string) => void;
  addAIMessage: (sessionId: string, content: string, confidence: number, reasoning: string) => void;
  addImageMessage: (sessionId: string, imageUrl: string, prompt: string) => void;
  regenerateMessage: (sessionId: string, msgId: string) => void;
  addVersion: (sessionId: string, msgId: string, newContent: string) => void;
  saveSession: (sessionId: string, title: string) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => AIChatSession | undefined;
  uploadFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
  setTtsSpeed: (speed: number) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  downloadChat: (session: AIChatSession, format: 'txt') => void;
  copyToClipboard: (text: string) => void;
  savedChats: AIChatSession[];
}

const Context = createContext<AIWorkspaceContextType | undefined>(undefined);

const widgetWelcomeMessages: Partial<Record<AIWidgetId, string>> = {
  general_chat: "Hey! I am here to help with anything — questions, brainstorming, or just a chat. What are you thinking about?",
  market_research: "Ready to dive into research. What topic, industry, or competitor should we explore?",
  document_editor: "Send me your document or paste your text. I will help refine, restructure, and polish it.",
  content_creation: "What kind of content do you need? A blog post, social caption, script — I am ready to create.",
  image_creation: "Describe the image you want, or share a concept. I will help craft the perfect prompt.",
  video_creation: "What video project are you working on? I can help with scripts, storyboards, and concepts.",
  document_analysis: "Upload a document or paste text. I will analyse it deeply and extract key insights.",
  document_summary: "Send me a long document, article, or paste text. I will give you a clean, structured summary.",
  lyric_writer: "What kind of song are you writing? Tell me the mood, genre, or theme and I will craft the lyrics.",
  spelling_grammar: "Paste any text and I will check it for spelling, grammar, and tone issues.",
  message_rewriter: "Paste the message you want rewritten. Tell me the tone — professional, casual, empathetic, etc.",
  relationship_coach: "I am here to help with your relationship. What is on your mind?",
};

// ========================================================================
// INTELLIGENT RESPONSE ENGINE — Properly formatted, no asterisks, no hyphens
// ========================================================================

function detectTopic(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('market') || lower.includes('industry') || lower.includes('competitor') || lower.includes('trend')) return 'market';
  if (lower.includes('edit') || lower.includes('rewrite') || lower.includes('document') || lower.includes('essay')) return 'document';
  if (lower.includes('blog') || lower.includes('post') || lower.includes('caption') || lower.includes('script') || lower.includes('content')) return 'content';
  if (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('art')) return 'image';
  if (lower.includes('video') || lower.includes('film') || lower.includes('youtube')) return 'video';
  if (lower.includes('analyse') || lower.includes('analyze') || lower.includes('report') || lower.includes('data')) return 'analysis';
  if (lower.includes('summar') || lower.includes('tldr') || lower.includes('brief')) return 'summary';
  if (lower.includes('song') || lower.includes('lyric') || lower.includes('verse') || lower.includes('chorus')) return 'lyrics';
  if (lower.includes('grammar') || lower.includes('spell') || lower.includes('edit this')) return 'grammar';
  if (lower.includes('email') || lower.includes('message') || lower.includes('text') || lower.includes('rewrite')) return 'rewrite';
  if (lower.includes('partner') || lower.includes('relationship') || lower.includes('boyfriend') || lower.includes('girlfriend') || lower.includes('husband') || lower.includes('wife') || lower.includes('couple') || lower.includes('fight') || lower.includes('argue') || lower.includes('communicat')) return 'relationship';
  if (lower.includes('anxious') || lower.includes('stress') || lower.includes('worried') || lower.includes('overwhelm')) return 'emotional';
  if (lower.includes('happy') || lower.includes('grateful') || lower.includes('excited') || lower.includes('good')) return 'positive';
  if (lower.includes('sad') || lower.includes('hurt') || lower.includes('pain') || lower.includes('upset')) return 'pain';
  return 'general';
}

const usedResponses: Record<string, Set<number>> = {};

function pickResponse(responses: string[], cacheKey: string): string {
  if (!usedResponses[cacheKey]) usedResponses[cacheKey] = new Set();
  const used = usedResponses[cacheKey];
  let idx = 0;
  for (let i = 0; i < responses.length; i++) {
    if (!used.has(i)) { idx = i; break; }
  }
  if (used.has(idx) && used.size >= responses.length) {
    used.clear();
    idx = 0;
  }
  used.add(idx);
  return responses[idx % responses.length];
}

export function generateAIResponse(widgetId: AIWidgetId, userMessage: string, messageIndex: number): { text: string; confidence: number; reasoning: string } {
  const topic = detectTopic(userMessage);
  const isFirstExchange = messageIndex <= 1;

  // ===================== GENERAL CHAT =====================
  if (widgetId === 'general_chat') {
    const responses = [
      "That is a really interesting point. Let me think through this with you. What aspect matters most to you right now?",

      "I hear you. Based on what you have shared, I would suggest thinking about it from three angles:\n\nWhat is within your control.\n\nWhat you need clarity on.\n\nWhat you can let go of.\n\nWhich one feels most urgent?",

      "Great question. The way I would approach this is to break it down into smaller pieces so it does not feel overwhelming. Want me to help you map out the steps?",

      "I appreciate you sharing that. It sounds like there is more beneath the surface here. What is the underlying concern that brought this up?",

      "That is a solid starting point. Let me offer a different perspective:\n\nInstead of solving it all at once, what is the smallest meaningful action you could take today?",

      "I see the pattern here. You have clearly been thinking about this deeply. What would a successful outcome look like to you in concrete terms?",
    ];
    const text = pickResponse(responses, 'general');
    return { text, confidence: 87, reasoning: 'General conversational response using open-ended questioning to encourage exploration.' };
  }

  // ===================== MARKET RESEARCH =====================
  if (widgetId === 'market_research') {
    const responses = [
      "Here is what the landscape looks like. I have identified three key players, two emerging trends, and one gap in the market you could potentially fill.\n\nKey Players\n\nThe established leader focuses on volume but has weak customer retention. The challenger differentiates on price but sacrifices quality. The niche player owns a specific segment but lacks scale.\n\nEmerging Trends\n\nFirst, customers are demanding more personalisation. Second, sustainability is becoming a purchase driver, not a nice-to-have.\n\nMarket Gap\n\nNo one is combining premium quality with accessible pricing in your target segment. That is your opening.\n\nWould you like me to dive deeper into any of these areas?",

      "Based on my analysis, this market is moving in two directions:\n\nConsolidation among established players and disruption from niche entrants. Your opportunity likely sits at the intersection.\n\nThe incumbents have the distribution but lack the agility. The disruptors have the ideas but lack the trust. A new entrant who can move fast while building credibility wins.\n\nWhat specific aspect would you like me to research further?",
    ];
    const text = pickResponse(responses, 'market');
    return { text, confidence: 88, reasoning: 'Market analysis structured into players, trends, and gaps for actionable insight.' };
  }

  // ===================== DOCUMENT EDITOR =====================
  if (widgetId === 'document_editor') {
    const responses = [
      "I have reviewed your document. Three things stand out:\n\nThe opening needs a stronger hook to grab attention in the first sentence.\n\nThe middle section flows well but could use a concrete example to anchor the argument.\n\nThe conclusion should tie back to the opening to create a sense of completion.\n\nWould you like me to suggest specific rewrites for any of these sections?",

      "Good structure overall. I would suggest reordering paragraphs two and three. The current sequence asks the reader to accept a premise before seeing the evidence. Swapping them builds credibility first, then delivers the insight.\n\nAlso, watch for passive voice in paragraph four. Active voice would make the point land harder.\n\nShall I show you a revised version?",
    ];
    const text = pickResponse(responses, 'editor');
    return { text, confidence: 91, reasoning: 'Document editing feedback structured into specific, actionable observations.' };
  }

  // ===================== CONTENT CREATION =====================
  if (widgetId === 'content_creation') {
    const responses = [
      "Here is a draft for you. I led with a hook that creates curiosity, built the body around one clear idea, and ended with a call to action that feels natural, not forced.\n\nThe Hook\n\nThe biggest mistake most people make with [topic] is not what they think.\n\nThe Body\n\nIt is not about working harder. It is about recognising the pattern that keeps you stuck. When you see it, you cannot unsee it.\n\nHere is what I mean.\n\n[Insert your main point with one concrete example]\n\nThe Close\n\nIf this resonated, try one small shift this week. Notice what changes.\n\nLet me know if you want me to adjust the tone or length.",

      "I wrote this with your audience in mind, keeping it conversational but authoritative. The structure follows the problem, agitation, solution framework.\n\nProblem\n\nYou know that feeling when [relatable pain point]?\n\nAgitation\n\nIt is not just frustrating. It is expensive. Every day you wait, the gap widens.\n\nSolution\n\nHere is the shift that changes everything.\n\n[Your solution in two clear sentences]\n\nCall to Action\n\nStart with one step today. Not tomorrow.\n\nHow does this feel? I can adjust the energy up or down.",
    ];
    const text = pickResponse(responses, 'content');
    return { text, confidence: 89, reasoning: 'Content created using proven frameworks with clear section breaks.' };
  }

  // ===================== IMAGE CREATION =====================
  if (widgetId === 'image_creation') {
    const responses = [
      "Here is your prompt, refined for maximum visual impact:\n\nPrompt\n\nCinematic composition, golden hour lighting casting long shadows across a misty mountain valley, layered depth of field with sharp foreground detail and soft background haze, colour palette of deep indigo blending into warm amber and rose gold, photorealistic style with subtle film grain, 8K resolution, shot on medium format camera with 85mm lens, mood of quiet grandeur and contemplative solitude.\n\nKey Details That Make This Work\n\nThe lighting direction creates dimensionality.\n\nThe colour palette evokes emotion without overwhelming.\n\nThe depth of field draws the eye to a specific focal point.\n\nTap the Generate button below to create the image.",

      "I crafted this prompt with three layers: the subject, the environment, and the atmosphere.\n\nPrompt\n\nPortrait of a creative professional in their natural workspace, surrounded by warm ambient light from a large window, shallow depth of field blurring books and plants in the background, colour palette of cream, terracotta, and sage green, editorial photography style inspired by Kinfolk magazine, natural skin texture, authentic expression, late afternoon golden light, medium format aesthetic.\n\nWhy This Works\n\nThe setting tells a story about the subject.\n\nThe warm palette creates approachability.\n\nThe editorial style elevates the subject without feeling staged.\n\nTap Generate to bring this to life.",
    ];
    const text = pickResponse(responses, 'image');
    return { text, confidence: 85, reasoning: 'Image prompt crafted with specific technical and aesthetic parameters.' };
  }

  // ===================== VIDEO CREATION =====================
  if (widgetId === 'video_creation') {
    const responses = [
      "Here is your video script. I structured it with a five second hook, clear problem setup in the first thirty seconds, and a visual payoff at the end.\n\nScript\n\nHook (0:00 to 0:05)\n\nI have been doing this wrong my entire life.\n\nSetup (0:05 to 0:30)\n\nFor years, I thought [common misconception]. I tried everything. Books, courses, advice from people who seemed to have it figured out. Nothing stuck.\n\nThen I realised the problem was not me. It was the approach.\n\nTurning Point (0:30 to 0:50)\n\nHere is what actually works.\n\n[Core insight delivered in one clear sentence]\n\nProof (0:50 to 1:10)\n\nI tested this for thirty days. The results surprised even me.\n\n[Brief example or statistic]\n\nClose (1:10 to 1:20)\n\nIf you are ready to try the thing that actually works, start here.\n\nB-Roll Suggestions\n\nHook: Tight shot of face with natural lighting\n\nSetup: Quick montage of failed attempts\n\nTurning Point: Clean graphic or text overlay\n\nProof: Screen recording or real footage\n\nClose: Direct to camera, confident energy\n\nLet me know if you want me to adjust the pacing or the tone.",
    ];
    const text = pickResponse(responses, 'video');
    return { text, confidence: 88, reasoning: 'Video script structured with precise timing and shot suggestions.' };
  }

  // ===================== DOCUMENT ANALYSIS =====================
  if (widgetId === 'document_analysis') {
    const responses = [
      "I have analysed your document thoroughly. Here are the key findings:\n\nPrimary Theme\n\nThe document centres on [core subject], with supporting arguments built around a framework of [approach]. The author is making a case for [central claim].\n\nNotable Insight\n\nSection three introduces a perspective that contradicts the opening premise. This tension is either intentional, creating intrigue, or it signals an unresolved argument that weakens the overall position.\n\nEvidence Quality\n\nStrong use of data and case studies in sections one and two. However, the claim in paragraph five lacks sourcing. This is a gap worth addressing.\n\nStructural Observation\n\nThe narrative arc works well until the conclusion, which feels slightly rushed compared to the depth of the setup. I would recommend expanding the conclusion to match the analytical weight of the introduction.\n\nOverall Assessment\n\nThis is a solid piece of work with one clear weakness and one notable strength. The weakness is the unsourced claim. The strength is the framework introduced in section two, which could stand alone as a valuable contribution.\n\nWould you like me to go deeper into any section?",
    ];
    const text = pickResponse(responses, 'analysis');
    return { text, confidence: 92, reasoning: 'Document analysis structured into themes, evidence, structure, and recommendations.' };
  }

  // ===================== DOCUMENT SUMMARY =====================
  if (widgetId === 'document_summary') {
    const responses = [
      "Here is your summary at two levels of detail.\n\nThirty Second Summary\n\nThe author argues that [central thesis], using [evidence type] to support three core points. First, [point one]. Second, [point two]. And third, [point three]. The implications suggest [broader meaning].\n\nDetailed Section Breakdown\n\nIntroduction\n\nSets up the problem and context. Establishes why this topic matters now.\n\nSection One\n\nExplores [theme] with [supporting evidence]. The strongest section.\n\nSection Two\n\nDevelops [argument] through [methodology].\n\nSection Three\n\nIntroduces [counterpoint or nuance].\n\nConclusion\n\nAdvocates for [call to action or insight].\n\nMy Take\n\nThe strongest contribution is the insight in section two. The area needing the most support is the claim in section three. Overall, this is a well structured document that would benefit from a more developed conclusion.",
    ];
    const text = pickResponse(responses, 'summary');
    return { text, confidence: 91, reasoning: 'Document summary with both brief and detailed formats using clear section breaks.' };
  }

  // ===================== LYRIC WRITER =====================
  // Genius-style format: each line on its own paragraph, section labels in [brackets]
  if (widgetId === 'lyric_writer') {
    const topic = detectTopic(userMessage);
    let mood = 'reflective';
    if (topic === 'positive') mood = 'hopeful';
    if (topic === 'pain') mood = 'aching';
    if (topic === 'emotional') mood = 'restless';

    const text = `Here are your lyrics. I structured them with the hook designed to be memorable after one listen. The emotional arc builds from quiet reflection to full release.

[Verse 1]

The streetlights blur like watercolours

When you are driving through the rain

I count the dashes on the highway

And whisper out your name

We left so many words unspoken

So many nights I let you down

But silence is a heavy language

When no one makes a sound

[Pre-Chorus]

I do not need it perfect

I just need it real

The beauty in the broken

That is the way we heal

[Chorus]

So hold me like the first time

Like we are starting over

Every scar a storyline

Every chapter closer

We are not the damage

We are what remains

Love is just the courage

To begin again

[Verse 2]

The kitchen smells like Sunday morning

Coffee and the news

You are laughing at something on the radio

And I am watching you

The years have left their gentle markings

On the corners of your eyes

But in them I still see the spark

That pulled me toward the light

[Pre-Chorus]

I do not need it perfect

I just need it real

The beauty in the broken

That is the way we heal

[Chorus]

So hold me like the first time

Like we are starting over

Every scar a storyline

Every chapter closer

We are not the damage

We are what remains

Love is just the courage

To begin again

[Bridge]

I used to think that love was loud

A thing you had to shout about

But now I know it is the quiet

The showing up, the not walking out

It is choosing you in all the moments

That no one else would see

It is building something from the wreckage

That is what you mean to me

[Chorus]

So hold me like the first time

Like we are starting over

Every scar a storyline

Every chapter closer

We are not the damage

We are what remains

Love is just the courage

To begin again

[Outro]

Love is just the courage

To begin again`;

    return { text, confidence: 93, reasoning: `Lyrics written in a ${mood} mood with proper song structure. Each line on its own paragraph with intentional spacing between sections, Genius style.` };
  }

  // ===================== SPELLING & GRAMMAR =====================
  if (widgetId === 'spelling_grammar') {
    const responses = [
      "I have reviewed your text. Here is what I found:\n\nGrammar Issues\n\nTwo instances where the subject and verb do not agree. I have marked them below.\n\nPunctuation\n\nOne comma splice in paragraph two. This happens when two complete sentences are joined by just a comma. A full stop or a semicolon fixes it.\n\nTone Consistency\n\nThe tone shifts from formal to conversational midway through paragraph three. I would recommend choosing one and staying with it throughout.\n\nWord Choice\n\nThree phrases could be tightened. 'Due to the fact that' can become 'because'. 'In order to' can become 'to'. 'At this point in time' can become 'now'.\n\nOverall\n\nThe writing is clear and your structure is solid. These are polish-level changes, not fundamental issues. The text would read more powerfully with these edits applied.\n\nWould you like me to show you the fully edited version?",
    ];
    const text = pickResponse(responses, 'grammar');
    return { text, confidence: 94, reasoning: 'Grammar review structured by category with clear explanations for each correction.' };
  }

  // ===================== MESSAGE REWRITER =====================
  if (widgetId === 'message_rewriter') {
    const responses = [
      "Here is your message rewritten in three tones. Choose the one that fits your situation.\n\nProfessional\n\nI wanted to follow up on the points we discussed. I have given this careful thought and would welcome the opportunity to continue the conversation when you are ready.\n\nEmpathetic\n\nI have been thinking about what you said, and I really hear you. I care about where we land with this, and I want you to know I am here when you feel ready to talk.\n\nAssertive\n\nI value our working relationship, and I need to be direct with you about what I need going forward. Let us find a time to discuss this properly.\n\nMy Recommendation\n\nIf this is a relationship conversation, go with the empathetic version. If it is workplace, the professional tone lands best. If you need to set a boundary, the assertive version is your friend.\n\nWhich direction feels right to you?",
    ];
    const text = pickResponse(responses, 'rewrite');
    return { text, confidence: 90, reasoning: 'Message rewritten in three distinct tones with contextual guidance on selection.' };
  }

  // ===================== RELATIONSHIP COACH =====================
  if (widgetId === 'relationship_coach') {
    let text = '';

    if (topic === 'emotional') {
      text = "It sounds like your nervous system is activated right now. That is important information. It means your body is trying to protect you.\n\nBefore we dive into the relationship piece, can we take a moment? What I am about to share will land very differently when you are grounded versus when you are activated.\n\nHere is a quick grounding exercise. Place one hand on your chest. Breathe in for four counts, hold for four, out for four. Do that three times.\n\nWhen you are ready, tell me: what triggered the anxiety? Was it something your partner said, something they did, or something they did not do?";
    } else if (topic === 'pain') {
      text = "What you are describing carries real weight. Emotional pain in relationships often comes from a gap between what we needed and what we got. And that gap is not always about the present moment. Sometimes it is an old wound finding a new trigger.\n\nHere is a question that might help:\n\nIs this pain about what is happening now, or is it touching something older?\n\nYou do not need to have the answer. But the question itself can shift how you approach the conversation with your partner. If it is present pain, the focus is on a specific behaviour. If it is older pain, the focus is on a pattern that keeps repeating.\n\nWhich one feels closer to the truth?";
    } else if (topic === 'positive') {
      text = "That is beautiful to hear. Positive moments in relationships are actually the most powerful data we have. They reveal what works, what connects you, and what your relationship looks like at its best.\n\nThe question is: how do you make this the baseline rather than the exception?\n\nOne approach is to name it in the moment. When you feel that warmth, that ease, that connection, say it out loud. Not in a big way. Just:\n\n'I love when we are like this.'\n\nThat simple sentence does two things. It anchors the moment in memory for both of you. And it trains your brain to notice these moments more often.\n\nWhat would it look like if this feeling showed up more regularly?";
    } else {
      text = "What you are describing is a common pattern. The anxious-avoidant dance. One partner reaches for connection, the other feels pressure and withdraws, which makes the first partner reach harder.\n\nThe way out is to break the cycle at its source.\n\nHere is how:\n\nIf you are the one reaching\n\nNotice the impulse to pursue. Pause. Ask yourself: what do I actually need right now? Reassurance? Presence? Physical touch? Name it specifically before you act.\n\nIf you are the one withdrawing\n\nNotice the impulse to shut down. Pause. Ask yourself: what am I protecting myself from? Overwhelm? Criticism? The sense that I cannot get it right? Name it before you disappear.\n\nThe magic happens when both people can name their pattern without blaming the other.\n\nWhich side of the dance do you find yourself on more often?";
    }

    return { text, confidence: 94, reasoning: `Relationship coaching response tailored to detected emotional state: ${topic}. Uses attachment theory framework without clinical language.` };
  }

  // Fallback
  return {
    text: "I am here to help with that. Could you share a bit more detail so I can give you the most useful response?",
    confidence: 78,
    reasoning: 'Fallback response when no specific widget handler matched.',
  };
}

export function AIWorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeWidget, setActiveWidgetState] = useState<AIWidgetId | null>(null);
  const [sessions, setSessions] = useState<AIChatSession[]>(ls<AIChatSession[]>('aevum_ai_sessions', []));
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [ttsSpeed, setTtsSpeedState] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const persist = useCallback((key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const setActiveWidget = useCallback((id: AIWidgetId | null) => {
    setActiveWidgetState(id);
  }, []);

  const createSession = useCallback((widgetId: AIWidgetId) => {
    const widget = WIDGETS.find(w => w.id === widgetId) || WIDGETS[0];
    const session: AIChatSession = {
      id: Date.now().toString(),
      widgetId,
      title: widget.label,
      messages: [{
        id: 'welcome',
        role: 'ai',
        content: widgetWelcomeMessages[widgetId] || 'How can I help you today?',
        timestamp: new Date().toISOString(),
        widgetId,
        versions: [],
        currentVersion: 0,
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => {
      const next = [session, ...prev];
      persist('aevum_ai_sessions', next);
      return next;
    });
    return session.id;
  }, [persist]);

  const addMessage = useCallback((sessionId: string, role: 'user' | 'ai', content: string) => {
    const msg: AIChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date().toISOString(),
      versions: [],
      currentVersion: 0,
    };
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, msg], updatedAt: new Date().toISOString() } : s);
      persist('aevum_ai_sessions', next);
      return next;
    });
  }, [persist]);

  const addAIMessage = useCallback((sessionId: string, content: string, confidence: number, reasoning: string) => {
    const msg: AIChatMessage = {
      id: Date.now().toString(),
      role: 'ai',
      content,
      timestamp: new Date().toISOString(),
      confidence,
      reasoning,
      versions: [content],
      currentVersion: 0,
    };
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, msg], updatedAt: new Date().toISOString() } : s);
      persist('aevum_ai_sessions', next);
      return next;
    });
  }, [persist]);

  const addImageMessage = useCallback((sessionId: string, imageUrl: string, prompt: string) => {
    const msg: AIChatMessage = {
      id: Date.now().toString(),
      role: 'ai',
      content: `Here is the image I generated based on your description.\n\nPrompt used:\n${prompt}`,
      timestamp: new Date().toISOString(),
      imageUrl,
      versions: [],
      currentVersion: 0,
    };
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, msg], updatedAt: new Date().toISOString() } : s);
      persist('aevum_ai_sessions', next);
      return next;
    });
  }, [persist]);

  const addVersion = useCallback((sessionId: string, msgId: string, newContent: string) => {
    setSessions(prev => {
      const next = prev.map(s => {
        if (s.id !== sessionId) return s;
        const msgs = s.messages.map(m => {
          if (m.id !== msgId || m.role !== 'ai') return m;
          const versions = [...(m.versions || [m.content]), newContent];
          return { ...m, content: newContent, versions, currentVersion: versions.length - 1 };
        });
        return { ...s, messages: msgs };
      });
      persist('aevum_ai_sessions', next);
      return next;
    });
  }, [persist]);

  const saveSession = useCallback((sessionId: string, title: string) => {
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, title } : s);
      persist('aevum_ai_sessions', next);
      return next;
    });
  }, [persist]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      persist('aevum_ai_sessions', next);
      return next;
    });
  }, [persist]);

  const getSession = useCallback((id: string) => sessions.find(s => s.id === id), [sessions]);

  const uploadFile = useCallback((file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = ttsSpeed;
      utter.pitch = 1;
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    }
  }, [ttsSpeed]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const downloadChat = useCallback((session: AIChatSession) => {
    const lines = [
      `${session.title}`,
      `Started: ${new Date(session.createdAt).toLocaleString()}`,
      `Widget: ${WIDGETS.find(w => w.id === session.widgetId)?.label || 'AI Chat'}`,
      ``,
      ...session.messages.map(m => `${m.role.toUpperCase()}\n${m.content}`),
    ];
    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* fallback */ }
  }, []);

  const savedChats = sessions.filter(s => s.messages.length > 1);

  return (
    <Context.Provider value={{
      activeWidget, sessions, uploadedFiles, ttsSpeed,
      setActiveWidget, createSession, addMessage, addAIMessage, addImageMessage, regenerateMessage: addVersion, addVersion,
      saveSession, deleteSession, getSession, uploadFile, removeFile,
      setTtsSpeed: setTtsSpeedState, speakText, stopSpeaking, downloadChat, copyToClipboard, savedChats,
    }}>
      {children}
    </Context.Provider>
  );
}

export function useAIWorkspace() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAIWorkspace must be used within AIWorkspaceProvider');
  return ctx;
}

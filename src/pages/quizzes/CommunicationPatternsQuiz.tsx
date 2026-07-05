import { useNavigate } from 'react-router-dom';
import { MessagesSquare } from 'lucide-react';
import QuizLayout from './QuizLayout';
import { useApp } from '@/contexts/AppContext';
import type { QuizQuestion } from './QuizLayout';

const questions: QuizQuestion[] = [
  // Proof-of-love fallacy
  { id: 'pl1', text: "I believe a loving partner should intuitively understand my needs without me explaining.", category: 'proof_of_love' },
  { id: 'pl2', text: "If my partner really loved me, they would just know what I need.", category: 'proof_of_love' },
  { id: 'pl3', text: "Having to explain my feelings feels like proof that my partner doesn't truly get me.", category: 'proof_of_love' },
  { id: 'pl4', text: "I feel disappointed when my partner doesn't anticipate my emotional needs.", category: 'proof_of_love' },
  // Vulnerability difficulty
  { id: 'vd1', text: "Expressing my deeper, softer feelings feels dangerous or exposing.", category: 'vulnerability' },
  { id: 'vd2', text: "I lead with anger or frustration when underneath I feel hurt or scared.", category: 'vulnerability' },
  { id: 'vd3', text: "I'd rather express what my partner did wrong than how they made me feel.", category: 'vulnerability' },
  { id: 'vd4', text: "I have a hard time saying 'I'm scared' or 'I miss you' directly.", category: 'vulnerability' },
  // Hypervigilance
  { id: 'hv1', text: "I'm constantly scanning for signs that my partner might be pulling away.", category: 'hypervigilance' },
  { id: 'hv2', text: "I notice changes in my partner's tone or texting patterns immediately.", category: 'hypervigilance' },
  { id: 'hv3', text: "I read into small changes in behavior as signs of bigger problems.", category: 'hypervigilance' },
  { id: 'hv4', text: "I feel a need to monitor the relationship to make sure it's okay.", category: 'hypervigilance' },
  // Coping: withdrawal
  { id: 'cw1', text: "When upset, I go quiet and shut down emotionally.", category: 'withdraw' },
  { id: 'cw2', text: "I need physical space to process my feelings before I can talk.", category: 'withdraw' },
  { id: 'cw3', text: "When overwhelmed, I feel unable to find words.", category: 'withdraw' },
  // Coping: pursuit
  { id: 'cp1', text: "When upset, I push for immediate resolution and reassurance.", category: 'pursue' },
  { id: 'cp2', text: "I feel a strong urge to talk things out right away, even if my partner needs space.", category: 'pursue' },
  { id: 'cp3', text: "Silence during conflict feels unbearable to me.", category: 'pursue' },
  // Coping: humor/deflection
  { id: 'ch1', text: "When emotions get intense, I try to make jokes or change the subject.", category: 'humor' },
  { id: 'ch2', text: "I use humor to deflect from feelings that feel too heavy.", category: 'humor' },
  // Coping: over-explaining/fixing
  { id: 'cf1', text: "When upset, I explain my perspective in great detail, trying to be understood.", category: 'explain' },
  { id: 'cf2', text: "I immediately try to fix the problem when conflict arises.", category: 'explain' },
  // Self-soothing capacity
  { id: 'ss1', text: "I can calm myself down without needing my partner to do it for me.", category: 'self_soothing' },
  { id: 'ss2', text: "I know what activities or practices help regulate my nervous system.", category: 'self_soothing' },
  { id: 'ss3', text: "Before approaching my partner with a concern, I can get to a grounded place first.", category: 'self_soothing' },
  // Signal return (avoidant behavior)
  { id: 'sr1', text: "When I need space, I tell my partner how long I'll be gone and that I'm coming back.", category: 'signal_return' },
  { id: 'sr2', text: "I understand that my withdrawal can feel like abandonment to my partner.", category: 'signal_return' },
  { id: 'sr3', text: "I make a point to reconnect after taking space, even if the conflict isn't fully resolved.", category: 'signal_return' },
];

const categories: Record<string, { label: string; description: string }> = {
  proof_of_love: { label: 'Proof-of-Love', description: 'Expecting mind-reading' },
  vulnerability: { label: 'Vulnerability', description: 'Difficulty expressing softness' },
  hypervigilance: { label: 'Hypervigilance', description: 'Constant threat-scanning' },
  withdraw: { label: 'Withdrawal', description: 'Shutting down when upset' },
  pursue: { label: 'Pursuit', description: 'Pushing for resolution' },
  humor: { label: 'Humor/Deflect', description: 'Avoiding through jokes' },
  explain: { label: 'Over-explain', description: 'Detail as coping' },
  self_soothing: { label: 'Self-Soothing', description: 'Regulating yourself' },
  signal_return: { label: 'Signal Return', description: 'Reconnecting after space' },
};

function calculateResults(responses: Record<string, number>) {
  const scores: Record<string, number> = {
    proof_of_love: 0, vulnerability: 0, hypervigilance: 0,
    withdraw: 0, pursue: 0, humor: 0, explain: 0,
    self_soothing: 0, signal_return: 0,
  };
  const counts: Record<string, number> = {
    proof_of_love: 0, vulnerability: 0, hypervigilance: 0,
    withdraw: 0, pursue: 0, humor: 0, explain: 0,
    self_soothing: 0, signal_return: 0,
  };

  questions.forEach(q => {
    const val = responses[q.id] || 3;
    scores[q.category] += val;
    counts[q.category]++;
  });

  const normalized: Record<string, number> = {};
  Object.keys(scores).forEach(k => {
    normalized[k] = counts[k] > 0 ? Math.round(((scores[k] - counts[k]) / (counts[k] * 4)) * 100) : 0;
  });

  // Find dominant coping pattern
  const copingPatterns = [
    { key: 'withdraw', label: 'Withdrawal' },
    { key: 'pursue', label: 'Pursuit' },
    { key: 'humor', label: 'Humor/Deflection' },
    { key: 'explain', label: 'Over-Explaining' },
  ];
  const dominantCoping = copingPatterns.sort((a, b) => normalized[b.key] - normalized[a.key])[0];

  // Check challenge areas
  const challenges: string[] = [];
  if (normalized.proof_of_love > 50) challenges.push('proof-of-love fallacy');
  if (normalized.vulnerability > 50) challenges.push('vulnerability difficulty');
  if (normalized.hypervigilance > 50) challenges.push('hypervigilance');

  // Check strengths
  const strengths: string[] = [];
  if (normalized.self_soothing > 50) strengths.push('self-soothing');
  if (normalized.signal_return > 50) strengths.push('signaling return');

  let summary: string;
  let primaryResult: string;

  primaryResult = dominantCoping.label;

  if (challenges.length > 0) {
    const challengeText = challenges.length === 1 ? challenges[0] : `${challenges.slice(0, -1).join(', ')} and ${challenges[challenges.length - 1]}`;
    summary = `Your dominant coping pattern is ${dominantCoping.label.toLowerCase()}  -  when distressed, this is your nervous system's go-to self-protection strategy. ${
      dominantCoping.key === 'withdraw'
        ? 'You create distance to regulate. From the inside, this feels like self-preservation. From the outside, it can look like indifference or abandonment.'
        : dominantCoping.key === 'pursue'
        ? 'You push for connection and resolution. From the inside, this feels like seeking safety. From the outside, it can feel like pressure or suffocation.'
        : dominantCoping.key === 'humor'
        ? 'You deflect with humor and lightness. From the inside, this feels like managing overwhelming emotions. From the outside, it can feel like avoidance or not taking things seriously.'
        : 'You explain extensively, seeking to be understood through detail. From the inside, this feels like thoroughness. From the outside, it can feel like lecturing or deflection.'
    } You're also working with ${challengeText}  -  these patterns broadcast signals to your partner's nervous system that may be received as threat, even though they started as self-protection.`;
  } else {
    summary = `Your dominant coping pattern is ${dominantCoping.label.toLowerCase()}. Your communication profile shows fewer major challenge areas, which suggests either a secure baseline or effective self-awareness. Your coping mechanism  -  while protective  -  is your nervous system's way of trying to keep you safe in moments of distress.`;
  }

  const details: Record<string, string> = {
    'Primary Coping': `${dominantCoping.label}  -  This is your nervous system's automatic response to distress. It protects you, but may impact your partner differently.`,
    'Proof-of-Love Fallacy': normalized.proof_of_love > 50
      ? "You expect love to override neurology  -  that a loving partner should 'just know.' But love doesn't override different nervous systems. Clear communication is essential."
      : "You generally accept that love requires communication, not just intuition. This is healthy.",
    'Vulnerability Capacity': normalized.vulnerability > 50
      ? "Expressing softer feelings feels dangerous. Beneath anger is often fear or hurt. Speaking from that softer place is neurologically harder for your partner to dismiss  -  but harder for you to access."
      : "You can access and express vulnerable feelings. This is a significant strength.",
    'Hypervigilance': normalized.hypervigilance > 50
      ? "You're constantly scanning for threat. This isn't being 'too sensitive'  -  it's a nervous system trying to protect you. But it means you may find threats that don't exist."
      : "You don't scan for threats constantly. Your nervous system may feel safer in relationships.",
    'Self-Soothing': normalized.self_soothing > 50
      ? "You can regulate yourself  -  this is huge. When you approach your partner from a grounded place, the conversation becomes possible."
      : "Building self-soothing capacity is likely important work. You may currently rely on external regulation from your partner.",
  };

  return {
    scores: normalized,
    primaryResult,
    summary,
    details,
  };
}

export default function CommunicationPatternsQuiz() {
  const navigate = useNavigate();
  const { saveQuizResult } = useApp();

  const handleComplete = (responses: Record<string, number>) => {
    const results = calculateResults(responses);
    saveQuizResult({
      quizId: 'communication',
      quizName: 'Communication & Coping Patterns',
      completedAt: new Date().toISOString(),
      ...results,
    });
    navigate('/profile-psych');
  };

  return (
    <QuizLayout
      title="Communication & Coping"
      description="How you handle conflict and stress"
      color="#334155"
      icon={<MessagesSquare size={22} />}
      questions={questions}
      categories={categories}
      onComplete={handleComplete}
    />
  );
}

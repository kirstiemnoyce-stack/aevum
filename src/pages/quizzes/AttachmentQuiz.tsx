import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import QuizLayout from './QuizLayout';
import { useApp } from '@/contexts/AppContext';
import type { QuizQuestion } from './QuizLayout';

const questions: QuizQuestion[] = [
  // Secure markers (high = secure)
  { id: 's1', text: "I can ask my partner for what I need without fearing rejection.", category: 'secure' },
  { id: 's2', text: "When my partner and I disagree, I trust we can work through it.", category: 'secure' },
  { id: 's3', text: "I don't assume the worst when my partner is quiet or distant.", category: 'secure' },
  { id: 's4', text: "I feel comfortable being alone without worrying about my relationship.", category: 'secure' },
  { id: 's5', text: "I can express vulnerability to my partner without extreme fear.", category: 'secure' },
  // Anxious markers (high = anxious)
  { id: 'a1', text: "I worry that my partner doesn't love me as much as I love them.", category: 'anxious' },
  { id: 'a2', text: "When my partner is distant, I feel a sense of panic or urgency.", category: 'anxious' },
  { id: 'a3', text: "I frequently check my phone hoping to hear from my partner.", category: 'anxious' },
  { id: 'a4', text: "I need a lot of reassurance that my partner still cares about me.", category: 'anxious' },
  { id: 'a5', text: "I fear being abandoned or left alone.", category: 'anxious' },
  { id: 'a6', text: "When my partner takes space, I feel like the relationship is in danger.", category: 'anxious' },
  // Avoidant markers (high = avoidant)
  { id: 'v1', text: "I prefer to handle my emotions on my own rather than sharing them.", category: 'avoidant' },
  { id: 'v2', text: "When conflicts get intense, I feel an urge to withdraw or leave.", category: 'avoidant' },
  { id: 'v3', text: "I value my independence and sometimes feel suffocated in close relationships.", category: 'avoidant' },
  { id: 'v4', text: "I find it hard to fully trust others with my vulnerabilities.", category: 'avoidant' },
  { id: 'v5', text: "I tend to minimize my needs so I don't appear dependent.", category: 'avoidant' },
  { id: 'v6', text: "When someone gets too emotionally close, I feel the need to create distance.", category: 'avoidant' },
  // Disorganized markers (high = disorganized)
  { id: 'd1', text: "I desperately want closeness but also feel terrified when I get it.", category: 'disorganized' },
  { id: 'd2', text: "I push people away and then panic when they actually leave.", category: 'disorganized' },
  { id: 'd3', text: "I feel conflicting impulses: reach out and shut down at the same time.", category: 'disorganized' },
  { id: 'd4', text: "People I love have also been people who hurt me.", category: 'disorganized' },
  { id: 'd5', text: "I don't trust my own feelings or reactions in relationships.", category: 'disorganized' },
];

const categories: Record<string, { label: string; description: string }> = {
  secure: { label: 'Secure', description: 'Comfortable with intimacy and independence' },
  anxious: { label: 'Anxious', description: 'Seeks reassurance, fears abandonment' },
  avoidant: { label: 'Avoidant', description: 'Values independence, withdraws when close' },
  disorganized: { label: 'Disorganized', description: 'Wants closeness but fears it' },
};

const resultDescriptions: Record<string, { label: string; summary: string; details: Record<string, string> }> = {
  secure: {
    label: 'Secure Attachment',
    summary: "Your nervous system learned that connection is reliable. You can ask for needs to be met, handle conflict without catastrophe, and maintain trust even during distance. This doesn't mean you never struggle  -  it means your internal baseline assumes repair is possible.",
    details: {
      'Core Strength': 'You trust that relationships can survive rupture.',
      'In Conflict': 'You stay engaged without feeling existentially threatened.',
      'Growth Edge': 'You may still benefit from understanding partners who lack your baseline security.',
    },
  },
  anxious: {
    label: 'Anxious (Preoccupied)',
    summary: "Your nervous system learned that love requires vigilance. You likely experienced inconsistent caregiving  -  sometimes warm, sometimes unavailable. Your attachment system hyperactivates when you sense distance. This isn't neediness; it's a protective pattern that once helped you survive emotional unpredictability.",
    details: {
      'Core Pattern': 'Hypervigilance toward signs of rejection or abandonment.',
      'In Conflict': 'You may pursue reassurance intensely, which can activate avoidant withdrawal.',
      'Healing Path': 'Consistent, reliable presence from your partner ("earned security") can rewire your predictions over time.',
    },
  },
  avoidant: {
    label: 'Avoidant (Dismissing)',
    summary: "Your nervous system learned that needing things causes disconnection. You likely had caregivers who were emotionally unreachable. You became self-reliant not because you're strong, but because relying on others proved unsafe. Withdrawal isn't indifference  -  it's safety-seeking.",
    details: {
      'Core Pattern': 'You create distance when intimacy feels threatening.',
      'In Conflict': 'Your withdrawal activates abandonment fear in anxious partners.',
      'Healing Path': "Learning that intimacy won't consume your sense of self  -  through repeated, bounded experiences of closeness.",
    },
  },
  disorganized: {
    label: 'Disorganized (Fearful-Avoidant)',
    summary: "Your nervous system faces an impossible conflict: the person you need to run to is the person you need to run from. You likely had caregivers who were simultaneously a source of comfort and fear. You crave closeness desperately while being terrified of it. This creates intense internal contradiction.",
    details: {
      'Core Pattern': 'Conflicting impulses: push away and pull closer simultaneously.',
      'In Conflict': 'You may swing between pursuit and shutdown unpredictably.',
      'Healing Path': 'Therapy (EMDR, somatic, IFS) and a partner who understands the contradiction without taking it personally.',
    },
  },
};

function calculateResults(responses: Record<string, number>) {
  const scores: Record<string, number> = { secure: 0, anxious: 0, avoidant: 0, disorganized: 0 };
  const counts: Record<string, number> = { secure: 0, anxious: 0, avoidant: 0, disorganized: 0 };

  questions.forEach(q => {
    const val = responses[q.id] || 3;
    scores[q.category] += val;
    counts[q.category]++;
  });

  // Normalize to 0-100
  const normalized: Record<string, number> = {};
  Object.keys(scores).forEach(k => {
    normalized[k] = Math.round(((scores[k] - counts[k]) / (counts[k] * 4)) * 100);
  });

  // Find primary (highest non-secure, or secure if clearly dominant)
  let primary = 'secure';
  let maxScore = -1;
  ['anxious', 'avoidant', 'disorganized', 'secure'].forEach(style => {
    if (normalized[style] > maxScore) {
      maxScore = normalized[style];
      primary = style;
    }
  });

  // If secure is highest but not dominant, the secondary insecure style matters
  let secondary: string | undefined;
  if (primary === 'secure') {
    let secMax = -1;
    ['anxious', 'avoidant', 'disorganized'].forEach(s => {
      if (normalized[s] > secMax) { secMax = normalized[s]; secondary = s; }
    });
  }

  const result = resultDescriptions[primary];
  return {
    scores: normalized,
    primaryResult: result.label,
    secondaryResult: secondary ? resultDescriptions[secondary].label : undefined,
    summary: result.summary,
    details: result.details,
  };
}

export default function AttachmentQuiz() {
  const navigate = useNavigate();
  const { saveQuizResult } = useApp();

  const handleComplete = (responses: Record<string, number>) => {
    const results = calculateResults(responses);
    saveQuizResult({
      quizId: 'attachment',
      quizName: 'Attachment Style',
      completedAt: new Date().toISOString(),
      ...results,
    });
    navigate('/profile-psych');
  };

  return (
    <QuizLayout
      title="Attachment Style"
      description="How your nervous system bonds"
      color="var(--app-primary, #6366F1)"
      icon={<HeartPulse size={22} />}
      questions={questions}
      categories={categories}
      onComplete={handleComplete}
    />
  );
}

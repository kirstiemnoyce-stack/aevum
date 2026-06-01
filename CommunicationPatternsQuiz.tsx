import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import QuizLayout from './QuizLayout';
import { useApp } from '@/contexts/AppContext';
import type { QuizQuestion } from './QuizLayout';

const questions: QuizQuestion[] = [
  // Childhood emotional invalidation
  { id: 'ce1', text: "When I was upset as a child, my caregivers often dismissed or minimized my feelings.", category: 'invalidation' },
  { id: 'ce2', text: "I learned early that expressing emotional needs led to rejection or punishment.", category: 'invalidation' },
  { id: 'ce3', text: "My childhood caregivers were emotionally unpredictable  -  warm one moment, distant the next.", category: 'invalidation' },
  { id: 'ce4', text: "I was made to feel that my emotions were 'too much' or a burden.", category: 'invalidation' },
  { id: 'ce5', text: "My emotional needs were treated as inconvenient rather than valid.", category: 'invalidation' },
  // Past relationship trauma
  { id: 'pt1', text: "I've been in a relationship where I felt controlled, belittled, or unsafe.", category: 'relationship_trauma' },
  { id: 'pt2', text: "A past partner punished me emotionally or physically for expressing distress.", category: 'relationship_trauma' },
  { id: 'pt3', text: "I've experienced betrayal or infidelity that shattered my trust.", category: 'relationship_trauma' },
  { id: 'pt4', text: "A past relationship left me feeling like I was walking on eggshells.", category: 'relationship_trauma' },
  // ADHD / neurodivergence indicators
  { id: 'ad1', text: "I frequently struggle to focus or find myself jumping between tasks.", category: 'adhd' },
  { id: 'ad2', text: "I experience intense emotional reactions that feel bigger than the situation warrants.", category: 'adhd' },
  { id: 'ad3', text: "I often lose track of time or miss deadlines despite good intentions.", category: 'adhd' },
  { id: 'ad4', text: "My mind jumps rapidly from thought to thought, especially when stressed.", category: 'adhd' },
  // Anxiety patterns
  { id: 'an1', text: "I frequently feel a sense of dread or worry even when things seem fine.", category: 'anxiety' },
  { id: 'an2', text: "My body often feels tense  -  tight shoulders, clenched jaw, shallow breathing.", category: 'anxiety' },
  { id: 'an3', text: "I have trouble sleeping because my mind won't quiet down.", category: 'anxiety' },
  { id: 'an4', text: "I avoid certain situations because they trigger overwhelming anxiety.", category: 'anxiety' },
  // Complex trauma patterns
  { id: 'ct1', text: "My reactions to situations often feel 'bigger than the situation'  -  like old pain is bleeding through.", category: 'complex_trauma' },
  { id: 'ct2', text: "I pattern-match current safety to past danger  -  my body responds to the past, not just the present.", category: 'complex_trauma' },
  { id: 'ct3', text: "I feel like I had to grow up too fast or take care of others emotionally as a child.", category: 'complex_trauma' },
  { id: 'ct4', text: "I find it hard to trust that good things will last  -  I'm always waiting for the other shoe to drop.", category: 'complex_trauma' },
];

const categories: Record<string, { label: string; description: string }> = {
  invalidation: { label: 'Childhood Invalidation', description: 'Early emotional neglect' },
  relationship_trauma: { label: 'Relationship Trauma', description: 'Past abusive dynamics' },
  adhd: { label: 'Neurodivergence', description: 'ADHD-like patterns' },
  anxiety: { label: 'Anxiety Patterns', description: 'Chronic worry & tension' },
  complex_trauma: { label: 'Complex Trauma', description: 'Layered survival patterns' },
};

function calculateResults(responses: Record<string, number>) {
  const scores: Record<string, number> = { invalidation: 0, relationship_trauma: 0, adhd: 0, anxiety: 0, complex_trauma: 0 };
  const counts: Record<string, number> = { invalidation: 0, relationship_trauma: 0, adhd: 0, anxiety: 0, complex_trauma: 0 };

  questions.forEach(q => {
    const val = responses[q.id] || 3;
    scores[q.category] += val;
    counts[q.category]++;
  });

  const normalized: Record<string, number> = {};
  Object.keys(scores).forEach(k => {
    normalized[k] = Math.round(((scores[k] - counts[k]) / (counts[k] * 4)) * 100);
  });

  // Build awareness summary
  const elevated: string[] = [];
  Object.entries(normalized).forEach(([k, v]) => {
    if (v > 50) elevated.push(k);
  });

  let summary: string;
  let primaryResult: string;

  if (elevated.length === 0) {
    primaryResult = 'Low Trauma Indicators';
    summary = "Your responses suggest fewer trauma-related patterns. This doesn't mean you've had no difficulties  -  it means your nervous system may have had enough support to process challenges without developing persistent survival patterns. Your window of tolerance may be naturally wider, and your threat-detection system may not be as easily triggered.";
  } else if (elevated.length === 1) {
    const area = categories[elevated[0]].label;
    primaryResult = `${area} Present`;
    summary = `Your responses show a pattern related to ${area.toLowerCase()}. This isn't a diagnosis  -  it's an awareness that this area has shaped your nervous system's responses. The behaviors that feel most challenging in relationships are often someone's earliest attempts to secure love, replaying in a context that feels similar enough to trigger the same response.`;
  } else {
    primaryResult = 'Multiple Patterns Present';
    const areaNames = elevated.map(k => categories[k].label).join(', ');
    summary = `Your responses reveal patterns across multiple areas: ${areaNames.toLowerCase()}. These often layer together and reinforce each other. Complex trauma isn't about one bad thing happening  -  it's about survival patterns being installed so early and so deeply that they run automatically. Understanding the origin changes everything: from 'why are you doing this to me' to 'what is this person carrying, and what would help them feel safe enough to set it down?'`;
  }

  const details: Record<string, string> = {};
  Object.entries(normalized).forEach(([k, v]) => {
    const label = categories[k].label;
    if (v > 60) {
      details[`${label}  -  Elevated`] = 'This pattern significantly shapes your nervous system. Consider therapeutic support (EMDR, somatic therapy, IFS). Insight alone rarely changes these patterns  -  your body needs new experiences, not just new ideas.';
    } else if (v > 40) {
      details[`${label}  -  Moderate`] = 'This pattern has some influence. Awareness and intentional practice can make a meaningful difference here.';
    } else {
      details[`${label}  -  Low`] = 'This area has less influence on your current patterns. Your nervous system may have processed or avoided these particular challenges.';
    }
  });

  return {
    scores: normalized,
    primaryResult,
    summary,
    details,
  };
}

export default function TraumaProgrammingQuiz() {
  const navigate = useNavigate();
  const { saveQuizResult } = useApp();

  const handleComplete = (responses: Record<string, number>) => {
    const results = calculateResults(responses);
    saveQuizResult({
      quizId: 'trauma',
      quizName: 'Trauma & Childhood Programming',
      completedAt: new Date().toISOString(),
      ...results,
    });
    navigate('/profile-psych');
  };

  return (
    <QuizLayout
      title="Trauma & Childhood Programming"
      description="Understanding what shaped you"
      color="#64748B"
      icon={<ShieldAlert size={22} />}
      questions={questions}
      categories={categories}
      onComplete={handleComplete}
    />
  );
}

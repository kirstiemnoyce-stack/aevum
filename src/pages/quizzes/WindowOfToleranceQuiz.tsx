import { useNavigate } from 'react-router-dom';
import { Thermometer } from 'lucide-react';
import QuizLayout from './QuizLayout';
import { useApp } from '@/contexts/AppContext';
import type { QuizQuestion } from './QuizLayout';

const questions: QuizQuestion[] = [
  // Hyperarousal markers (high = frequently hyperaroused)
  { id: 'h1', text: "During disagreements, my heart races and I feel physically activated.", category: 'hyperarousal' },
  { id: 'h2', text: "I often feel a sense of urgency to resolve conflicts immediately.", category: 'hyperarousal' },
  { id: 'h3', text: "Small frustrations can quickly escalate into big emotional reactions for me.", category: 'hyperarousal' },
  { id: 'h4', text: "I feel flooded  -  like my brain can't process what my partner is saying.", category: 'hyperarousal' },
  { id: 'h5', text: "I notice my body tenses up and I have trouble breathing calmly during tension.", category: 'hyperarousal' },
  { id: 'h6', text: "When activated, I say things I regret because my emotions feel bigger than my control.", category: 'hyperarousal' },
  // Hypoarousal markers (high = frequently hypoaroused)
  { id: 'l1', text: "When overwhelmed, I shut down and go numb emotionally.", category: 'hypoarousal' },
  { id: 'l2', text: "I sometimes dissociate or 'check out' during intense conversations.", category: 'hypoarousal' },
  { id: 'l3', text: "I need extended time away to recover after arguments.", category: 'hypoarousal' },
  { id: 'l4', text: "When my partner gets emotional, I feel myself withdrawing into silence.", category: 'hypoarousal' },
  { id: 'l5', text: "I often feel unable to identify what I'm feeling in the moment.", category: 'hypoarousal' },
  { id: 'l6', text: "Conflict makes me feel exhausted and I just want to disappear.", category: 'hypoarousal' },
  // Optimal window markers (high = wide window)
  { id: 'o1', text: "I can stay calm and think clearly during disagreements.", category: 'optimal' },
  { id: 'o2', text: "I can notice my emotions without being controlled by them.", category: 'optimal' },
  { id: 'o3', text: "I can take a pause and return to a conversation productively.", category: 'optimal' },
  { id: 'o4', text: "Even when upset, I can still hear my partner's perspective.", category: 'optimal' },
  { id: 'o5', text: "I know when I'm getting overwhelmed and can communicate that.", category: 'optimal' },
  { id: 'o6', text: "I can shift from reactive to curious during conflict.", category: 'optimal' },
];

const categories: Record<string, { label: string; description: string }> = {
  hyperarousal: { label: 'Hyperarousal', description: 'Flooded, activated, urgent' },
  hypoarousal: { label: 'Hypoarousal', description: 'Shutdown, numb, dissociated' },
  optimal: { label: 'Optimal Window', description: 'Calm, present, regulated' },
};

function calculateResults(responses: Record<string, number>) {
  const scores: Record<string, number> = { hyperarousal: 0, hypoarousal: 0, optimal: 0 };
  const counts: Record<string, number> = { hyperarousal: 0, hypoarousal: 0, optimal: 0 };

  questions.forEach(q => {
    const val = responses[q.id] || 3;
    scores[q.category] += val;
    counts[q.category]++;
  });

  const normalized: Record<string, number> = {};
  Object.keys(scores).forEach(k => {
    normalized[k] = Math.round(((scores[k] - counts[k]) / (counts[k] * 4)) * 100);
  });

  // Determine state tendency
  let primary: string;
  let summary: string;
  let details: Record<string, string>;

  const hyper = normalized.hyperarousal;
  const hypo = normalized.hypoarousal;
  const opt = normalized.optimal;

  if (opt > 60 && hyper < 40 && hypo < 40) {
    primary = 'wide';
    summary = "Your window of tolerance is wide. You can handle stress, stay present during conflict, and think clearly when emotions run high. This is a significant strength  -  it means your nervous system trusts that most challenges are manageable.";
    details = {
      'What This Means': 'You can stay in difficult conversations without shutting down or blowing up.',
      'Your Strength': 'You can hear your partner even when you disagree.',
      'Growth Edge': 'Help your partner understand their own window  -  yours may be wider than theirs.',
    };
  } else if (hyper > hypo && hyper > opt) {
    primary = 'hyperaroused';
    summary = "Your nervous system tends toward hyperarousal  -  you get flooded, activated, and urgent. Your heart races, your thoughts speed up, and small things feel big. This isn't overreaction; it's a nervous system that learned to stay alert. The anxious partner's window often blows open upward.";
    details = {
      'What This Means': 'Your body interprets conflict as an emergency, even when it is not.',
      'In Relationships': 'You may pursue resolution urgently, which can overwhelm your partner.',
      'Healing Practice': 'Physical movement, writing before speaking, and asking "Is this proportional?" can help.',
    };
  } else if (hypo > hyper && hypo > opt) {
    primary = 'hypoaroused';
    summary = "Your nervous system tends toward hypoarousal  -  you shut down, go numb, or dissociate when overwhelmed. Conflict makes you want to disappear. The avoidant partner's window often collapses inward. This isn't coldness; it's a nervous system protecting itself the only way it knows how.";
    details = {
      'What This Means': 'Your body protects you by withdrawing when things feel too intense.',
      'In Relationships': 'Your silence can feel like rejection to an anxious partner.',
      'Healing Practice': `Learning to name your state ("I'm getting flooded") and taking time-limited breaks.`,
    };
  } else {
    primary = 'mixed';
    summary = "Your nervous system moves between states  -  sometimes activated, sometimes shut down, sometimes present. This is common for people with complex trauma histories or disorganized attachment patterns. The key is learning to recognize which state you're in and communicating it.";
    details = {
      'What This Means': 'Your window narrows unpredictably depending on triggers.',
      'In Relationships': 'Your partner may find it hard to predict your reactions.',
      'Healing Practice': 'Build a shared language for states. "Am I in my window right now?" changes everything.',
    };
  }

  return {
    scores: normalized,
    primaryResult: primary === 'wide' ? 'Wide Window' : primary === 'hyperaroused' ? 'Hyperarousal-Tendency' : primary === 'hypoaroused' ? 'Hypoarousal-Tendency' : 'Mixed/Variable Window',
    summary,
    details,
  };
}

export default function WindowOfToleranceQuiz() {
  const navigate = useNavigate();
  const { saveQuizResult } = useApp();

  const handleComplete = (responses: Record<string, number>) => {
    const results = calculateResults(responses);
    saveQuizResult({
      quizId: 'window',
      quizName: 'Window of Tolerance',
      completedAt: new Date().toISOString(),
      ...results,
    });
    navigate('/profile-psych');
  };

  return (
    <QuizLayout
      title="Window of Tolerance"
      description="Your nervous system's stress zone"
      color="#10B981"
      icon={<Thermometer size={22} />}
      questions={questions}
      categories={categories}
      onComplete={handleComplete}
    />
  );
}

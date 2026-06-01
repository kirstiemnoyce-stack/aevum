import { useNavigate } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import QuizLayout from './QuizLayout';
import { useApp } from '@/contexts/AppContext';
import type { QuizQuestion } from './QuizLayout';

const questions: QuizQuestion[] = [
  // Serotonin baseline
  { id: 'ser1', text: "I often feel like small slights or neutral comments are actually rejection.", category: 'serotonin' },
  { id: 'ser2', text: "Silence from my partner often feels hostile or punishing to me.", category: 'serotonin' },
  { id: 'ser3', text: "My emotional baseline feels low  -  like I'm running a deficit of calm.", category: 'serotonin' },
  { id: 'ser4', text: "I tend to interpret ambiguous situations negatively.", category: 'serotonin' },
  // Dopamine/reward system
  { id: 'dop1', text: "I feel most connected to my partner when things are new or exciting.", category: 'dopamine' },
  { id: 'dop2', text: "Long-term familiarity sometimes feels boring rather than comforting.", category: 'dopamine' },
  { id: 'dop3', text: "I crave novelty and stimulation in my relationship.", category: 'dopamine' },
  { id: 'dop4', text: "I struggle to find reward in routine, everyday moments with my partner.", category: 'dopamine' },
  // Norepinephrine / activation
  { id: 'ne1', text: "My body often feels like it's bracing for something bad to happen.", category: 'norepinephrine' },
  { id: 'ne2', text: "I startle easily and have trouble relaxing even in safe moments.", category: 'norepinephrine' },
  { id: 'ne3', text: "My mind races with worst-case scenarios about my relationship.", category: 'norepinephrine' },
  { id: 'ne4', text: "Even small stressors activate a full-body stress response in me.", category: 'norepinephrine' },
  // GABA / regulation
  { id: 'gaba1', text: "Stillness and calm feel uncomfortable or even threatening to me.", category: 'gaba' },
  { id: 'gaba2', text: "I struggle to feel calm in the presence of uncertainty.", category: 'gaba' },
  { id: 'gaba3', text: "My nervous system has trouble 'turning down the volume' after activation.", category: 'gaba' },
  { id: 'gaba4', text: "I often feel restless and unable to settle.", category: 'gaba' },
  // Oxytocin / bonding
  { id: 'oxy1', text: "Touch and physical closeness significantly calm my nervous system.", category: 'oxytocin' },
  { id: 'oxy2', text: "Eye contact with my partner makes me feel deeply connected.", category: 'oxytocin' },
  { id: 'oxy3', text: "When my partner hurts me, it cuts deeper than anyone else could.", category: 'oxytocin' },
  { id: 'oxy4', text: "I bond deeply to specific people and struggle when that bond is threatened.", category: 'oxytocin' },
  // Cortisol / stress
  { id: 'cor1', text: "During arguments, I lose access to empathy and rational thinking.", category: 'cortisol' },
  { id: 'cor2', text: "My partner says I become a different person when I'm upset.", category: 'cortisol' },
  { id: 'cor3', text: "It takes me a long time to calm down after a conflict.", category: 'cortisol' },
  { id: 'cor4', text: "Stress from work or life spills into how I show up in my relationship.", category: 'cortisol' },
];

const categories: Record<string, { label: string; description: string }> = {
  serotonin: { label: 'Serotonin', description: 'Emotional baseline' },
  dopamine: { label: 'Dopamine', description: 'Reward & novelty' },
  norepinephrine: { label: 'Norepinephrine', description: 'Alert & activation' },
  gaba: { label: 'GABA', description: 'Calm & regulation' },
  oxytocin: { label: 'Oxytocin', description: 'Bonding & trust' },
  cortisol: { label: 'Cortisol', description: 'Stress response' },
};

function calculateResults(responses: Record<string, number>) {
  const scores: Record<string, number> = { serotonin: 0, dopamine: 0, norepinephrine: 0, gaba: 0, oxytocin: 0, cortisol: 0 };
  const counts: Record<string, number> = { serotonin: 0, dopamine: 0, norepinephrine: 0, gaba: 0, oxytocin: 0, cortisol: 0 };

  questions.forEach(q => {
    const val = responses[q.id] || 3;
    scores[q.category] += val;
    counts[q.category]++;
  });

  const normalized: Record<string, number> = {};
  Object.keys(scores).forEach(k => {
    normalized[k] = Math.round(((scores[k] - counts[k]) / (counts[k] * 4)) * 100);
  });

  // Find the two highest systems
  const sorted = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  const systemDescriptions: Record<string, string> = {
    serotonin: "Your serotonin system may run low, meaning your emotional baseline sits closer to threat-detection. Small slights feel catastrophic, silence feels hostile, and you may interpret neutral expressions as rejection. This isn't paranoia  -  it's an oversensitive threat-detection system.",
    dopamine: "Your dopamine system craves novelty and stimulation. Early relationships feel electric, but long-term love can feel harder because familiarity doesn't trigger the same chemical reward. Building a dopamine system that finds reward in familiarity is neurologically harder  -  but possible.",
    norepinephrine: "Your norepinephrine system is chronically elevated  -  your body is perpetually bracing for impact, even in safe moments with safe people. This is common in anxiety and PTSD. Your nervous system learned that vigilance equals survival.",
    gaba: "Your GABA system  -  your brain's volume knob  -  may be underactive. Stillness feels threatening, uncertainty feels unbearable, and your nervous system struggles to dampen excessive activation. Calm itself can feel unsafe.",
    oxytocin: "Your oxytocin system bonds deeply to specific people. Touch, eye contact, and vulnerability are your anchors. But the same chemical that bonds you to someone makes their wounds cut deeper. No one can hurt you quite like the person you love.",
    cortisol: "Your cortisol system floods easily. When stressed, your prefrontal cortex partially goes offline  -  and with it, empathy, nuance, and rational communication. Arguments become survival-oriented. That's not stubbornness  -  it's physiology.",
  };

  const primaryLabel = categories[primary]?.label || primary;
  const secondaryLabel = categories[secondary]?.label || secondary;

  return {
    scores: normalized,
    primaryResult: `${primaryLabel} Dominant`,
    secondaryResult: `${secondaryLabel} Secondary`,
    summary: `Your nervous system is primarily shaped by ${primaryLabel.toLowerCase()} patterns, with ${secondaryLabel.toLowerCase()} as a secondary influence. ${systemDescriptions[primary]}`,
    details: {
      'Primary System': systemDescriptions[primary],
      'Secondary Influence': systemDescriptions[secondary],
      'What This Means': 'Your neurochemistry profile explains why certain triggers hit harder than others. This is biology, not character.',
    },
  };
}

export default function NeurochemistryQuiz() {
  const navigate = useNavigate();
  const { saveQuizResult } = useApp();

  const handleComplete = (responses: Record<string, number>) => {
    const results = calculateResults(responses);
    saveQuizResult({
      quizId: 'neurochemistry',
      quizName: 'Neurochemistry Profile',
      completedAt: new Date().toISOString(),
      ...results,
    });
    navigate('/profile-psych');
  };

  return (
    <QuizLayout
      title="Neurochemistry Profile"
      description="Your brain's relationship chemistry"
      color="#A855F7"
      icon={<FlaskConical size={22} />}
      questions={questions}
      categories={categories}
      onComplete={handleComplete}
    />
  );
}

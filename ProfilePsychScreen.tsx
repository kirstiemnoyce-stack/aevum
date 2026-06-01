import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, HeartPulse, Thermometer, FlaskConical,
  ShieldAlert, MessagesSquare, CheckCircle2, Sparkles,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface QuizCard {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  color: string;
  questionCount: number;
  timeEstimate: string;
}

const quizzes: QuizCard[] = [
  {
    id: 'attachment',
    title: 'Attachment Style',
    description: 'Secure, anxious, avoidant, or disorganized — discover how your earliest bonds shape your adult relationships.',
    route: '/quiz/attachment',
    icon: <HeartPulse size={22} />,
    color: 'var(--app-primary, #6366F1)',
    questionCount: 23,
    timeEstimate: '5 min',
  },
  {
    id: 'window',
    title: 'Window of Tolerance',
    description: 'Understand whether your nervous system floods, shuts down, or stays present under stress.',
    route: '/quiz/window',
    icon: <Thermometer size={22} />,
    color: '#10B981',
    questionCount: 18,
    timeEstimate: '4 min',
  },
  {
    id: 'neurochemistry',
    title: 'Neurochemistry Profile',
    description: 'Map your serotonin, dopamine, cortisol, GABA, oxytocin, and norepinephrine patterns.',
    route: '/quiz/neurochemistry',
    icon: <FlaskConical size={22} />,
    color: '#A855F7',
    questionCount: 24,
    timeEstimate: '6 min',
  },
  {
    id: 'trauma',
    title: 'Trauma & Childhood Programming',
    description: 'Explore how childhood experiences, past relationships, and neurodivergence shape your responses.',
    route: '/quiz/trauma',
    icon: <ShieldAlert size={22} />,
    color: '#64748B',
    questionCount: 21,
    timeEstimate: '5 min',
  },
  {
    id: 'communication',
    title: 'Communication & Coping Patterns',
    description: 'Identify your coping style, vulnerability capacity, and hypervigilance in relationships.',
    route: '/quiz/communication',
    icon: <MessagesSquare size={22} />,
    color: '#334155',
    questionCount: 26,
    timeEstimate: '6 min',
  },
];

export default function QuizHubScreen() {
  const navigate = useNavigate();
  const { hasQuizResult } = useApp();
  const completedCount = quizzes.filter(q => hasQuizResult(q.id)).length;

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-clay/10 transition-colors">
            <ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" />
          </button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Assessments</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 max-w-lg mx-auto">
        {/* Progress overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={20} className="text-primary" />
            <h2 className="text-body-lg font-medium text-white">Your Progress</h2>
          </div>
          <p className="text-body-sm text-white/70 mb-4">
            {completedCount === 0
              ? "Take your first assessment to begin building your psychological profile. Each quiz takes 4-6 minutes."
              : `You've completed ${completedCount} of ${quizzes.length} assessments. Keep going to build a complete picture.`}
          </p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / quizzes.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-caption text-white/40 mt-2 text-right">
            {completedCount}/{quizzes.length} completed
          </p>
        </motion.div>

        {/* Quiz cards */}
        <div className="space-y-4">
          {quizzes.map((quiz, index) => {
            const isCompleted = hasQuizResult(quiz.id);
            return (
              <motion.button
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(quiz.route)}
                className={`w-full text-left rounded-2xl p-5 transition-all ${
                  isCompleted
                    ? 'bg-cream-soft dark:bg-white/5 shadow-card'
                    : 'bg-cream-soft dark:bg-white/5 shadow-card hover:shadow-card-hover'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${quiz.color}15` }}
                  >
                    <span style={{ color: quiz.color }}>{quiz.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body font-medium text-charcoal dark:text-cream-soft">
                        {quiz.title}
                      </h3>
                      {isCompleted && (
                        <CheckCircle2 size={16} className="text-sage flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-caption text-clay mb-2">{quiz.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-caption text-clay/70">
                        {quiz.questionCount} questions
                      </span>
                      <span className="text-clay/30">~</span>
                      <span className="text-caption text-clay/70">
                        {quiz.timeEstimate}
                      </span>
                    </div>
                  </div>
                  <ChevronLeft
                    size={18}
                    className="text-clay/40 mt-1 rotate-180 flex-shrink-0"
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-caption text-clay text-center mt-6 px-4">
          These assessments are based on attachment theory, interpersonal neurobiology, and trauma research. They are not clinical diagnoses.
        </p>
      </div>
    </div>
  );
}

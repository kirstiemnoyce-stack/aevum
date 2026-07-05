import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  text: string;
  category: string;
}

interface QuizLayoutProps {
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  questions: QuizQuestion[];
  categories: Record<string, { label: string; description: string }>;
  onComplete: (responses: Record<string, number>) => void;
  resultRoute?: string;
}

const options = [
  { value: 1, label: 'Strongly Disagree', desc: 'Not true for me at all' },
  { value: 2, label: 'Disagree', desc: 'Rarely true' },
  { value: 3, label: 'Neutral', desc: 'Sometimes true' },
  { value: 4, label: 'Agree', desc: 'Often true' },
  { value: 5, label: 'Strongly Agree', desc: 'Very true for me' },
];

export default function QuizLayout({ title, description, color, icon, questions, onComplete }: QuizLayoutProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isComplete = Object.keys(responses).length === questions.length;

  const handleResponse = useCallback((value: number) => {
    setResponses(prev => ({ ...prev, [currentQ.id]: value }));
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrentIndex(i => i + 1), 300);
    }
  }, [currentIndex, currentQ.id, questions.length]);

  const handleSubmit = () => {
    setCompleted(true);
    setTimeout(() => onComplete(responses), 1500);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(i => i - 1);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-espresso-deep flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: color }}
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-display-md text-charcoal dark:text-cream-soft text-center"
        >
          Assessment Complete
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-body-sm text-clay mt-3 text-center"
        >
          Analyzing your results...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/quizzes')}
            className="p-2 -ml-2 rounded-full hover:bg-clay/10 transition-colors"
          >
            <ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" />
          </button>
          <h1 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">
            {currentIndex + 1} / {questions.length}
          </h1>
          <div className="w-10" />
        </div>
        <div className="w-full h-1 bg-clay/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      <div className="px-6 py-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          <div>
            <p className="text-caption font-medium" style={{ color }}>
              {title}
            </p>
            <p className="text-caption text-clay">{description}</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            className="mb-10"
          >
            <h2 className="text-display-md text-charcoal dark:text-cream-soft leading-snug">
              {currentQ.text}
            </h2>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-3">
          {options.map(option => {
            const isSelected = responses[currentQ.id] === option.value;
            return (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResponse(option.value)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'shadow-card-hover'
                    : 'bg-cream-soft dark:bg-white/5 border-clay/20'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: color, borderColor: color }
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-body-sm font-medium ${
                        isSelected ? 'text-white' : 'text-charcoal dark:text-cream-soft'
                      }`}
                    >
                      {option.label}
                    </p>
                    <p
                      className={`text-caption ${
                        isSelected ? 'text-white/70' : 'text-clay'
                      }`}
                    >
                      {option.desc}
                    </p>
                  </div>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isSelected ? 'bg-white' : 'bg-clay/20 text-clay'
                    }`}
                    style={isSelected ? { color } : undefined}
                  >
                    {option.value}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-body-sm text-clay disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {isComplete ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="px-8 h-[48px] rounded-full text-white font-medium text-body-sm"
              style={{ backgroundColor: color }}
            >
              See Results
            </motion.button>
          ) : (
            <button
              onClick={() => {
                if (currentIndex < questions.length - 1) {
                  setDirection(1);
                  setCurrentIndex(i => i + 1);
                }
              }}
              className="flex items-center gap-1 text-body-sm text-clay"
            >
              Skip <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

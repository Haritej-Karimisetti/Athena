
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, User, Sparkles, BookOpen, CheckCircle, Lock, Trophy, X, ChevronRight } from 'lucide-react';
import { MY_MODULES, ROADMAP_DATA, RoadmapStep, ModuleDetails } from '../constants';

interface AthenaAIViewProps { 
  onBack: () => void; 
  onQuizComplete: (taskId: string, score: number, xpGained: number) => void;
}

export const AthenaAIView: React.FC<AthenaAIViewProps> = ({ onBack, onQuizComplete }) => {
  const [selectedModule, setSelectedModule] = useState<ModuleDetails | null>(null);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [activeQuiz, setActiveQuiz] = useState<RoadmapStep | null>(null);

  const roadmap = selectedModule ? ROADMAP_DATA[selectedModule.id] || [] : [];
  
  const highestCompletedStepIndex = useMemo(() => {
    if (!selectedModule) return -1;
    const moduleScores = scores[selectedModule.id] || {};
    let lastCompleted = -1;
    for (let i = 0; i < roadmap.length; i++) {
        if ((moduleScores[roadmap[i].id] || 0) >= 50) {
            lastCompleted = i;
        } else {
            break;
        }
    }
    return lastCompleted;
  }, [selectedModule, scores, roadmap]);

  const handleQuizSubmit = (stepId: string, score: number) => {
    if(selectedModule) {
        setScores(prev => ({
            ...prev,
            [selectedModule.id]: {
                ...prev[selectedModule.id],
                [stepId]: score
            }
        }));
        
        const xpGained = score >= 50 ? 25 : 0;
        onQuizComplete(stepId, score, xpGained);
    }
    setActiveQuiz(null);
  };

  if (activeQuiz && selectedModule) {
      return <QuizView step={activeQuiz} onComplete={(score) => handleQuizSubmit(activeQuiz.id, score)} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 shadow-sm z-20 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
        <button onClick={selectedModule ? () => setSelectedModule(null) : onBack} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Athena AI</h2>
            <p className="text-xs font-bold text-gray-400">{selectedModule ? selectedModule.code : 'Learning Roadmap'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedModule ? (
          <>
            <h3 className="text-sm font-bold text-gray-500 px-1">Select a module to begin:</h3>
            {MY_MODULES.map(module => (
              <button key={module.id} onClick={() => setSelectedModule(module)} className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold">{module.title}</p>
                  <p className="text-xs text-gray-400">{module.code}</p>
                </div>
                <ChevronRight />
              </button>
            ))}
          </>
        ) : (
          roadmap.map((step, index) => {
            const isCompleted = (scores[selectedModule.id]?.[step.id] || 0) >= 50;
            const isUnlocked = index <= highestCompletedStepIndex + 1;
            return (
              <div key={step.id} className={`p-4 rounded-xl border-2 ${isUnlocked ? 'bg-white dark:bg-gray-800 border-transparent shadow-sm' : 'bg-gray-100 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-700'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-500 text-white' : isUnlocked ? 'bg-leeds-blue text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500'}`}>
                    {isCompleted ? <CheckCircle size={18} /> : isUnlocked ? <BookOpen size={18} /> : <Lock size={18} />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{step.title}</h4>
                    <p className={`text-xs ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>{step.description}</p>
                  </div>
                </div>
                {isUnlocked && !isCompleted && (
                  <button onClick={() => setActiveQuiz(step)} className="w-full mt-4 py-2 bg-leeds-blue text-white text-xs font-bold rounded-lg">
                    Take Quiz
                  </button>
                )}
                 {isCompleted && (
                    <div className="text-xs font-bold text-green-600 mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">Score: {scores[selectedModule.id][step.id]}%</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const QuizView = ({ step, onComplete }: { step: RoadmapStep; onComplete: (score: number) => void; }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const question = step.quiz[currentQ];

    const handleAnswer = (answer: string) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);
        if (currentQ < step.quiz.length - 1) {
            setCurrentQ(q => q + 1);
        } else {
            setShowResult(true);
        }
    };

    const score = useMemo(() => {
        if (!showResult) return 0;
        const correct = answers.reduce((sum, ans, i) => sum + (ans === step.quiz[i].correctAnswer ? 1 : 0), 0);
        return Math.round((correct / step.quiz.length) * 100);
    }, [showResult, answers, step.quiz]);

    if (showResult) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 text-center">
                <Trophy size={48} className={score >= 50 ? 'text-yellow-500' : 'text-gray-400'} />
                <h3 className="text-2xl font-bold mt-4">Quiz Complete!</h3>
                <p className="text-4xl font-black my-2">{score}%</p>
                <p className={`font-bold ${score >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                    {score >= 50 ? "Passed! You've unlocked the next topic." : "Try again to unlock the next topic."}
                </p>
                <button onClick={() => onComplete(score)} className="mt-8 w-full py-3 bg-leeds-blue text-white font-bold rounded-xl">Continue</button>
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col h-full bg-white dark:bg-gray-900">
            <p className="text-sm font-bold text-gray-400">Question {currentQ + 1} of {step.quiz.length}</p>
            <h3 className="text-xl font-bold my-4">{question.question}</h3>
            <div className="space-y-3 flex-1">
                {question.options.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-leeds-blue">
                        {opt}
                    </button>
                ))}
            </div>
            <button onClick={() => onComplete(0)} className="text-xs text-gray-400 p-2">Exit Quiz</button>
        </div>
    );
};

import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import type { QuizQuestion } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../LanguageContext';

interface QuizProps {
  addPn: (amount: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ addPn }) => {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await generateQuizQuestions(language);
      if (fetchedQuestions.length === 0) {
          setError(t('quiz_error_loading'));
      } else {
        setQuestions(fetchedQuestions);
      }
    } catch (err) {
      setError(t('quiz_error_fetching'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      addPn(10); // Award 10 Nature Points for a correct answer
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-amazon-medium/50 rounded-lg shadow-2xl backdrop-blur-sm min-h-[400px]">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-amazon-accent">{t('quiz_generating')}</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center p-8 bg-red-900/50 rounded-lg">
            <p className="text-xl text-white">{error}</p>
            <button onClick={restartQuiz} className="mt-4 px-6 py-2 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors">
                {t('quiz_try_again')}
            </button>
        </div>
    );
  }

  if (questions.length === 0) return null;

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="text-center p-8 bg-amazon-medium/50 rounded-lg shadow-2xl backdrop-blur-sm animate-fade-in">
        <h2 className="text-3xl font-bold mb-4 text-amazon-accent">{t('quiz_finished_title')}</h2>
        <p className="text-xl mb-6">{t('quiz_final_score', score, questions.length)}</p>
        <p className="text-lg mb-6">{t('quiz_points_earned', score * 10)}</p>
        <button onClick={restartQuiz} className="px-8 py-3 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors text-lg">
          {t('quiz_play_again')}
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 md:p-8 bg-amazon-medium/50 rounded-lg shadow-2xl backdrop-blur-sm max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sm text-amazon-light">{t('quiz_question_counter', currentQuestionIndex + 1, questions.length)}</p>
        <h2 className="text-xl md:text-2xl font-semibold mt-1">{currentQuestion.question}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = option === currentQuestion.correctAnswer;
          const isSelected = option === selectedAnswer;
          let buttonClass = 'bg-amazon-dark/50 hover:bg-amazon-light/50';
          if (isAnswered) {
            if (isCorrect) {
              buttonClass = 'bg-green-500 text-white';
            } else if (isSelected) {
              buttonClass = 'bg-red-500 text-white';
            } else {
              buttonClass = 'bg-amazon-dark/30 opacity-60';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              className={`p-4 rounded-lg text-left transition-all duration-300 w-full ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div className="mt-6 p-4 bg-amazon-dark/50 rounded-lg animate-fade-in">
          <p className="font-bold text-lg mb-2">{selectedAnswer === currentQuestion.correctAnswer ? t('quiz_correct_answer') : t('quiz_incorrect_answer')}</p>
          <p className="text-amazon-text/90">{currentQuestion.explanation}</p>
          <button onClick={handleNextQuestion} className="mt-4 px-6 py-2 bg-amazon-accent text-amazon-dark font-bold rounded-lg hover:bg-white transition-colors w-full md:w-auto">
            {t('quiz_next_question')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;

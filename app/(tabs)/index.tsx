import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import QuizOption, { QuizOptionProps } from '@/components/QuizOption';
import { questions } from '@/data/questions';
import { Question } from '@/types/Question';

export default function HomeScreen() {
  const totalQuestions = questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

  const isLocked = selectedOption !== null;
  const isOptionRevealMode = selectedOption !== null;


  const question: Question = useMemo(() => {
    return questions[currentQuestionIndex];
  }, [currentQuestionIndex]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const proceedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    setTimeLeft(30);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex >= totalQuestions - 1) {
      setIsExamFinished(true);
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const finalizeAnswer = (optionIndex: number) => {
    if (isLocked) return;

    setSelectedOption(optionIndex);

    if (optionIndex === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (proceedTimeoutRef.current) {
      clearTimeout(proceedTimeoutRef.current);
      proceedTimeoutRef.current = null;
    }
  };

  const revealWhenTimeRunsOut = () => {
    if (isLocked) return;

    setSelectedOption(question.correctAnswer);

    if (proceedTimeoutRef.current) {
      clearTimeout(proceedTimeoutRef.current);
    }

    proceedTimeoutRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 650);
  };

  useEffect(() => {
    if (isExamFinished) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestionIndex, isExamFinished, selectedOption]);

  useEffect(() => {
    if (isExamFinished) return;
    if (selectedOption !== null) return;
    if (timeLeft !== 0) return;

    revealWhenTimeRunsOut();
  }, [timeLeft, isExamFinished, selectedOption]);

  useEffect(() => {
    if (isExamFinished) return;
    setSelectedOption(null);
    resetTimer();
  }, [currentQuestionIndex]);


  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (proceedTimeoutRef.current) {
        clearTimeout(proceedTimeoutRef.current);
      }
    };
  }, []);

  const restart = () => {
    setIsExamFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTimeLeft(30);
  };

  const percent = Math.round((score / totalQuestions) * 100);
  const scoreMessage =
    percent >= 80
      ? 'Excellent work!'
      : percent >= 50
        ? 'Good job, keep going!'
        : 'Needs improvement, try again!';

  if (isExamFinished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.card, styles.cardCenter, styles.resultsCenter, { width: '100%', paddingTop: 200 }]}>

              <Text style={styles.resultsEmoji}>🎓</Text>
              <Text style={styles.resultsTitle}>Exam Results</Text>
              <Text style={styles.resultsScore}>
                Score {score} / {totalQuestions} Correct
              </Text>

              <Text style={styles.resultsPercent}>{percent}%</Text>
              <Text style={styles.resultsMessage}>{scoreMessage}</Text>

              <TouchableOpacity
                style={styles.restartButton}
                onPress={restart}
                activeOpacity={0.9}
              >
                <Text style={styles.restartButtonText}>🔄 Restart Laboratory Exam</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.fixedTop}>
            <View style={styles.headerRow}>
              <View style={styles.headerTopRow}>
                <Text style={styles.timerPill}>⏱️ {timeLeft}s</Text>
              </View>
            </View>

            <View style={styles.progressOuter}>
              <View
                style={[
                  styles.progressInner,
                  {
                    width: `${((currentQuestionIndex + (isOptionRevealMode ? 1 : 0)) / totalQuestions) * 100}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.category}>{question.category}</Text>

            <Text style={styles.questionText}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Text>

            <Text style={styles.questionPrompt}>{question.question}</Text>
          </View>

          <View style={styles.optionsWrap}>
            {question.options.map((opt, idx) => {
              const props: QuizOptionProps = {
                option: opt,
                index: idx,
                selectedOption,
                correctAnswer: question.correctAnswer,
                disabled: isLocked,
                onPress: () => finalizeAnswer(idx),
              };
              return <QuizOption key={opt} {...props} />;
            })}
          </View>

          {selectedOption !== null ? (
            <View style={styles.explanationWrap}>
              <Text style={styles.explanationTitle}>Explanation</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.proceedButton,
              selectedOption === null ? styles.proceedButtonDisabled : null,
            ]}
            onPress={() => {
              if (selectedOption === null) return;

              if (proceedTimeoutRef.current) {
                clearTimeout(proceedTimeoutRef.current);
                proceedTimeoutRef.current = null;
              }

              setSelectedOption(null);
              goToNextQuestion();
            }}
            disabled={selectedOption === null}
          >
            <Text style={styles.proceedButtonText}>Proceed to Next Question</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16, gap: 14 },

  fixedTop: {
    // keeps header/progress aligned while scrolling
    paddingBottom: 6,
  },



  headerRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 10,
    marginBottom: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  timerPill: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    color: '#0F172A',
    fontWeight: '800',
  },

  progressOuter: {
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
  },
  progressInner: {
    backgroundColor: '#3B82F6',
    height: 10,
    borderRadius: 999,
  },


  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 0,
    borderWidth: 0,
    padding: 0,
  },

  cardCenter: { alignItems: 'center' },

  resultsCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  resultsEmoji: {
    fontSize: 64,
    marginBottom: 6,
  },


  category: {
    color: '#3B82F6',
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 8,
    fontSize: 12,
  },

  questionText: { color: '#0F172A', fontSize: 16, fontWeight: '900', lineHeight: 22 },
  questionPrompt: { color: '#0F172A', fontSize: 22, fontWeight: '900', lineHeight: 26, marginBottom: 8 },


  optionsWrap: { marginTop: 14 },

  explanationWrap: { marginTop: 10 },
  explanationTitle: { color: '#334155', fontWeight: '800', marginBottom: 6 },
  explanationText: { color: '#64748B', fontWeight: '600', lineHeight: 20 },

  restartButton: {
    marginTop: 18,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignSelf: 'stretch',
  },
  restartButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '900', textAlign: 'center' },

  proceedButton: {
    marginTop: 14,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: 'stretch',
  },
  proceedButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  proceedButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '900', textAlign: 'center' },

  resultsTitle: { fontSize: 30, fontWeight: '900', color: '#0F172A', marginBottom: 10 },

  resultsScore: { fontSize: 15, fontWeight: '900', color: 'gray', marginBottom: 6 },
  resultsPercent: { fontSize: 70, fontWeight: '800', color: '#3B82F6', marginBottom: 8 },
  resultsMessage: { color: 'gray', fontWeight: '700', textAlign: 'center', marginBottom: 6 },
});


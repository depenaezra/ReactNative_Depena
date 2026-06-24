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
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

  const isLocked = selectedOption !== null;

  const question: Question = useMemo(() => {
    return questions[currentQuestionIndex];
  }, [currentQuestionIndex]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const proceedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    setTimeLeft(20);
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
    }

    proceedTimeoutRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 450);
  };

  const revealWhenTimeRunsOut = () => {
    if (isLocked) return;

    // reveal by setting selectedOption to the correct index
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, isExamFinished, selectedOption]);

  useEffect(() => {
    if (isExamFinished) return;
    if (selectedOption !== null) return;
    if (timeLeft !== 0) return;

    revealWhenTimeRunsOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isExamFinished, selectedOption]);

  useEffect(() => {
    // reset state when question index changes
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
    setTimeLeft(20);
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
            <View style={[styles.card, styles.cardCenter]}>
              <Text style={styles.resultsTitle}>🎓 Quiz Finished</Text>
              <Text style={styles.resultsScore}>
                {score} / {totalQuestions}
              </Text>
              <Text style={styles.resultsPercent}>{percent}%</Text>
              <Text style={styles.resultsMessage}>{scoreMessage}</Text>

              <TouchableOpacity
                style={styles.restartButton}
                onPress={restart}
                activeOpacity={0.9}
              >
                <Text style={styles.restartButtonText}>🔄 Restart</Text>
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
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </Text>
            <Text style={styles.timerPill}>⏱️ {timeLeft}s</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.category}>{question.category}</Text>
            <Text style={styles.questionText}>{question.question}</Text>

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
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16, gap: 14 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 2,
  },
  headerText: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
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

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  cardCenter: { alignItems: 'center' },

  category: { color: '#334155', fontWeight: '700', marginBottom: 10, fontSize: 14 },
  questionText: { color: '#0F172A', fontSize: 18, fontWeight: '800', lineHeight: 24 },

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

  resultsTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 10 },
  resultsScore: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  resultsPercent: { fontSize: 18, fontWeight: '800', color: '#3B82F6', marginBottom: 8 },
  resultsMessage: { color: '#334155', fontWeight: '700', textAlign: 'center', marginBottom: 6 },
});


import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface QuizOptionProps {
  option: string;
  index: number;
  selectedOption: number | null;
  correctAnswer: number;
  onPress: () => void;
  disabled: boolean;
}

export default function QuizOption({
  option,
  index,
  selectedOption,
  correctAnswer,
  onPress,
  disabled,
}: QuizOptionProps) {
  const isSelected = selectedOption === index;
  const isCorrect = index === correctAnswer;
  const shouldReveal = selectedOption !== null;

  let borderColor = '#E2E8F0';
  let backgroundColor = '#ffffff';
  let emoji = ' '; 

  if (shouldReveal) {
    if (isCorrect) {
      borderColor = '#22C55E';
      backgroundColor = '#F0FDF4';
      emoji = '✅';
    } else if (isSelected && !isCorrect) {
      borderColor = '#EF4444';
      backgroundColor = '#FEF2F2';
      emoji = '❌';
    }
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { borderColor, backgroundColor }]}
    >
      <View style={styles.row}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.label}>{option}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: {
    width: 28,
    textAlign: 'center',
    fontSize: 16,
  },
  label: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
});


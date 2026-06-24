import { Question } from '@/types/Question';

export const questions: Question[] = [
  {
    id: 'q1',
    category: 'INTRODUCTION TO REACT NATIVE',
    question: 'How does React Native render user interface elements on mobile devices?',
    options: [
      'It compiles entirely into a website inside WebView',
      'It bridges JavaScript to native UI views',
      'It draws pixels directly using Canvas',
      'It translates everything into C++',
    ],
    correctAnswer: 1,
    explanation:
      'React Native bridges JavaScript instructions to native platform UI components.',
  },
  {
    id: 'q2',
    category: 'SETUP & ENVIRONMENT',
    question: 'Which tool allows developers to run React Native apps quickly without Android Studio or Xcode?',
    options: [
      'Metro Bundler',
      'Expo Go',
      'React Native CLI',
      'CocoaPods',
    ],
    correctAnswer: 1,
    explanation: 'Expo Go allows running React Native apps without native compilation.',
  },
  {
    id: 'q3',
    category: 'CORE COMPONENTS',
    question: 'Which React Native component displays plain text?',
    options: ['View', 'ScrollView', 'Text', 'SafeAreaView'],
    correctAnswer: 2,
    explanation: 'All strings must be wrapped inside the Text component.',
  },
  {
    id: 'q4',
    category: 'PROPS',
    question: 'Which statement best describes Props?',
    options: [
      'Local mutable state',
      'Global values',
      'Immutable data passed from parent to child',
      'Network request functions',
    ],
    correctAnswer: 2,
    explanation: 'Props are read-only configuration values passed down the component tree.',
  },
  {
    id: 'q5',
    category: 'STATE MANAGEMENT',
    question: 'What happens after calling a useState setter?',
    options: [
      'Component re-renders',
      'App restarts',
      'Data is permanently stored',
      'State becomes read-only',
    ],
    correctAnswer: 0,
    explanation: 'Updating state triggers a React re-render.',
  },
];


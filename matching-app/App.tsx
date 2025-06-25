import React from 'react';
import { StatusBar } from 'expo-status-bar';
import PersonalityTestScreen from './screens/PersonalityTestScreen';

export default function App() {
  return (
    <>
      <PersonalityTestScreen />
      <StatusBar style="auto" />
    </>
  );
} 
/**
 * App entry
 * - 전역 Provider, 네비게이션, 글로벌 설정만 두는 용도
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LottoScreen from './src/screens/LottoScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <LottoScreen />
    </SafeAreaProvider>
  );
}

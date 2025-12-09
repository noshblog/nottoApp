// src/screens/LottoScreen.js
import React, {useRef, useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Vibration,
  FlatList,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  generateLottoNumbers,
  getRandomResultMessage,
} from '../utils/lotto';
import LottoBall from '../components/LottoBall';
import ShibaMascot from '../components/ShibaMascot';
import ShibaLoader from '../components/ShibaLoader';
import {scheduleWeeklyReminder} from '../notifications/notifications';

export default function LottoScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [daysLeft, setDaysLeft] = useState(getDaysUntilSaturday());

  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 히스토리 로딩
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('lotto_history');
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load history', e);
      }
    })();

    // (지금은 no-op 이지만 구조용)
    scheduleWeeklyReminder();

    // D-Day 갱신
    const timer = setInterval(() => {
      setDaysLeft(getDaysUntilSaturday());
    }, 60 * 60 * 1000); // 1시간마다

    return () => clearInterval(timer);
  }, []);

  const animateButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  };

  const animateButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  };

  const handleGenerate = () => {
    if (loading) return;

    setLoading(true);
    setNumbers([]);
    setResultMessage('');

    setTimeout(() => {
      const nums = generateLottoNumbers();
      const createdAt = new Date().toISOString();
      const entry = {
        id: Date.now().toString(),
        numbers: nums,
        createdAt,
      };

      setNumbers(nums);
      setLoading(false);
      setResultMessage(getRandomResultMessage());
      Vibration.vibrate(40);

      // 히스토리 업데이트 + 저장 (최대 20개)
      setHistory(prev => {
        const next = [entry, ...prev].slice(0, 20);
        AsyncStorage.setItem('lotto_history', JSON.stringify(next)).catch(
          console.warn,
        );
        return next;
      });
    }, 1500);
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;

    Alert.alert(
      '기록 초기화',
      '최근 추첨 기록을 모두 삭제할까요?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('lotto_history');
            } catch (e) {
              console.warn(e);
            }
            setHistory([]);
          },
        },
      ],
    );
  };

  // 🎨 라이트 톤 컬러 팔레트
  const backgroundColor = '#eef2ff'; // 연보라 느낌
  const cardColor = '#ffffff';

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor,
        },
      ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />

      {/* 헤더 + 시바 */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleBox}>
            <Text style={styles.appName}>notto</Text>
            <Text style={styles.title}>검은 시바 로또 추첨기</Text>
          </View>

          <ShibaMascot size={40} />
        </View>

        <Text style={styles.subtitle}>
          매주 가볍게 운세만 보고 가는 로또 앱 ✨
        </Text>

        <Text style={styles.countdownText}>
          {daysLeft === 0
            ? '오늘이 추첨날이에요! 로또 사기 전에 번호 한 번 뽑아볼까요?'
            : `이번 주 추첨까지 D-${daysLeft}`}
        </Text>
      </View>

      {/* 번호/추첨 카드 */}
      <View style={[styles.card, {backgroundColor: cardColor}]}>
        <Text style={styles.cardTitle}>이번 추첨 번호</Text>

        {loading ? (
          <ShibaLoader text="번호 추첨 중..." />
        ) : numbers.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>아직 번호를 뽑지 않았어요.</Text>
            <Text style={styles.emptySubText}>
              아래 버튼을 눌러 시바에게 번호를 맡겨보세요 🐕
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.ballRow}>
              {numbers.map((num, idx) => (
                <LottoBall key={num} number={num} index={idx} />
              ))}
            </View>
            {resultMessage ? (
              <Text style={styles.resultMessage}>{resultMessage}</Text>
            ) : null}
          </>
        )}
      </View>

      {/* 버튼 */}
      <View style={styles.buttonBox}>
        <Animated.View style={{transform: [{scale: buttonScale}]}}>
          <TouchableOpacity
            style={[styles.mainButton, loading && styles.mainButtonDisabled]}
            onPress={handleGenerate}
            onPressIn={animateButtonPressIn}
            onPressOut={animateButtonPressOut}
            activeOpacity={0.85}>
            <Text style={styles.mainButtonText}>
              {loading ? '추첨 중...' : '오늘 번호 뽑기'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* 히스토리 */}
      <View style={styles.historyBox}>
        <View style={styles.historyHeaderRow}>
          <Text style={styles.historyTitle}>최근 추첨 기록</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.historyClearText}>기록 초기화</Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <Text style={styles.historyEmptyText}>
            아직 저장된 기록이 없어요. 번호를 뽑으면 자동으로 기록돼요.
          </Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: 8}}
            renderItem={({item}) => (
              <View style={styles.historyRow}>
                <Text style={styles.historyDate}>
                  {formatHistoryDate(item.createdAt)}
                </Text>
                <View style={styles.historyNumbersRow}>
                  {item.numbers.map((num, idx) => (
                    <View key={`${item.id}-${num}-${idx}`} style={styles.historyBallWrapper}>
                      <LottoBall number={num} size={30} index={0} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          번호는 1~45 중 중복 없이 6개 랜덤 생성됩니다.
        </Text>
        <Text style={styles.footerSubText}>
          실제 복권 구매·당첨 보장과는 관련 없는, 가벼운 재미용 앱이에요 🙂
        </Text>
      </View>
    </View>
  );
}

function getDaysUntilSaturday() {
  const now = new Date();
  const day = now.getDay(); // 0:일 ~ 6:토
  let diff = 6 - day;
  if (diff < 0) diff += 7;
  return diff;
}

function formatHistoryDate(isoString) {
  const d = new Date(isoString);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // 좁은 화면에서 자동 줄바꿈
  },
  headerTitleBox: {
    flexShrink: 1,
    paddingRight: 8,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 13,
    color: '#4b5563',
  },
  countdownText: {
    marginTop: 6,
    fontSize: 13,
    color: '#2563eb',
  },
  card: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  emptyBox: {
    paddingVertical: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#111827',
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  ballRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  resultMessage: {
    marginTop: 14,
    fontSize: 13,
    color: '#374151',
  },
  buttonBox: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  mainButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonDisabled: {
    opacity: 0.6,
  },
  mainButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#022c22',
  },
  historyBox: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  historyClearText: {
    fontSize: 12,
    color: '#dc2626',
  },
  historyEmptyText: {
    fontSize: 12,
    color: '#6b7280',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  historyDate: {
    width: 80,
    fontSize: 11,
    color: '#6b7280',
  },
  historyNumbersRow: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  historyBallWrapper: {
    marginRight: 4,
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerSubText: {
    marginTop: 4,
    fontSize: 11,
    color: '#9ca3af',
  },
});

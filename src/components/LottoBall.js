// src/components/LottoBall.js
import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {getBallColor} from '../utils/lotto';

export default function LottoBall({number, size = 44, index = 0}) {
  const backgroundColor = getBallColor(number);

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 80;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, index]);

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          opacity,
          transform: [{scale}],
        },
      ]}>
      <Text style={styles.ballText}>{number}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
});

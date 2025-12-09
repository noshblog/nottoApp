// src/components/HamsterLoader.js
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Text, StyleSheet, View} from 'react-native';

export default function HamsterLoader({text = '번호 추첨중...'}) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
      rotation.setValue(0);
    };
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingBox}>
      <Animated.View style={{transform: [{rotate: spin}]}}>
        <Text style={styles.hamster}>🐹</Text>
      </Animated.View>
      <Text style={styles.loadingText}>{text}</Text>
      <Text style={styles.subText}>햄찌가 공을 열심히 섞고 있어요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  hamster: {
    fontSize: 40,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#e5e7eb',
  },
  subText: {
    marginTop: 4,
    fontSize: 12,
    color: '#9ca3af',
  },
});

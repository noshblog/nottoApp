// src/components/ShibaLoader.js
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

export default function ShibaLoader({text = '번호 추첨 중...'}) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
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
        <Image
          source={require('../assets/shiba/shiba_loading.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.loadingText}>{text}</Text>
      <Text style={styles.subText}>시바가 공을 열심히 굴리고 있어요 🐕</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  image: {
    width: 60,
    height: 60,
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

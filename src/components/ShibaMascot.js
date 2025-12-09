// src/components/ShibaMascot.js
import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';

export default function ShibaMascot({size = 44}) {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../assets/shiba/shiba_idle.png')}
        style={{width: size, height: size}}
        resizeMode="contain"
      />
      <Text
        style={styles.caption}
        numberOfLines={1}
        ellipsizeMode="tail">
        이번 주 번호 준비 완료!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe', // 밝은 하늘색 칩
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    maxWidth: 160,        // 너무 길어지지 않게
  },
  caption: {
    flexShrink: 1,
    fontSize: 11,
    color: '#0f172a',
    marginLeft: 6,
  },
});

// src/utils/lotto.js

// 1~45 중 중복 없이 6개 뽑고 오름차순 정렬
export function generateLottoNumbers() {
    const set = new Set();
  
    while (set.size < 6) {
      const n = Math.floor(Math.random() * 45) + 1;
      set.add(n);
    }
  
    return Array.from(set).sort((a, b) => a - b);
  }
  
  // 번호별 공 색상
  export function getBallColor(num) {
    if (num >= 1 && num <= 10) return '#facc15';   // 노랑
    if (num >= 11 && num <= 20) return '#3b82f6';  // 파랑
    if (num >= 21 && num <= 30) return '#ef4444';  // 빨강
    if (num >= 31 && num <= 40) return '#9ca3af';  // 회색
    return '#22c55e';                              // 초록(41~45)
  }
  
  // 번호 뽑힌 후에 보여줄 랜덤 메시지
  const RESULT_MESSAGES = [
    '오늘 이 번호 어때요? 😎',
    '느낌이 좀 좋은데요…? ✨',
    '과몰입 금지, 재미로만 즐기기! 🎲',
    '시바가 열심히 골라봤어요 🐕',
    '언젠가는… 올 수도 있겠죠? 🍀',
  ];
  
  export function getRandomResultMessage() {
    const idx = Math.floor(Math.random() * RESULT_MESSAGES.length);
    return RESULT_MESSAGES[idx];
  }
  
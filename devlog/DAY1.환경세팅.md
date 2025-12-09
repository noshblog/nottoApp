🧩 DAY 0 — React Native CLI 환경 세팅 (Android 실기기 디버깅용)

🎯 목표: Expo 없이 React Native CLI 환경을 구축하고, VSCode + Android Studio + 실기기 USB 연결까지 완료하기.

✅ 1. 사전 준비 체크리스트 항목 설명 OS Windows 10 이상 개발툴 VSCode + Android Studio 설치 Node.js LTS (v18 이상 권장) JDK 17 이상 (OpenJDK 또는 Temurin) Git 설치되어 있어야 함 스마트폰 USB 디버깅 모드 허용 (Android) 🧱 2. Node.js & Yarn 설치

Node.js 공식 다운로드

→ LTS 버전 (예: 18.x) 설치

설치 확인

node -v npm -v

Yarn 설치

npm install -g yarn yarn -v

💡 Yarn은 React Native CLI 환경에서 패키지 관리 속도가 npm보다 안정적이라 추천.

☕ 3. JDK 17 이상 설치

Temurin (Eclipse Adoptium) 접속 → Windows / JDK 17 선택 후 설치

환경변수 설정

JAVA_HOME 추가 → 예: C:\Program Files\Eclipse Adoptium\jdk-17

Path에 %JAVA_HOME%\bin 추가

확인:

java -version

🧰 4. Android Studio 설치 및 환경설정

Android Studio 다운로드

설치 중 다음 체크 필수 ✅

Android SDK

Android SDK Platform

Android Virtual Device (AVD) (에뮬레이터는 사용 안 해도 됨)

설치 완료 후:

SDK 위치 확인: File → Settings → Appearance & Behavior → System Settings → Android SDK → SDK Path 복사 (예: C:\Users<User>\AppData\Local\Android\Sdk)

환경 변수 설정:

ANDROID_HOME = C:\Users<User>\AppData\Local\Android\Sdk Path에 추가: %ANDROID_HOME%\platform-tools %ANDROID_HOME%\tools %ANDROID_HOME%\tools\bin

확인:

adb version

📱 5. Android 실기기 USB 디버깅 설정

스마트폰 → 설정 → 개발자 옵션 활성화

“빌드 번호” 7회 터치 → 개발자 모드 진입

“USB 디버깅” ON

USB로 PC 연결

명령어로 인식 확인:

adb devices

→ device 로 표시되면 성공 🎉 (만약 unauthorized 뜨면, 폰 화면에서 USB 디버깅 허용 선택)

🏗️ 6. React Native CLI 프로젝트 생성

Expo 아님, CLI 방식으로 직접 생성!

npx react-native init LottoApp

📁 생성 완료 후 구조 예시:

LottoApp/ ┣ android/ ┣ ios/ ┣ node_modules/ ┣ App.js ┣ package.json ┗ index.js

🧠 7. 첫 실행 (실기기 연결 상태에서)

프로젝트 폴더로 이동

cd LottoApp

Metro 서버 실행

npx react-native start

새 터미널에서 앱 실행

npx react-native run-android

결과

폰에서 앱이 자동 설치 → “Welcome to React Native!” 화면 나오면 ✅ 성공!

🧩 8. VSCode 세팅 팁 항목 추천 설정 플러그인 React Native Tools, Prettier, ES7+ Snippets 디버깅 터미널 명령으로 빌드 (VSCode 디버거보다 안정적) 저장 자동 정리 "editor.formatOnSave": true 🚀 9. 트러블슈팅 요약 증상 원인 해결 adb devices 안 뜸 USB 권한 문제 USB 케이블 교체, 개발자옵션 재활성화 gradlew failed JDK 경로 문제 JAVA_HOME 재설정 앱 설치 실패 안드로이드 버전 불일치 Android Studio SDK 업데이트 📝 10. 블로그 포스팅 예시 템플릿

DAY 0 — React Native CLI 환경 세팅 (실기기 기준)
퇴근 후 첫 세팅 완료! 오늘은 React Native CLI 환경을 직접 구축했다.
Expo 없이 직접 CLI로 진행하는 이유는, 추후 네이티브 연동(예: SQLite, 자산 관리 기능)을 고려하기 때문이다.

✅ 진행 과정
Node.js & Yarn 설치
JDK 17 설치 및 환경변수 세팅
Android Studio SDK 경로 설정
ADB 연결 테스트 (adb devices)
npx react-native init LottoApp 으로 프로젝트 생성
npx react-native run-android 실행 성공 🎉
💡 느낀 점
예전에 회사에서 했던 방식이어서 손에 익었다.
Expo보다 복잡하지만, 직접 세팅하면서 구조를 이해하게 됨.
실기기로 바로 빌드되는 순간 짜릿하다!
🔜 다음 목표 (DAY 1)
프로젝트 구조 설계 + 화면 라우팅 (Navigation) 구성 시작

🔔 정리 항목 완료여부 Node.js / Yarn ✅ JDK 17 ✅ Android Studio ✅ USB 디버깅 ✅ React Native CLI 프로젝트 생성 ✅ 앱 첫 실행 ✅
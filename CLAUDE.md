# REMEDY 프로젝트 가이드

## 프로젝트 개요

REMEDY는 위치 기반 음악 드랍핑 소셜 플랫폼입니다. 사용자는 특정 위치에 음악을 "드랍"하여 다른 사용자들과 공유하고, 러닝 중 음악을 즐기며, 다양한 챌린지에 참여할 수 있습니다.

## 기술 스택

### 핵심
- **React Native** 0.80.0 (React 19.1.0, TypeScript 5.0.4)
- **React Navigation** 7.x (Stack, Native Stack)
- **상태 관리**: Zustand 5.0.8 (클라이언트), TanStack React Query 5.83.0 (서버), Context API (인증)
- **HTTP 클라이언트**: Axios 1.10.0

### 음악
- **react-native-track-player** 5.0.0-alpha: HLS 스트리밍 기반 음악 재생
- **Spotify API**: 음악 검색 및 프리뷰

### UI/UX
- react-native-reanimated 4.1.5
- react-native-gesture-handler 2.28.0
- react-native-svg 15.12.0
- @animatereactnative/marquee 0.5.2
- react-native-safe-area-context 5.5.2

### 위치 서비스
- Google Maps API
- react-native-geolocation-service 5.3.1

## 프로젝트 구조

```
src/
├── assets/                  # 폰트, 이미지 등 정적 리소스
├── components/              # 공통 컴포넌트 (button, cdPlayer, icon, map, modal, playBar 등)
├── constants/               # 색상, 폰트, 타이포그래피, 약관 등
├── hooks/                   # 공통 훅 (music, navigation)
├── modules/                 # Feature-based 모듈
│   ├── auth/               # 인증 (JWT + Refresh Token)
│   ├── challenge/          # 챌린지 시스템
│   ├── drop/               # 음악 드랍핑 (위치 기반)
│   ├── home/               # 홈, 러닝 트래킹, 지도
│   ├── music/              # 음악 상세, 댓글, 좋아요
│   └── profile/            # 프로필 관리
├── navigation/              # 내비게이션 설정
├── queries/                 # React Query 설정 및 키
├── services/                # 외부 서비스 (Spotify)
├── stores/                  # Zustand 스토어 (playerStore)
├── types/                   # 전역 타입 정의
└── utils/                   # 유틸리티 함수
```

### Feature-Based 모듈 구조

각 모듈은 다음과 같은 독립적인 구조를 가집니다:

```
module/
├── api/                     # API 호출 함수
├── components/              # 모듈 전용 컴포넌트
├── hooks/                   # 모듈 전용 React Query 훅
├── pages/                   # 화면 컴포넌트
├── types/                   # 타입 정의
├── styles/                  # 스타일
├── queries/                 # React Query 키
└── utils/                   # 유틸리티
```

## 주요 기능

### 1. 인증 시스템 (src/modules/auth/)

- **JWT + Refresh Token** 방식
- **자동 토큰 갱신**: 401 에러 발생 시 Refresh Token으로 자동 갱신 후 원본 요청 재시도
- **Axios 인터셉터**: `src/modules/auth/api/axiosInstance.ts`에서 토큰 주입 및 에러 처리
- **Context API**: `auth-context.tsx`에서 인증 상태 관리

**중요 파일**:
- `api/axiosInstance.ts`: Axios 설정 및 인터셉터
- `api/authApi.ts`: 로그인/회원가입 API
- `auth-context.tsx`: 인증 Context Provider

### 2. 음악 재생 (src/stores/playerStore.ts, src/hooks/music/)

- **HLS 스트리밍**: `useHLSPlayer.ts`에서 M3U8 플레이리스트 파싱 및 재생
- **Zustand 상태 관리**: 재생 큐, 현재 재생 곡 관리
- **TrackPlayer**: 네이티브 음악 재생기
- **Spotify 통합**: 음악 검색 및 프리뷰 재생

**중요 파일**:
- `stores/playerStore.ts`: 음악 플레이어 전역 상태
- `hooks/music/useHLSPlayer.ts`: HLS 스트리밍 로직
- `services/spotify/`: Spotify API 통합

### 3. 드랍핑 (src/modules/drop/)

- **위치 기반 음악 공유**: 특정 위치에 음악 드랍
- **Google Maps 통합**: 지도에 드랍 표시
- **드랍 조회**: 반경 내 드랍 검색

**주요 API**:
- `createDropping`: 드랍 생성
- `getDroppings`: 위치 기반 드랍 조회
- `getSongInfo`: 곡 정보 조회

### 4. 챌린지 (src/modules/challenge/)

- **타입**: DAILY (일일), PERMANENT (영구)
- **React Query 훅**: `useAchievements`, `useMyAchievements`

### 5. 러닝 트래킹 (src/modules/home/)

- **Geolocation**: 실시간 위치 추적
- **통계**: 거리, 시간 측정
- **음악 통합**: 러닝 중 랜덤 음악 재생


### Axios 인터셉터 흐름

1. **Request Interceptor**:
   - AsyncStorage에서 토큰 자동 주입
   - 요청 로깅

2. **Response Interceptor**:
   - 401 에러 시 Refresh Token으로 자동 갱신
   - 원본 요청 재시도 (`_retry` 플래그)
   - 갱신 실패 시:
     - React Query 캐시 클리어
     - AsyncStorage 토큰 삭제
     - Auth 화면으로 이동

### React Query 패턴

```typescript
// Custom Hook 예시
export const useCreateDropping = () => {
  const mutation = useMutation({
    mutationFn: (data: CreateDropData) => createDropping(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['droppings'] });
    },
  });
  return mutation;
};
```

## 상태 관리 전략

### 1. Zustand (클라이언트 전역 상태)
- **용도**: UI 상태, 음악 플레이어 상태
- **위치**: `src/stores/`
- **예시**: `playerStore.ts` - 재생 큐, 현재 곡

### 2. TanStack React Query (서버 상태)
- **용도**: API 데이터 캐싱, 서버 상태 동기화
- **패턴**: 각 모듈의 `hooks/` 디렉토리에 Custom Hooks
- **캐싱**: 5분 staleTime, 1회 retry

### 3. Context API (인증 상태)
- **용도**: 사용자 인증 상태, 토큰 관리
- **위치**: `src/modules/auth/auth-context.tsx`

## 코딩 컨벤션

### TypeScript
- **strict 모드** 활성화
- 모든 props, 함수 반환 타입 명시
- `any` 사용 최소화
- 전역 타입: `src/types/`
- 모듈별 타입: 각 모듈의 `types/` 디렉토리

### 컴포넌트
- **함수형 컴포넌트** + **Hooks**
- PascalCase 파일명 (예: `MusicNode.tsx`)
- Props 인터페이스 정의

### 스타일
- StyleSheet 사용 (컴포넌트 하단 정의)
- 색상: `constants/colors.ts` 활용
- 폰트: `constants/fonts.ts` 활용
- 타이포그래피: `constants/typography.ts` 활용

### API 호출
- 각 모듈의 `api/` 디렉토리에 함수 정의
- React Query Custom Hooks로 래핑
- Error Handling: try-catch + Toast 알림

## 개발 팁

### 1. 새로운 기능 추가 시
1. 해당 모듈의 디렉토리 구조 확인
2. `api/` 디렉토리에 API 함수 작성
3. `hooks/` 디렉토리에 React Query Hook 작성
4. `types/` 디렉토리에 타입 정의
5. `components/` 또는 `pages/`에 UI 구현

### 2. 음악 재생 관련 작업
- HLS URL은 `MUSIC_API_BASE_URL` 기반
- `playerStore`의 `playIfDifferent` 함수 사용
- TrackPlayer 이벤트 리스너 활용 (`useHLSPlayer.ts` 참고)

### 3. 위치 기반 기능
- Geolocation 권한 요청 필수
- Google Maps API 키 설정 확인
- 위도/경도를 API에 전달 시 `latitude`, `longitude` 필드명 사용

### 4. 인증 관련 작업
- 토큰이 필요한 API는 자동으로 인터셉터가 처리
- 로그아웃 시 `authContext.logout()` 호출
- 인증 상태는 `authContext.userToken`으로 확인

### 5. 디버깅
- Axios 요청/응답은 콘솔에 자동 로깅됨
- React Query DevTools는 설정되지 않음 (필요 시 추가)
- React Native Debugger 사용 권장

## 현재 브랜치 상태

**브랜치**: `fix/bug`
**메인 브랜치**: `main`

**수정된 파일** (git status):
- `src/hooks/music/useHLSPlayer.ts`
- `src/modules/drop/components/Music/Music.tsx`
- `src/modules/drop/hooks/useSongSearch.ts`
- `src/modules/drop/pages/DropScreen.tsx`
- `src/modules/drop/pages/DropSearchScreen.tsx`
- `src/modules/drop/types/DropScreen.ts`
- `src/modules/drop/types/Music.ts`
- `src/modules/home/components/MainFunction/MusicNode.tsx`
- `src/modules/home/components/MainFunction/index.tsx`
- `src/modules/music/pages/MusicScreen.tsx`
- `src/modules/profile/types/Header.ts`
- `src/stores/playerStore.ts`

**최근 커밋**:
- `albumImagePath` 필드명 변경 수정
- 검색 화면 MarqueeText 적용
- Safe Area Context 적용
- `MUSIC_API_BASE_URL` 환경 변수 변경

## 알려진 이슈 및 주의사항

1. **React Native 0.80.0**: 비교적 최신 버전이므로 일부 라이브러리 호환성 확인 필요
2. **HLS 스트리밍**: iOS/Android 네이티브 설정 필요 (`Info.plist`, `AndroidManifest.xml`)
3. **Google Maps API**: 키 관리 주의 (`.env` 파일은 `.gitignore`에 포함)
4. **Spotify API**: Client Credentials Flow만 사용 (사용자 인증 없음)
5. **위치 권한**: 런타임 권한 요청 처리 필요

## 유용한 명령어

```bash
# 개발 서버 시작
npm start

# iOS 실행
npm run ios

# Android 실행
npm run android

# 타입 체크
npm run typecheck

# 린트
npm run lint

# 빌드 (Android)
cd android && ./gradlew assembleRelease

# 빌드 (iOS)
cd ios && xcodebuild -workspace Remedy.xcworkspace -scheme Remedy -configuration Release
```

## 추가 리소스

- **React Native 공식 문서**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **TanStack Query**: https://tanstack.com/query/latest
- **Zustand**: https://github.com/pmndrs/zustand
- **TrackPlayer**: https://react-native-track-player.js.org/

---

**마지막 업데이트**: 2025-11-13

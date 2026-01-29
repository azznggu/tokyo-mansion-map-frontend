# Tokyo New Mansion Map - Frontend

도쿄 신축맨션 검색 웹 애플리케이션의 프론트엔드입니다.

## 기술 스택

- **React 18** + **TypeScript**
- **Vite** - 빌드 도구
- **React Leaflet** - 지도 (OpenStreetMap)
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅

## 프로젝트 구조

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/      # 공통 컴포넌트 (Header, Loading)
│   │   ├── map/         # 지도 관련 컴포넌트
│   │   ├── mansion/     # 맨션 카드, 리스트 등
│   │   └── search/      # 검색 필터
│   ├── hooks/           # 커스텀 훅
│   ├── pages/           # 페이지 컴포넌트
│   ├── services/        # API 서비스
│   ├── store/           # Zustand 스토어
│   ├── types/           # TypeScript 타입 정의
│   └── utils/           # 유틸리티 함수
├── public/
└── index.html
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일에서 Backend API URL을 설정하세요:

```
VITE_API_URL=http://localhost:8888/.netlify/functions
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

## 주요 기능

- **지도 검색**: 도쿄 지도에서 신축맨션 위치 확인
- **필터링**: 가격, 면적, 방 타입, 역 도보 시간 등으로 필터링
- **리스트 뷰**: 검색 결과를 리스트로 확인
- **상세 정보**: 맨션 상세 정보 및 교통 정보 확인

## Netlify 배포

```bash
# Netlify CLI 설치 (전역)
npm install -g netlify-cli

# 배포
netlify deploy --prod
```

## 환경 변수 (Netlify)

Netlify 대시보드에서 다음 환경 변수를 설정하세요:

- `VITE_API_URL`: Backend API URL

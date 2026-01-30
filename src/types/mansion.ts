// 맨션 기본 정보 타입
export interface Mansion {
  id: string;
  name: string;
  nameJa: string;
  address: string;
  addressJa: string;
  latitude: number;
  longitude: number;

  // 가격 정보
  priceMin: number;
  priceMax: number;
  priceUnit: '万円' | '億円';

  // 면적 정보
  areaMin: number;
  areaMax: number;

  // 방 정보
  layoutTypes: string[]; // 예: ['1LDK', '2LDK', '3LDK']
  totalUnits: number;

  // 건물 정보
  floors: number;
  completion: string; // 예: '2025年3月'
  developer: string;

  // 교통 정보
  stations: StationAccess[];

  // 이미지
  thumbnailUrl: string;
  imageUrls: string[];

  // 메타 정보
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

// 역 접근 정보
export interface StationAccess {
  lineName: string;
  stationName: string;
  walkMinutes: number;
}

// 검색 필터 타입
export interface SearchFilter {
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  layoutTypes?: string[];
  stations?: string[];
  walkMinutesMax?: number;
  ward?: string; // 도쿄 구
  completionYear?: number;
  totalUnitsMin?: number; // 총호수 최소
  totalUnitsMax?: number; // 총호수 최대
}

// 지도 영역 타입
export interface MapBounds {
  northEast: {
    lat: number;
    lng: number;
  };
  southWest: {
    lat: number;
    lng: number;
  };
}

// API 응답 타입
export interface MansionListResponse {
  data: Mansion[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 도쿄 23구 목록
export const TOKYO_WARDS = [
  '千代田区', '中央区', '港区', '新宿区', '文京区',
  '台東区', '墨田区', '江東区', '品川区', '目黒区',
  '大田区', '世田谷区', '渋谷区', '中野区', '杉並区',
  '豊島区', '北区', '荒川区', '板橋区', '練馬区',
  '足立区', '葛飾区', '江戸川区'
] as const;

export type TokyoWard = typeof TOKYO_WARDS[number];

// 방 타입 목록
export const LAYOUT_TYPES = [
  '1R', '1K', '1DK', '1LDK',
  '2K', '2DK', '2LDK',
  '3K', '3DK', '3LDK',
  '4LDK以上'
] as const;

export type LayoutType = typeof LAYOUT_TYPES[number];

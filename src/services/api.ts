import axios from 'axios';
import type { Mansion, MansionListResponse, SearchFilter, MapBounds } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/.netlify/functions';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 맨션 목록 조회
export const fetchMansions = async (
  filter: SearchFilter,
  bounds?: MapBounds | null,
  page: number = 1,
  pageSize: number = 20
): Promise<MansionListResponse> => {
  const params: Record<string, unknown> = {
    page,
    pageSize,
    ...filter,
  };

  if (bounds) {
    params.neLat = bounds.northEast.lat;
    params.neLng = bounds.northEast.lng;
    params.swLat = bounds.southWest.lat;
    params.swLng = bounds.southWest.lng;
  }

  const response = await apiClient.get<MansionListResponse>('/mansions', { params });
  return response.data;
};

// 맨션 상세 조회
export const fetchMansionById = async (id: string): Promise<Mansion> => {
  const response = await apiClient.get<Mansion>(`/mansions/${id}`);
  return response.data;
};

// 지도 영역 내 맨션 조회 (클러스터링용)
export const fetchMansionsInBounds = async (
  bounds: MapBounds,
  filter: SearchFilter
): Promise<Mansion[]> => {
  const params = {
    neLat: bounds.northEast.lat,
    neLng: bounds.northEast.lng,
    swLat: bounds.southWest.lat,
    swLng: bounds.southWest.lng,
    ...filter,
  };

  const response = await apiClient.get<{ data: Mansion[] }>('/mansions/bounds', { params });
  return response.data.data;
};

export { apiClient };

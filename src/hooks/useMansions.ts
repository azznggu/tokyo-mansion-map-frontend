import { useQuery } from '@tanstack/react-query';
import { fetchMansions, fetchMansionById, fetchMansionsInBounds } from '../services/api';
import { useSearchStore } from '../store';
import type { MapBounds, SearchFilter } from '../types';

// 맨션 목록 조회 훅
export const useMansions = (page: number = 1, pageSize: number = 20) => {
  const { filter, mapBounds } = useSearchStore();

  return useQuery({
    queryKey: ['mansions', filter, mapBounds, page, pageSize],
    queryFn: () => fetchMansions(filter, mapBounds, page, pageSize),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 맨션 상세 조회 훅
export const useMansionDetail = (id: string | null) => {
  return useQuery({
    queryKey: ['mansion', id],
    queryFn: () => fetchMansionById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 지도 영역 내 맨션 조회 훅
export const useMansionsInBounds = (bounds: MapBounds | null, filter: SearchFilter) => {
  return useQuery({
    queryKey: ['mansions-bounds', bounds, filter],
    queryFn: () => fetchMansionsInBounds(bounds!, filter),
    enabled: !!bounds,
    staleTime: 1000 * 60 * 2, // 2분
  });
};

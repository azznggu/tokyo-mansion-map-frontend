import { useCallback, useRef, useEffect } from 'react';
import { MansionList } from '../components/mansion';
import { SearchFilter } from '../components/search';
import { useInfiniteMansions } from '../hooks';
import type { Mansion } from '../types';

export const ListPage = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteMansions(20);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 모든 페이지의 맨션을 합침
  const mansions = data?.pages.flatMap(page => page.data) || [];
  const total = data?.pages[0]?.total || 0;

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelectMansion = useCallback((mansion: Mansion) => {
    window.open(mansion.sourceUrl, '_blank');
  }, []);

  return (
    <div className="h-full flex bg-gray-50">
      {/* 좌측: 매물 목록 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">新築マンション一覧</h1>
            <p className="text-sm text-gray-500 mt-1">
              東京都の新築マンション情報を一覧で表示しています
            </p>
          </div>

          {/* 검색 결과 수 */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              検索結果: <span className="font-bold text-blue-600">{total}</span>件
              {mansions.length > 0 && mansions.length < total && (
                <span className="text-gray-400 ml-2">
                  （{mansions.length}件表示中）
                </span>
              )}
            </span>
          </div>

          {/* 매물 목록 */}
          <MansionList
            mansions={mansions}
            isLoading={isLoading && mansions.length === 0}
            onSelect={handleSelectMansion}
          />

          {/* 무한 스크롤 트리거 영역 */}
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>読み込み中...</span>
              </div>
            )}
            {!hasNextPage && mansions.length > 0 && (
              <span className="text-gray-400 text-sm">
                すべての物件を表示しました
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 우측: 필터 영역 (데스크탑에서만 고정 표시) */}
      <div className="hidden lg:block w-80 flex-shrink-0 border-l border-gray-200 bg-white p-4 overflow-y-auto">
        <SearchFilter alwaysOpen />
      </div>

      {/* 모바일: 플로팅 필터 버튼 */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[500]">
        <SearchFilter bottomSheet />
      </div>
    </div>
  );
};

import { useState, useCallback } from 'react';
import { MansionList } from '../components/mansion';
import { SearchFilter } from '../components/search';
import { useMansions } from '../hooks';
import type { Mansion } from '../types';

export const ListPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMansions(page);

  const mansions = data?.data || [];
  const hasMore = data?.hasMore || false;

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
              検索結果: <span className="font-bold text-blue-600">{data?.total || 0}</span>件
            </span>
          </div>

          {/* 매물 목록 */}
          <MansionList
            mansions={mansions}
            isLoading={isLoading}
            onSelect={handleSelectMansion}
          />

          {/* 페이지네이션 */}
          {!isLoading && mansions.length > 0 && (
            <div className="flex justify-center space-x-4" style={{ marginTop: '80px', marginBottom: '60px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                前へ
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                {page} ページ
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          )}
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

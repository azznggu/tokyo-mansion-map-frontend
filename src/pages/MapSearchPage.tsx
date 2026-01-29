import { useState, useCallback } from 'react';
import { MansionMap } from '../components/map';
import { MansionCard } from '../components/mansion';
import { SearchFilter } from '../components/search';
import { Loading } from '../components/common';
import { useMansions } from '../hooks';
import { useSearchStore } from '../store';
import type { Mansion } from '../types';

export const MapSearchPage = () => {
  const [selectedMansion, setSelectedMansion] = useState<Mansion | null>(null);
  const { setSelectedMansion: setStoreSelectedMansion } = useSearchStore();
  const { data, isLoading } = useMansions();

  const mansions = data?.data || [];

  const handleSelectMansion = useCallback(
    (mansion: Mansion) => {
      setSelectedMansion(mansion);
      setStoreSelectedMansion(mansion.id);
    },
    [setStoreSelectedMansion]
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedMansion(null);
    setStoreSelectedMansion(null);
  }, [setStoreSelectedMansion]);

  return (
    <div className="flex h-full w-full">
      {/* 사이드바 - 선택된 매물 상세 (데스크탑) */}
      {selectedMansion && (
        <div className="hidden md:block w-96 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-900">物件詳細</h2>
              <button
                onClick={handleCloseDetail}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MansionCard mansion={selectedMansion} isSelected />

            {/* 상세 정보 추가 */}
            <div className="mt-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">交通アクセス</h4>
                <ul className="text-sm text-gray-600">
                  {selectedMansion.stations.map((station, idx) => (
                    <li key={idx} className="mb-1">
                      {station.lineName} {station.stationName}駅 徒歩{station.walkMinutes}分
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">建物概要</h4>
                <dl className="text-sm">
                  <div className="flex justify-between mb-1">
                    <dt className="text-gray-500">総戸数</dt>
                    <dd className="text-gray-900">{selectedMansion.totalUnits}戸</dd>
                  </div>
                  <div className="flex justify-between mb-1">
                    <dt className="text-gray-500">階数</dt>
                    <dd className="text-gray-900">{selectedMansion.floors}階建て</dd>
                  </div>
                  <div className="flex justify-between mb-1">
                    <dt className="text-gray-500">完成予定</dt>
                    <dd className="text-gray-900">{selectedMansion.completion}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">売主</dt>
                    <dd className="text-gray-900">{selectedMansion.developer}</dd>
                  </div>
                </dl>
              </div>

              <a
                href={selectedMansion.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                style={{ marginTop: '24px', cursor: 'pointer' }}
              >
                SUUMOで詳細を見る
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 메인 지도 영역 */}
      <div className="flex-1 relative h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-[500]">
            <Loading text="物件を読み込み中..." />
          </div>
        )}

        <MansionMap
          mansions={mansions}
          selectedMansion={selectedMansion}
          onSelectMansion={handleSelectMansion}
        />

        {/* 우측 상단: 검색 결과 수 + 필터 (데스크탑) */}
        <div className="hidden md:flex absolute top-4 right-4 z-[500] flex-row items-center gap-3">
          <div className="bg-white shadow-lg rounded-lg px-4 py-3 border border-gray-200">
            <span className="text-base text-gray-600">
              検索結果: <span className="font-bold text-blue-600 text-lg">{data?.total || 0}</span>件
            </span>
          </div>
          <SearchFilter />
        </div>

        {/* 우측 하단: 검색 결과 수 + 필터 (모바일) */}
        <div className="md:hidden fixed bottom-6 right-6 z-[500] flex flex-col items-end gap-3">
          <div className="bg-white shadow-lg rounded-lg px-4 py-3 border border-gray-200">
            <span className="text-sm text-gray-600">
              検索結果: <span className="font-bold text-blue-600 text-base">{data?.total || 0}</span>件
            </span>
          </div>
          <SearchFilter bottomSheet />
        </div>
      </div>

      {/* 모바일 하단 시트 - 선택된 매물 상세 */}
      {selectedMansion && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[600] max-h-[60vh] overflow-y-auto rounded-t-2xl">
          <div className="p-4">
            {/* 핸들 바 */}
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg text-gray-900">物件詳細</h2>
              <button
                onClick={handleCloseDetail}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 bg-gray-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <MansionCard mansion={selectedMansion} isSelected />

            <div className="mt-4">
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">交通アクセス</h4>
                <ul className="text-xs text-gray-600">
                  {selectedMansion.stations.map((station, idx) => (
                    <li key={idx} className="mb-1">
                      {station.lineName} {station.stationName}駅 徒歩{station.walkMinutes}分
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={selectedMansion.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                style={{ marginTop: '16px', cursor: 'pointer' }}
              >
                SUUMOで詳細を見る
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

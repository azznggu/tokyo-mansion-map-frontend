import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { triggerCrawl, CrawlResult } from '../../services/api';

export const Header = () => {
  const location = useLocation();
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCrawl = async () => {
    if (isCrawling) return;

    const confirmed = window.confirm(
      'SUUMO에서 최신 맨션 데이터를 가져옵니다.\n이 작업은 몇 분 정도 소요됩니다.\n\n계속하시겠습니까?'
    );

    if (!confirmed) return;

    setIsCrawling(true);
    setCrawlResult(null);
    setShowResult(false);

    try {
      const result = await triggerCrawl(3); // 3페이지 크롤링
      setCrawlResult(result);
      setShowResult(true);
    } catch (error: any) {
      setCrawlResult({
        success: false,
        error: error.message || '크롤링 중 오류가 발생했습니다.',
      });
      setShowResult(true);
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 h-16 flex-shrink-0 relative" style={{ zIndex: 1000 }}>
      <div className="h-full w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* 좌측: 로고 */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 block leading-tight">
                東京新築マンション
              </span>
              <span className="text-sm text-gray-500">Tokyo New Mansion Search</span>
            </div>
          </Link>

          {/* 우측: 네비게이션 */}
          <nav className="flex items-center gap-3" style={{ marginRight: '20px' }}>
            <Link
              to="/"
              className={`px-6 py-2.5 rounded-lg text-base font-bold transition-all flex items-center gap-2 ${
                location.pathname === '/'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="hidden sm:inline">地図検索</span>
            </Link>
            <Link
              to="/list"
              className={`px-6 py-2.5 rounded-lg text-base font-bold transition-all flex items-center gap-2 ${
                location.pathname === '/list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">検索結果一覧</span>
            </Link>

            {/* 크롤링 버튼 */}
            <button
              onClick={handleCrawl}
              disabled={isCrawling}
              className={`px-4 py-2.5 rounded-lg text-base font-bold transition-all flex items-center gap-2 ${
                isCrawling
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
              }`}
              title="SUUMO에서 최신 데이터 가져오기"
            >
              {isCrawling ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="hidden sm:inline">更新中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">データ更新</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </div>
      {/* 크롤링 결과 모달 */}
      {showResult && crawlResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${crawlResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {crawlResult.success ? 'データ更新完了' : 'エラーが発生しました'}
              </h3>
              <button
                onClick={() => setShowResult(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {crawlResult.success && crawlResult.stats ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-blue-600 font-bold text-xl">{crawlResult.stats.crawled}</div>
                    <div className="text-gray-600">クロール件数</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-green-600 font-bold text-xl">{crawlResult.stats.geocoded}</div>
                    <div className="text-gray-600">地図表示可能</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-purple-600 font-bold text-xl">{crawlResult.stats.saved}</div>
                    <div className="text-gray-600">保存成功</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-red-600 font-bold text-xl">{crawlResult.stats.failed}</div>
                    <div className="text-gray-600">保存失敗</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  ページを再読み込みすると最新データが表示されます。
                </p>
              </div>
            ) : (
              <div className="text-red-600">
                {crawlResult.error || 'Unknown error occurred'}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setShowResult(false);
                  window.location.reload();
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
              >
                ページ再読み込み
              </button>
              <button
                onClick={() => setShowResult(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

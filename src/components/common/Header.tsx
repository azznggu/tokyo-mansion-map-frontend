import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

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
          </nav>
        </div>
      </div>
    </header>
  );
};

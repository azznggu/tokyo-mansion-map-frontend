import { useState } from 'react';
import { useSearchStore } from '../../store';
import { TOKYO_WARDS, LAYOUT_TYPES } from '../../types';

interface SearchFilterProps {
  alwaysOpen?: boolean;
  bottomSheet?: boolean;
}

// 커스텀 셀렉트 컴포넌트 (모바일/데스크탑 반응형)
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  openUpward?: boolean; // 위쪽으로 펼쳐질지 여부
}

const CustomSelect = ({ value, onChange, options, placeholder, openUpward = false }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  // 모바일 여부 체크 (768px 기준)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ position: 'relative' }}>
      {/* 선택 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: isMobile ? '10px 36px 10px 10px' : '12px 40px 12px 12px',
          fontSize: '16px',
          textAlign: 'left',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <span style={{ color: selectedOption ? '#111827' : '#9ca3af' }}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          style={{
            position: 'absolute',
            right: '12px',
            width: '20px',
            height: '20px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
          fill="none"
          stroke="#6b7280"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 드롭다운 옵션 목록 */}
      {isOpen && (
        <>
          {/* 오버레이 */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isMobile ? 'rgba(0,0,0,0.3)' : 'transparent',
              zIndex: 2000,
            }}
            onClick={() => setIsOpen(false)}
          />
          {/* 옵션 리스트 */}
          <div
            style={isMobile ? {
              // 모바일: 화면 하단에 액션시트 형태로 표시
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 2001,
              maxHeight: '50vh',
              overflowY: 'auto',
              paddingBottom: 'env(safe-area-inset-bottom, 20px)',
            } : {
              // 데스크탑: 위쪽 또는 아래쪽으로 펼쳐짐
              position: 'absolute',
              ...(openUpward ? {
                bottom: '100%',
                marginBottom: '4px',
              } : {
                top: '100%',
                marginTop: '4px',
              }),
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              zIndex: 2001,
              maxHeight: openUpward ? '300px' : '250px',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {/* 핸들 바 - 모바일에서만 표시 */}
            {isMobile && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f3f4f6',
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
              }}>
                <div style={{ width: '40px', height: '4px', backgroundColor: '#d1d5db', borderRadius: '9999px' }} />
              </div>
            )}
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: isMobile ? '16px 20px' : '12px 16px',
                  fontSize: isMobile ? '17px' : '15px',
                  textAlign: 'left',
                  backgroundColor: value === option.value ? '#eff6ff' : 'white',
                  border: 'none',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  color: value === option.value ? '#2563eb' : '#374151',
                  fontWeight: value === option.value ? 600 : 400,
                }}
              >
                {value === option.value && (
                  <span style={{ marginRight: '8px' }}>✓</span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const SearchFilter = ({ alwaysOpen = false, bottomSheet = false }: SearchFilterProps) => {
  const { filter, setFilter, resetFilter, isFilterOpen, setFilterOpen } = useSearchStore();

  const showFilter = alwaysOpen || isFilterOpen;

  // 모바일 여부 체크 (768px 기준)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // 플로팅 버튼 (펼치기 전)
  if (!showFilter) {
    return (
      <button
        onClick={() => setFilterOpen(true)}
        className="bg-blue-600 shadow-lg rounded-full px-5 py-3 flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        style={{ cursor: 'pointer' }}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="text-base font-semibold text-white">絞り込み検索</span>
      </button>
    );
  }

  // 공통 스타일
  const inputStyle = {
    fontSize: '16px', // iOS 줌 방지
  };

  // 모바일용 컴팩트 스타일
  const sectionMarginBottom = isMobile ? '12px' : '20px';
  const labelMarginBottom = isMobile ? '6px' : '8px';
  const inputPadding = isMobile ? '10px' : '12px';
  const layoutButtonPadding = isMobile ? '10px 6px' : '12px 8px';
  const buttonAreaPaddingTop = isMobile ? '16px' : '24px';
  const buttonAreaMarginTop = isMobile ? '16px' : '24px';

  // 에리어 옵션
  const wardOptions = [
    { value: '', label: 'すべて' },
    ...TOKYO_WARDS.map(ward => ({ value: ward, label: ward })),
  ];

  // 역 도보 시간 옵션
  const walkMinutesOptions = [
    { value: '', label: '指定なし' },
    { value: '5', label: '5分以内' },
    { value: '10', label: '10分以内' },
    { value: '15', label: '15分以内' },
    { value: '20', label: '20分以内' },
  ];

  // 필터 내용 컴포넌트
  const FilterContent = () => (
    <>
      {/* 가격 범위 */}
      <div style={{ marginBottom: sectionMarginBottom }}>
        <label style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: '#374151', marginBottom: labelMarginBottom }}>
          価格（万円）
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            placeholder="下限"
            value={filter.priceMin || ''}
            onChange={(e) => setFilter({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              ...inputStyle,
              width: '100%',
              padding: inputPadding,
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
            }}
          />
          <span style={{ color: '#9ca3af', fontWeight: 500, fontSize: '18px' }}>~</span>
          <input
            type="number"
            placeholder="上限"
            value={filter.priceMax || ''}
            onChange={(e) => setFilter({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              ...inputStyle,
              width: '100%',
              padding: inputPadding,
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 면적 범위 */}
      <div style={{ marginBottom: sectionMarginBottom }}>
        <label style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: '#374151', marginBottom: labelMarginBottom }}>
          専有面積（m²）
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            placeholder="下限"
            value={filter.areaMin || ''}
            onChange={(e) => setFilter({ areaMin: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              ...inputStyle,
              width: '100%',
              padding: inputPadding,
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
            }}
          />
          <span style={{ color: '#9ca3af', fontWeight: 500, fontSize: '18px' }}>~</span>
          <input
            type="number"
            placeholder="上限"
            value={filter.areaMax || ''}
            onChange={(e) => setFilter({ areaMax: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              ...inputStyle,
              width: '100%',
              padding: inputPadding,
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 구 선택 - 커스텀 셀렉트 */}
      <div style={{ marginBottom: sectionMarginBottom }}>
        <label style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: '#374151', marginBottom: labelMarginBottom }}>
          エリア
        </label>
        <CustomSelect
          value={filter.ward || ''}
          onChange={(value) => setFilter({ ward: value || undefined })}
          options={wardOptions}
          placeholder="すべて"
        />
      </div>

      {/* 방 타입 */}
      <div style={{ marginBottom: sectionMarginBottom }}>
        <label style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: '#374151', marginBottom: labelMarginBottom }}>
          間取り
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? '6px' : '8px' }}>
          {LAYOUT_TYPES.map((type) => (
            <label
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: layoutButtonPadding,
                fontSize: isMobile ? '14px' : '16px',
                cursor: 'pointer',
                borderRadius: '8px',
                border: filter.layoutTypes?.includes(type) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                backgroundColor: filter.layoutTypes?.includes(type) ? '#eff6ff' : 'white',
                color: filter.layoutTypes?.includes(type) ? '#1d4ed8' : '#4b5563',
                fontWeight: filter.layoutTypes?.includes(type) ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              <input
                type="checkbox"
                checked={filter.layoutTypes?.includes(type) || false}
                onChange={(e) => {
                  const current = filter.layoutTypes || [];
                  if (e.target.checked) {
                    setFilter({ layoutTypes: [...current, type] });
                  } else {
                    setFilter({ layoutTypes: current.filter((t) => t !== type) });
                  }
                }}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 역 도보 시간 - 커스텀 셀렉트 */}
      <div style={{ marginBottom: sectionMarginBottom }}>
        <label style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: '#374151', marginBottom: labelMarginBottom }}>
          駅徒歩（分）
        </label>
        <CustomSelect
          value={filter.walkMinutesMax?.toString() || ''}
          onChange={(value) => setFilter({ walkMinutesMax: value ? Number(value) : undefined })}
          options={walkMinutesOptions}
          placeholder="指定なし"
          openUpward={true}
        />
      </div>

      {/* 버튼 */}
      <div style={{
        display: 'flex',
        gap: isMobile ? '8px' : '12px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: buttonAreaPaddingTop,
        marginTop: buttonAreaMarginTop
      }}>
        <button
          onClick={resetFilter}
          style={{
            flex: 1,
            padding: isMobile ? '10px 12px' : '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#374151',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          リセット
        </button>
        <button
          onClick={() => setFilterOpen(false)}
          style={{
            flex: 1,
            padding: isMobile ? '10px 12px' : '12px 16px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            color: 'white',
            backgroundColor: '#2563eb',
            cursor: 'pointer',
          }}
        >
          検索する
        </button>
      </div>
    </>
  );

  // 바텀시트 모드 (모바일)
  if (bottomSheet) {
    return (
      <>
        {/* 오버레이 */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 599,
          }}
          onClick={() => setFilterOpen(false)}
        />
        {/* 바텀시트 */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            zIndex: 600,
            maxHeight: '85vh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease-out',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {/* 핸들 바 */}
          <div style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            paddingTop: isMobile ? '10px' : '12px',
            paddingBottom: isMobile ? '6px' : '8px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '6px' : '8px' }}>
              <div style={{ width: '48px', height: '6px', backgroundColor: '#d1d5db', borderRadius: '9999px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '0 16px' : '0 20px' }}>
              <h3 style={{ fontWeight: 700, color: '#111827', fontSize: isMobile ? '16px' : '18px' }}>検索条件</h3>
              <button
                onClick={() => setFilterOpen(false)}
                style={{
                  padding: '8px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div style={{ padding: isMobile ? '16px' : '20px' }}>
            <FilterContent />
          </div>
        </div>
        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </>
    );
  }

  // 기본 모드 (데스크탑 사이드바 또는 지도 오버레이)
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto',
        ...(alwaysOpen ? { width: '100%' } : {
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          position: 'fixed' as const,
          top: '130px',
          right: '16px',
          zIndex: 650,
          width: '320px',
          border: '1px solid #e5e7eb',
        }),
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '18px' }}>検索条件</h3>
        {!alwaysOpen && (
          <button
            onClick={() => setFilterOpen(false)}
            style={{
              padding: '4px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <FilterContent />
    </div>
  );
};

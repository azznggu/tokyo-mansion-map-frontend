// 가격 포맷팅 (만엔 단위)
export const formatPrice = (price: number, unit: '万円' | '億円' = '万円'): string => {
  if (unit === '億円') {
    return `${price.toLocaleString('ja-JP')}億円`;
  }

  if (price >= 10000) {
    const oku = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) {
      return `${oku}億円`;
    }
    return `${oku}億${man.toLocaleString('ja-JP')}万円`;
  }

  return `${price.toLocaleString('ja-JP')}万円`;
};

// 가격 범위 포맷팅
export const formatPriceRange = (
  min: number,
  max: number,
  unit: '万円' | '億円' = '万円'
): string => {
  if (min === max) {
    return formatPrice(min, unit);
  }
  return `${formatPrice(min, unit)} ~ ${formatPrice(max, unit)}`;
};

// 면적 포맷팅
export const formatArea = (area: number): string => {
  return `${area.toFixed(2)}m²`;
};

// 면적 범위 포맷팅
export const formatAreaRange = (min: number, max: number): string => {
  if (min === max) {
    return formatArea(min);
  }
  return `${formatArea(min)} ~ ${formatArea(max)}`;
};

// 역세권 포맷팅
export const formatStationAccess = (
  lineName: string,
  stationName: string,
  walkMinutes: number
): string => {
  return `${lineName} ${stationName}駅 徒歩${walkMinutes}分`;
};

// 완공 예정일 포맷팅
export const formatCompletion = (completion: string): string => {
  return `${completion}完成予定`;
};

// 세대수 포맷팅
export const formatTotalUnits = (units: number): string => {
  return `総戸数${units}戸`;
};

import type { Mansion } from '../../types';
import { formatPriceRange } from '../../utils';

interface MansionPopupProps {
  mansion: Mansion;
  count?: number;
}

export const MansionPopup = ({ mansion, count = 1 }: MansionPopupProps) => {
  return (
    <div className="min-w-[200px]">
      {count > 1 && (
        <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mb-2">
          この場所に {count}件 の物件があります
        </div>
      )}
      <h4 className="font-bold text-sm mb-1">{mansion.nameJa}</h4>
      <p className="text-primary-600 font-bold text-sm mb-1">
        {formatPriceRange(mansion.priceMin, mansion.priceMax, mansion.priceUnit)}
      </p>
      <p className="text-xs text-gray-500">
        {mansion.layoutTypes.join('・')}
      </p>
      <p className="text-xs text-gray-500">
        {mansion.completion}完成予定
      </p>
      {count > 1 && (
        <p className="text-xs text-blue-600 mt-2">
          クリックで全 {count}件 を表示
        </p>
      )}
    </div>
  );
};

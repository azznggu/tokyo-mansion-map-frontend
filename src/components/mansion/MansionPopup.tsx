import type { Mansion } from '../../types';
import { formatPriceRange } from '../../utils';

interface MansionPopupProps {
  mansion: Mansion;
}

export const MansionPopup = ({ mansion }: MansionPopupProps) => {
  return (
    <div className="min-w-[200px]">
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
    </div>
  );
};

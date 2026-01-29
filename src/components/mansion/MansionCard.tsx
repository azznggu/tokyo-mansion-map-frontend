import type { Mansion } from '../../types';
import { formatPriceRange, formatAreaRange, formatStationAccess } from '../../utils';

interface MansionCardProps {
  mansion: Mansion;
  onClick?: () => void;
  isSelected?: boolean;
}

export const MansionCard = ({ mansion, onClick, isSelected }: MansionCardProps) => {
  const mainStation = mansion.stations[0];

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md
        ${isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}
      `}
    >
      {/* 썸네일 */}
      <div className="relative h-40 overflow-hidden rounded-t-lg">
        <img
          src={mansion.thumbnailUrl || '/placeholder-mansion.jpg'}
          alt={mansion.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            新築
          </span>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{mansion.nameJa}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{mansion.addressJa}</p>

        {/* 가격 */}
        <p className="text-lg font-bold text-primary-600 mb-2">
          {formatPriceRange(mansion.priceMin, mansion.priceMax, mansion.priceUnit)}
        </p>

        {/* 상세 정보 */}
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="inline-block w-16 text-gray-400">間取り</span>
            {mansion.layoutTypes.join('・')}
          </p>
          <p>
            <span className="inline-block w-16 text-gray-400">専有面積</span>
            {formatAreaRange(mansion.areaMin, mansion.areaMax)}
          </p>
          {mainStation && (
            <p>
              <span className="inline-block w-16 text-gray-400">交通</span>
              {formatStationAccess(mainStation.lineName, mainStation.stationName, mainStation.walkMinutes)}
            </p>
          )}
          <p>
            <span className="inline-block w-16 text-gray-400">完成</span>
            {mansion.completion}
          </p>
        </div>
      </div>
    </div>
  );
};

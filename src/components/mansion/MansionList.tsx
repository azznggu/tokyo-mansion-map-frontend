import { MansionCard } from './MansionCard';
import { Loading } from '../common';
import type { Mansion } from '../../types';

interface MansionListProps {
  mansions: Mansion[];
  isLoading: boolean;
  selectedId?: string | null;
  onSelect?: (mansion: Mansion) => void;
}

export const MansionList = ({ mansions, isLoading, selectedId, onSelect }: MansionListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading text="物件を読み込み中..." />
      </div>
    );
  }

  if (mansions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg
          className="w-12 h-12 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p className="text-sm">条件に合う物件が見つかりませんでした</p>
        <p className="text-xs mt-1">検索条件を変更してお試しください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mansions.map((mansion) => (
        <MansionCard
          key={mansion.id}
          mansion={mansion}
          isSelected={selectedId === mansion.id}
          onClick={() => onSelect?.(mansion)}
        />
      ))}
    </div>
  );
};

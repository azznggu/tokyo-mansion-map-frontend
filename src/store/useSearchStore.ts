import { create } from 'zustand';
import type { SearchFilter, MapBounds } from '../types';

interface SearchState {
  filter: SearchFilter;
  mapBounds: MapBounds | null;
  isFilterOpen: boolean;
  selectedMansionId: string | null;

  // Actions
  setFilter: (filter: Partial<SearchFilter>) => void;
  resetFilter: () => void;
  setMapBounds: (bounds: MapBounds) => void;
  setFilterOpen: (open: boolean) => void;
  setSelectedMansion: (id: string | null) => void;
}

const initialFilter: SearchFilter = {
  priceMin: undefined,
  priceMax: undefined,
  areaMin: undefined,
  areaMax: undefined,
  layoutTypes: [],
  stations: [],
  walkMinutesMax: undefined,
  ward: undefined,
  completionYear: undefined,
};

export const useSearchStore = create<SearchState>((set) => ({
  filter: initialFilter,
  mapBounds: null,
  isFilterOpen: false,
  selectedMansionId: null,

  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),

  resetFilter: () =>
    set({
      filter: initialFilter,
    }),

  setMapBounds: (bounds) =>
    set({
      mapBounds: bounds,
    }),

  setFilterOpen: (open) =>
    set({
      isFilterOpen: open,
    }),

  setSelectedMansion: (id) =>
    set({
      selectedMansionId: id,
    }),
}));

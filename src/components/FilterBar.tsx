import React from 'react';
import { Filter, Grid, Map } from 'lucide-react';
import { allGenres } from '../data/clubs';

interface FilterBarProps {
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedGenres,
  onGenreToggle,
  viewMode,
  onViewModeChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-200">Filter by Genre</h3>
            {selectedGenres.length > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-400 hover:text-neon-purple transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => onGenreToggle(genre)}
                className={`filter-button ${
                  selectedGenres.includes(genre) ? 'active' : ''
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-neon-purple text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => onViewModeChange('map')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
              viewMode === 'map'
                ? 'bg-neon-purple text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {selectedGenres.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="text-sm text-gray-400 mb-2">
            Active filters ({selectedGenres.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full flex items-center gap-1"
              >
                {genre}
                <button
                  onClick={() => onGenreToggle(genre)}
                  className="hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
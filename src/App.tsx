import React, { useState, useMemo } from 'react';
import { clubs, Club, allGenres } from './data/clubs';
import { ClubCard } from './components/ClubCard';
import { EventModal } from './components/EventModal';
import { FilterBar } from './components/FilterBar';
import { MapView } from './components/MapView';
import { Calendar, TrendingUp, Star } from 'lucide-react';

function App() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter clubs based on selected genres
  const filteredClubs = useMemo(() => {
    if (selectedGenres.length === 0) return clubs;
    return clubs.filter(club => 
      club.genres.some(genre => selectedGenres.includes(genre))
    );
  }, [selectedGenres]);

  // Get trending events (events happening soon with good prices)
  const trendingEvents = useMemo(() => {
    const allEvents = clubs.flatMap(club => 
      club.events.map(event => ({ ...event, clubName: club.name, clubLogo: club.logo }))
    );
    
    return allEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3; // Events in next 3 days
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6);
  }, []);

  const handleClubClick = (club: Club) => {
    setSelectedClub(club);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClub(null);
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
  };

  return (
    <div className="min-h-screen bg-dark-gray">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-purple to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-club mb-4">
              <span className="neon-text animate-glow">ROSTOCK</span>
              <br />
              <span className="text-white">NIGHTLIFE</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Discover the best clubs and events in Rostock. Find your perfect night out with our comprehensive event calendar and club guide.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 mt-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="text-neon-purple">🏢</div>
                <span className="text-gray-300">{clubs.length} Clubs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-neon-blue" />
                <span className="text-gray-300">
                  {clubs.reduce((sum, club) => sum + club.events.length, 0)} Events
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-neon-pink" />
                <span className="text-gray-300">{allGenres.length} Genres</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Events Section */}
        {trendingEvents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-neon-pink" />
              <h2 className="text-2xl font-bold text-gray-200">Trending This Week</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{event.clubLogo}</span>
                      <span className="text-sm text-gray-400">{event.clubName}</span>
                    </div>
                    <span className="text-neon-pink font-bold text-sm">{event.price}</span>
                  </div>
                  <h4 className="font-semibold text-gray-200 mb-1">{event.name}</h4>
                  <div className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString('de-DE', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit'
                    })} • {event.time} • {event.genre}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filter Bar */}
        <FilterBar
          selectedGenres={selectedGenres}
          onGenreToggle={handleGenreToggle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClearFilters={handleClearFilters}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            {filteredClubs.length === clubs.length 
              ? `All Clubs (${clubs.length})`
              : `Filtered Results (${filteredClubs.length} of ${clubs.length})`
            }
          </h2>
          {selectedGenres.length > 0 && (
            <p className="text-gray-400 text-sm">
              Showing clubs with genres: {selectedGenres.join(', ')}
            </p>
          )}
        </div>

        {/* Main Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onClick={() => handleClubClick(club)}
              />
            ))}
          </div>
        ) : (
          <MapView
            clubs={filteredClubs}
            onClubSelect={handleClubClick}
          />
        )}

        {/* No Results */}
        {filteredClubs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No clubs found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or browse all clubs
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Rostock Nightlife. Discover the best clubs and events in the city.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Event information is updated regularly. Please check with venues for the latest details.
            </p>
          </div>
        </div>
      </footer>

      {/* Event Modal */}
      <EventModal
        club={selectedClub}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
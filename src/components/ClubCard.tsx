import React from 'react';
import { Club } from '../data/clubs';
import { MapPin, Users, ExternalLink, Phone } from 'lucide-react';

interface ClubCardProps {
  club: Club;
  onClick: () => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onClick }) => {
  const upcomingEvents = club.events.slice(0, 3);
  
  return (
    <div className="club-card cursor-pointer group" onClick={onClick}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{club.logo}</div>
          <div>
            <h3 className="text-xl font-bold neon-text font-club">{club.name}</h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{club.address.split(',')[0]}</span>
            </div>
          </div>
        </div>
        
        {/* Capacity */}
        {club.capacity && (
          <div className="flex items-center text-gray-400 text-sm">
            <Users className="w-4 h-4 mr-1" />
            <span>{club.capacity}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{club.description}</p>

      {/* Genres */}
      <div className="flex flex-wrap gap-2 mb-4">
        {club.genres.map((genre) => (
          <span
            key={genre}
            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Upcoming Events Preview */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-200 mb-2">Upcoming Events</h4>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex justify-between items-center text-sm">
                <div>
                  <div className="text-gray-300 font-medium">{event.name}</div>
                  <div className="text-gray-400 text-xs">
                    {new Date(event.date).toLocaleDateString('de-DE', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit'
                    })} • {event.time}
                  </div>
                </div>
                <div className="text-neon-purple font-medium">{event.price}</div>
              </div>
            ))}
            {club.events.length > 3 && (
              <div className="text-xs text-gray-400 pt-1">
                +{club.events.length - 3} more events
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No upcoming events</div>
        )}
      </div>

      {/* Contact Links */}
      {(club.website || club.phone) && (
        <div className="flex space-x-3 mt-4 pt-3 border-t border-gray-700">
          {club.website && (
            <a
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-400 hover:text-neon-blue text-xs transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Website
            </a>
          )}
          {club.phone && (
            <a
              href={`tel:${club.phone}`}
              className="flex items-center text-gray-400 hover:text-neon-blue text-xs transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </a>
          )}
        </div>
      )}

      {/* Hover Effect Indicator */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </div>
  );
};
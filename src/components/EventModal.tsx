import React from 'react';
import { Club, Event } from '../data/clubs';
import { X, Calendar, Clock, Euro, User, Shirt, Music } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { de } from 'date-fns/locale';

interface EventModalProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ club, isOpen, onClose }) => {
  if (!isOpen || !club) return null;

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Heute';
    if (isTomorrow(date)) return 'Morgen';
    return format(date, 'EEEE, dd.MM.yyyy', { locale: de });
  };

  const groupedEvents = club.events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{club.logo}</div>
              <div>
                <h2 className="text-2xl font-bold neon-text font-club">{club.name}</h2>
                <p className="text-gray-300 mt-1">{club.description}</p>
                <div className="flex items-center text-gray-400 text-sm mt-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{club.address}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mt-4">
            {club.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Events Schedule */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <h3 className="text-xl font-semibold mb-6 text-gray-200">
            2-Wochen Veranstaltungskalender
          </h3>

          {sortedDates.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date} className="border-l-4 border-neon-purple pl-4">
                  <h4 className="text-lg font-semibold text-gray-200 mb-3 capitalize">
                    {formatDate(date)}
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupedEvents[date].map((event) => (
                      <div key={event.id} className="event-card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-200 mb-1">
                              {event.name}
                            </h5>
                            <div className="flex items-center text-sm text-gray-400 space-x-3">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {event.time}
                              </div>
                              <div className="flex items-center">
                                <Euro className="w-4 h-4 mr-1" />
                                {event.price}
                              </div>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full">
                            {event.genre}
                          </span>
                        </div>

                        {event.description && (
                          <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {event.dj && (
                            <div className="flex items-center text-gray-400">
                              <Music className="w-3 h-3 mr-1" />
                              <span>DJ: {event.dj}</span>
                            </div>
                          )}
                          {event.ageLimit && (
                            <div className="flex items-center text-gray-400">
                              <User className="w-3 h-3 mr-1" />
                              <span>{event.ageLimit}</span>
                            </div>
                          )}
                          {event.dressCode && (
                            <div className="flex items-center text-gray-400 col-span-2">
                              <Shirt className="w-3 h-3 mr-1" />
                              <span>Dress Code: {event.dressCode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-400 mb-2">
                Keine Veranstaltungen geplant
              </h4>
              <p className="text-gray-500">
                In den nächsten 2 Wochen sind keine Events für diesen Club geplant.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {club.events.length} Veranstaltungen in den nächsten 2 Wochen
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
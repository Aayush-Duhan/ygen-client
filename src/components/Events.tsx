import React, { useState, useEffect } from 'react';
import { fetchEvents, fetchWinners } from '../api/eventsApi';
import type { EventType } from '../types/event';

interface ApiError {
  message: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface EventSectionProps {
  category?: string;
  title: string;
  subtitle: string;
}

interface Winners {
  first: string;
  second: string;
  third: string;
}

// Helper function to parse date and time string
const parseDateTime = (event: EventType): Date => {
  try {
    // Parse the ISO date first
    const eventDate = new Date(event.startDate);
    
    // Get hours and minutes from the time string
    const timeStr = event.time.split('-')[0].trim(); // "3:00 PM"
    const [time, period] = timeStr.split(' '); // ["3:00", "PM"]
    const [hours, minutes] = time.split(':').map(Number); // [3, 0]
    
    // Convert to 24-hour format if PM
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
    
    // Set the time on the date object
    eventDate.setHours(adjustedHours, minutes, 0, 0);
    
    return eventDate;
  } catch (err) {
    console.error('Error parsing date:', err);
    return new Date();
  }
};

// Helper function to format date range
const formatDateRange = (event: EventType) => {
  try {
    const startDate = new Date(event.startDate);
    const startDateStr = startDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (event.endDate) {
      const endDate = new Date(event.endDate);
      const endDateStr = endDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return `${startDateStr} - ${endDateStr}`;
    }
    return startDateStr;
  } catch (err) {
    console.error('Error formatting date:', err);
    return new Date(event.startDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

// Helper function to format time range
const formatTimeRange = (timeStr: string) => {
  const times = timeStr.split('-').map(t => t.trim());
  if (times.length > 1) {
    return `${times[0]} - ${times[1]}`;
  }
  return timeStr;
};

const EventSection: React.FC<EventSectionProps> = ({ category, title, subtitle }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'online' | 'offline'>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState<boolean>(false);
  const [selectedCompletedEvent, setSelectedCompletedEvent] = useState<EventType | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [completedEvents, setCompletedEvents] = useState<EventType[]>([]);
  const [winners, setWinners] = useState<Winners | null>(null);
  const [loadingWinners, setLoadingWinners] = useState<boolean>(false);
  
  // Fetch events from API
  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both upcoming and completed events
        const [upcomingData, completedData] = await Promise.all([
          fetchEvents(category, activeCategory !== 'all' ? activeCategory : undefined, 'upcoming'),
          fetchEvents(category, activeCategory !== 'all' ? activeCategory : undefined, 'completed')
        ]);
        
        setEvents(upcomingData);
        setCompletedEvents(completedData);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError({ message: 'Failed to load events. Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [category, activeCategory]);

  // Only display upcoming events from API data

  const openModal = (event: EventType) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (selectedEvent) {
      const eventDateTime = parseDateTime(selectedEvent);
      
      const calculateTimeLeft = () => {
        const now = new Date();
        const distance = eventDateTime.getTime() - now.getTime();

        if (distance < 0) {
          setTimeLeft(null);
          return null;
        }

        const timeLeft = {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };

        return timeLeft;
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        if (!newTimeLeft) {
          clearInterval(timer);
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [selectedEvent]);

  const openWinnersModal = async (event: EventType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCompletedEvent(event);
    setIsWinnersModalOpen(true);
    document.body.style.overflow = 'hidden';
    setLoadingWinners(true);
    setWinners(null);
    setError(null);

    try {
      const winnersData = await fetchWinners(event._id);
      setWinners(winnersData);
    } catch (err) {
      console.error('Error fetching winners:', err);
      setError({ message: 'Failed to load winners. Please try again later.' });
    } finally {
      setLoadingWinners(false);
    }
  };

  const closeWinnersModal = () => {
    setIsWinnersModalOpen(false);
    document.body.style.overflow = 'unset';
    setSelectedCompletedEvent(null);
    setWinners(null);
  };

  return (
    <section id={category} className="bg-black text-white py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-transparent opacity-70"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-900/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-900/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-2 text-center">{title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">{category === 'event' ? 'Events' : category === 'workshop' ? 'Workshops' : 'Hackathons'}</span></h2>
        <p className="text-xl text-gray-400 mb-16 text-center max-w-3xl mx-auto">{subtitle}</p>
        
        <div className="flex mb-10 justify-center gap-4 flex-wrap">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none transform hover:scale-105 ${activeCategory === 'all' ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/20' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            All {category === 'event' ? 'Events' : category === 'workshop' ? 'Workshops' : 'Hackathons'}
          </button>
          <button 
            onClick={() => setActiveCategory('offline')}
            className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none transform hover:scale-105 ${activeCategory === 'offline' ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/20' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Offline {category === 'event' ? 'Events' : category === 'workshop' ? 'Workshops' : 'Hackathons'}
          </button>
          <button 
            onClick={() => setActiveCategory('online')}
            className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:outline-none transform hover:scale-105 ${activeCategory === 'online' ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/20' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            Online {category === 'event' ? 'Events' : category === 'workshop' ? 'Workshops' : 'Hackathons'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-gray-400">Loading events...</p>
            </div>
          ) : error ? (
            <div className="col-span-2 text-center py-10">
              <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-400">{error.message}</h3>
              <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <div 
                key={`${event._id}-${event.name}`}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group flex flex-col"
                onClick={() => openModal(event)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold group-hover:text-red-400 transition-colors duration-300">{event.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.type === 'online' ? 'bg-red-900 text-red-300' : 'bg-red-900 text-red-300'}`}>
                        {event.type === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">{event.description}</p>
                  </div>
                  <div className="flex flex-col space-y-2 text-sm text-gray-400">
                    <div key={`date-${event._id}`} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>{formatDateRange(event)}</span>
                    </div>
                    <div key={`time-${event._id}`} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div key={`location-${event._id}`} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-400">No {activeCategory !== 'all' ? activeCategory : ''} {category} found</h3>
              <p className="text-gray-500 mt-2">Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Events Section */}
      {completedEvents.length > 0 && (
        <div className="container mx-auto relative z-10 mt-20">
          <h2 className="text-4xl font-bold mb-2 text-center">Completed <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">{category === 'event' ? 'Events' : category === 'workshop' ? 'Workshops' : 'Hackathons'}</span></h2>
          <p className="text-xl text-gray-400 mb-16 text-center max-w-3xl mx-auto">Past {category === 'event' ? 'events' : category === 'workshop' ? 'workshops' : 'hackathons'} that have already taken place</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {completedEvents.map((event) => (
              <div 
                key={`${event._id}-${event.name}`}
                className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden relative opacity-75">
                  <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-500 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-400">{event.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400`}>
                      {event.type === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-gray-500 mb-4">{event.description}</p>
                  <div className="flex flex-col space-y-2 text-sm text-gray-500">
                    <div key={`date-${event._id}`} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>{formatDateRange(event)}</span>
                    </div>
                    <div key={`time-${event._id}`} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{formatTimeRange(event.time)}</span>
                    </div>
                    <div key={`location-${event._id}`} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  {(category === 'hackathon' || category === 'event') && (
                    <button 
                      onClick={(e) => openWinnersModal(event, e)}
                      className="mt-6 w-full py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                      </svg>
                      View Winners
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winners Modal */}
      {isWinnersModalOpen && selectedCompletedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border-2 border-red-500 p-6 max-w-lg w-full relative transform transition-all">
            <button
              onClick={closeWinnersModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold mb-6 pr-8">
              Winners of {selectedCompletedEvent.name}
            </h3>

            {loadingWinners ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="mt-2 text-gray-400">Loading winners...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400">{error.message}</p>
              </div>
            ) : winners ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-gradient-to-r from-yellow-500/10 to-transparent p-4 rounded-lg">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm text-yellow-500">First Place</div>
                    <div className="font-bold">{winners.first}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-400/10 to-transparent p-4 rounded-lg">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-400">Second Place</div>
                    <div className="font-bold">{winners.second}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gradient-to-r from-yellow-700/10 to-transparent p-4 rounded-lg">
                  <svg className="w-8 h-8 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm text-yellow-700">Third Place</div>
                    <div className="font-bold">{winners.third}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No winners have been announced yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Existing Event Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-white focus:outline-none"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img src={selectedEvent.image} alt={selectedEvent.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-1/2">
                  <h3 className="text-2xl font-bold text-white mb-4">{selectedEvent.name}</h3>
                  <p className="text-gray-400 mb-6">{selectedEvent.description}</p>
                  {timeLeft && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-800 rounded-lg">
                        <span className="block text-2xl font-bold text-red-500">{timeLeft.days}</span>
                        <span className="text-sm text-gray-400">Days</span>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-lg">
                        <span className="block text-2xl font-bold text-red-500">{timeLeft.hours}</span>
                        <span className="text-sm text-gray-400">Hours</span>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-lg">
                        <span className="block text-2xl font-bold text-red-500">{timeLeft.minutes}</span>
                        <span className="text-sm text-gray-400">Minutes</span>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-lg">
                        <span className="block text-2xl font-bold text-red-500">{timeLeft.seconds}</span>
                        <span className="text-sm text-gray-400">Seconds</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDateRange(selectedEvent)}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatTimeRange(selectedEvent.time)}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://vitchennaievents.com/conf1/', '_blank')} 
                    className="mt-6 w-full py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventSection;
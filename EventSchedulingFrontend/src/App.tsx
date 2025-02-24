import React, { useState, useEffect, useRef } from 'react';
import FullCalendar, { CalendarApi } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar } from 'lucide-react';
import EventModal from './components/EventModal';
import { fetchEvents, createEvent } from './api';
import type { Event, EventFormData } from './types';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [conflictError, setConflictError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reference for FullCalendar API
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const start = selectInfo.start;
    const localDateTime = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(start.getHours())}:${pad(start.getMinutes())}`;
    setSelectedStartTime(localDateTime);
    setIsModalOpen(true);
    setConflictError('');
  };

  const checkForConflicts = (newEvent: EventFormData): boolean => {
    if (!Array.isArray(events) || events.length === 0) {
      return false;
    }

    const newStart = new Date(newEvent.start);
    const newEnd = new Date(newStart.getTime() + Number(newEvent.duration) * 60000);

    return events.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      );
    });
  };

  const handleEventSubmit = async (data: EventFormData) => {
    if (checkForConflicts(data)) {
      setConflictError('This time slot conflicts with an existing event');
      return;
    }

    setIsLoading(true);
    try {
      const newEvent = await createEvent(data);
      if (newEvent) {
        // Update the events state to keep our local state in sync
        setEvents(prevEvents => [...prevEvents, newEvent]);
        setIsModalOpen(false);
        setConflictError('');

        await loadEvents();

        // Use FullCalendar API to add the event immediately to the calendar
        // const calendarApi: CalendarApi | null = calendarRef.current?.getApi() || null;
        // if (calendarApi) {
        //   console.log("in here")
        //   calendarApi.addEvent({
        //     id: newEvent.id,
        //     title: newEvent.title,
        //     start: newEvent.start,
        //     end: newEvent.end,
        //     allDay: false
        //   });
        // }
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      setConflictError('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Event Scheduler</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            eventDidMount={(arg) => {
              arg.el.setAttribute('data-event-id', arg.event.id);
            }}
            select={handleDateSelect}
            height="700px"
            allDaySlot={false}
            scrollTime="00:00:00"
            eventContent={(eventInfo) => (
              <div className="fc-event-main-frame">
                <div className="fc-event-title-container">
                  <div className="fc-event-title">{eventInfo.event.title}</div>
                </div>
              </div>
            )}
          />
        </div>
      </main>

      <EventModal
        key={selectedStartTime}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEventSubmit}
        initialStartTime={selectedStartTime}
        conflictError={conflictError}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;

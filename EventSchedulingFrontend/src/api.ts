import axios from 'axios';
import { Event, EventFormData } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to sanitize event data
const sanitizeEvent = (event: any): Event => ({
  id: String(event.id || ''),
  title: String(event.name || ''),
  start: String(event.start_time || ''),
  end: String(event.end_time || ''),
  isRecurring: Boolean(event.is_recurring),
  recurringDays: Array.isArray(event.days_of_week) ? event.days_of_week.map(String) : []
});

export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events`);
    if (!Array.isArray(response.data)) {
      console.error('Invalid response format for events');
      return [];
    }
    return response.data.map(sanitizeEvent);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const createEvent = async (eventData: EventFormData): Promise<Event | null> => {
  try {
    const startDate = new Date(eventData.start);
    const endDate = new Date(startDate.getTime() + Number(eventData.duration) * 60000);
    
    // Convert to local ISO string without UTC conversion
    const toLocalISO = (date: Date) => {
      const offset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offset).toISOString().slice(0, -1);
    };

    const apiEventData = {
      title: String(eventData.title).trim(),
      start: toLocalISO(startDate),
      end: toLocalISO(endDate),
      isRecurring: Boolean(eventData.isRecurring),
      recurringDays: eventData.isRecurring ? eventData.recurringDays.map(String) : []
    };

    const response = await axios.post(`${API_BASE_URL}/events`, apiEventData);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    return sanitizeEvent(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create event');
  }
};
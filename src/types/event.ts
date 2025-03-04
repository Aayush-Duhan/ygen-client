export interface WinnerType {
  teamName: string;
  members: string[];
  prize?: string;
}

export interface EventType {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  time: string;
  location: string;
  image: string;
  type: 'online' | 'offline';
  category: 'event' | 'workshop' | 'hackathon';
  winners?: {
    first: string;
    second: string;
    third: string;
  };
} 
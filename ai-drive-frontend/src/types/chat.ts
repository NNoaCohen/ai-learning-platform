export interface LiveChatMessage {
  id: string;
  type: 'user' | 'ai' | 'loading';
  content: string;
  timestamp: Date;
}
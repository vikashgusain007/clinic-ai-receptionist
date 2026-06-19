export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ChatRequest {
  message: string
  user_id: string
}

export interface ChatResponse {
  message: string
}

export interface HealthRecord {
  id: string
  title: string
  date: string
  type: string
  summary: string
}

export interface StoredMemory {
  id: string
  content: string
  category: string
  updatedAt: string
}

export interface HealthTimelineEvent {
  id: string
  title: string
  date: string
  description: string
  status: 'completed' | 'upcoming' | 'review'
}

export interface HealthInsightsData {
  recentRecords: HealthRecord[]
  storedMemories: StoredMemory[]
  timeline: HealthTimelineEvent[]
}

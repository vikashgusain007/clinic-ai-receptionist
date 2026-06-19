export const USER_ID = '454a4079-0dad-4f97-8320-efcaabb15d10'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export const CHAT_ENDPOINT = `${API_BASE_URL}/api/v1/chat/chat`

export const ASSISTANT_NAME = 'Health AI Assistant'

export const SUGGESTION_PROMPTS = [
  {
    id: 'fever',
    label: 'I have a fever',
    icon: 'thermometer',
  },
  {
    id: 'symptoms',
    label: 'Analyze my symptoms',
    icon: 'stethoscope',
  },
  {
    id: 'history',
    label: 'Review my health history',
    icon: 'history',
  },
  {
    id: 'results',
    label: 'Help me understand my test results',
    icon: 'file-text',
  },
] as const

export const CONVERSATIONS_STORAGE_KEY = 'health-ai-conversations'
export const ACTIVE_CONVERSATION_KEY = 'health-ai-active-conversation'

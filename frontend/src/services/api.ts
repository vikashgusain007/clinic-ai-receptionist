import { CHAT_ENDPOINT } from '@/constants'
import type { ChatRequest, ChatResponse } from '@/types'

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function sendChatMessage(
  request: ChatRequest,
): Promise<ChatResponse> {
  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new ApiError('Unable to connect to Health AI. Please try again.')
  }

  const data: ChatResponse = await response.json()

  if (!data.message) {
    throw new ApiError('Unable to connect to Health AI. Please try again.')
  }

  return data
}

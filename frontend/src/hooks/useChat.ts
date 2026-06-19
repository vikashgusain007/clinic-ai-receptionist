import { useCallback, useEffect, useState } from 'react'
import {
  ACTIVE_CONVERSATION_KEY,
  CONVERSATIONS_STORAGE_KEY,
  USER_ID,
} from '@/constants'
import { generateId, truncateText } from '@/lib/utils'
import { ApiError, sendChatMessage } from '@/services/api'
import type { ChatMessage, Conversation } from '@/types'

function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as Conversation[]
  } catch {
    return []
  }
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(
    CONVERSATIONS_STORAGE_KEY,
    JSON.stringify(conversations),
  )
}

function createConversation(): Conversation {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: 'New conversation',
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}

function deriveTitle(message: string): string {
  return truncateText(message.replace(/\s+/g, ' ').trim(), 40)
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadConversations(),
  )
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(() => {
    const stored = localStorage.getItem(ACTIVE_CONVERSATION_KEY)
    if (stored) return stored
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null

  const messages = activeConversation?.messages ?? []

  useEffect(() => {
    if (conversations.length === 0) {
      const initial = createConversation()
      setConversations([initial])
      setActiveConversationId(initial.id)
      return
    }

    if (!activeConversationId) {
      setActiveConversationId(conversations[0].id)
      return
    }

    if (!conversations.some((c) => c.id === activeConversationId)) {
      setActiveConversationId(conversations[0].id)
    }
  }, [conversations, activeConversationId])

  useEffect(() => {
    saveConversations(conversations)
  }, [conversations])

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversationId)
    }
  }, [activeConversationId])

  const updateConversation = useCallback(
    (conversationId: string, updater: (conv: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? updater(conv) : conv,
        ),
      )
    },
    [],
  )

  const startNewChat = useCallback(() => {
    const conversation = createConversation()
    setConversations((prev) => [conversation, ...prev])
    setActiveConversationId(conversation.id)
    setError(null)
  }, [])

  const selectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId)
    setError(null)
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isLoading) return

      let conversationId = activeConversationId

      if (!conversationId) {
        const conversation = createConversation()
        setConversations((prev) => [conversation, ...prev])
        conversationId = conversation.id
        setActiveConversationId(conversationId)
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      }

      updateConversation(conversationId, (conv) => ({
        ...conv,
        title:
          conv.messages.length === 0 ? deriveTitle(trimmed) : conv.title,
        messages: [...conv.messages, userMessage],
        updatedAt: new Date().toISOString(),
      }))

      setIsLoading(true)
      setError(null)

      try {
        const response = await sendChatMessage({
          message: trimmed,
          user_id: USER_ID,
        })

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString(),
        }

        updateConversation(conversationId, (conv) => ({
          ...conv,
          messages: [...conv.messages, assistantMessage],
          updatedAt: new Date().toISOString(),
        }))
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Unable to connect to Health AI. Please try again.'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [activeConversationId, isLoading, updateConversation],
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    isLoading,
    error,
    sendMessage,
    startNewChat,
    selectConversation,
    clearError,
  }
}

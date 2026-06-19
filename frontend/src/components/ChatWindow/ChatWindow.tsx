import { useEffect, useRef } from 'react'
import { ChatHeader } from '@/components/ChatHeader/ChatHeader'
import { ChatInput } from '@/components/ChatInput/ChatInput'
import { MessageBubble } from '@/components/MessageBubble/MessageBubble'
import { ErrorBanner } from '@/components/Sidebar/Sidebar'
import { TypingIndicator } from '@/components/TypingIndicator/TypingIndicator'
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ChatMessage } from '@/types'

interface ChatWindowProps {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  onSend: (message: string) => void
  onDismissError: () => void
}

export function ChatWindow({
  messages,
  isLoading,
  error,
  onSend,
  onDismissError,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isEmpty = messages.length === 0 && !isLoading

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, error])

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <ChatHeader />

      <ScrollArea className="flex-1">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col py-4">
          {error && (
            <ErrorBanner message={error} onDismiss={onDismissError} />
          )}

          {isEmpty ? (
            <WelcomeScreen onSuggestionClick={onSend} isLoading={isLoading} />
          ) : (
            <div className="flex flex-col">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          )}

          <div ref={bottomRef} className="h-px shrink-0" />
        </div>
      </ScrollArea>

      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  )
}

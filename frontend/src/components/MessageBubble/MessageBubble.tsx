import { Check, Copy, User, Activity } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatMessageTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'group animate-fade-in-up flex gap-3 px-4 py-2',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-health-blue-light text-health-blue',
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Activity className="h-4 w-4" />
        )}
      </div>

      <div
        className={cn(
          'flex max-w-[min(75%,680px)] flex-col gap-1',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div className="relative">
          <div
            className={cn(
              'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-shadow hover:shadow-md',
              isUser
                ? 'rounded-tr-md bg-primary text-primary-foreground'
                : 'rounded-tl-md border border-border bg-card text-foreground',
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          {!isUser && (
            <div className="absolute -right-2 -top-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-card shadow-sm"
                    onClick={handleCopy}
                    aria-label="Copy message"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-health-green" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        <span className="px-1 text-[11px] text-muted-foreground">
          {formatMessageTime(new Date(message.timestamp))}
        </span>
      </div>
    </div>
  )
}

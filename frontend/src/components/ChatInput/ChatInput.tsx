import {
  FileText,
  History,
  Send,
  Stethoscope,
  Thermometer,
} from 'lucide-react'
import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  className?: string
}

export function ChatInput({ onSend, disabled, className }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus()
    }
  }, [disabled])

  const handleSubmit = () => {
    const value = textareaRef.current?.value ?? ''
    if (!value.trim() || disabled) return
    onSend(value)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }

  return (
    <div
      className={cn(
        'border-t border-border bg-card/80 px-4 py-4 backdrop-blur-sm',
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            placeholder="Describe your symptoms or ask a health question..."
            disabled={disabled}
            rows={1}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            className="max-h-40 min-h-[44px] w-full resize-none rounded-xl border border-input bg-background px-4 py-3 pr-4 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="mt-1.5 hidden text-[11px] text-muted-foreground sm:block">
            Press Enter to send · Shift + Enter for new line
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl shadow-sm"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export { Thermometer, Stethoscope, History, FileText }

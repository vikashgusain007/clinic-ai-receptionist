import { Activity } from 'lucide-react'
import { ASSISTANT_NAME } from '@/constants'

export function TypingIndicator() {
  return (
    <div className="animate-fade-in-up flex items-start gap-3 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-health-blue-light text-health-blue">
        <Activity className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
        <p className="text-sm text-muted-foreground">
          {ASSISTANT_NAME.split(' ')[0]} AI is thinking
          <span className="inline-flex w-6">
            <span className="animate-pulse-dot mx-0.5 inline-block h-1 w-1 rounded-full bg-muted-foreground" />
            <span className="animate-pulse-dot mx-0.5 inline-block h-1 w-1 rounded-full bg-muted-foreground" />
            <span className="animate-pulse-dot mx-0.5 inline-block h-1 w-1 rounded-full bg-muted-foreground" />
          </span>
        </p>
      </div>
    </div>
  )
}

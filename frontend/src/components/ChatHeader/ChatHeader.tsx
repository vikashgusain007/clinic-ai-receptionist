import { ASSISTANT_NAME } from '@/constants'
import { cn } from '@/lib/utils'

export function ChatHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        'flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-6',
        className,
      )}
    >
      <div>
        <h1 className="text-base font-semibold text-foreground sm:text-lg">
          {ASSISTANT_NAME}
        </h1>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-health-green opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-health-green" />
          </span>
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>
    </header>
  )
}

import {
  FileText,
  History,
  HeartPulse,
  Stethoscope,
  Thermometer,
} from 'lucide-react'
import { SUGGESTION_PROMPTS } from '@/constants'
import { cn } from '@/lib/utils'

const iconMap = {
  thermometer: Thermometer,
  stethoscope: Stethoscope,
  history: History,
  'file-text': FileText,
} as const

interface WelcomeScreenProps {
  onSuggestionClick: (message: string) => void
  isLoading?: boolean
}

export function WelcomeScreen({
  onSuggestionClick,
  isLoading,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="animate-fade-in-up mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-health-blue-light text-health-blue shadow-sm">
          <HeartPulse className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How can I help with your health today?
        </h2>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          Your personal AI health assistant is here to help with symptoms,
          records, and wellness guidance.
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTION_PROMPTS.map((suggestion, index) => {
          const Icon = iconMap[suggestion.icon]
          return (
            <button
              key={suggestion.id}
              type="button"
              disabled={isLoading}
              onClick={() => onSuggestionClick(suggestion.label)}
              className={cn(
                'animate-fade-in-up group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/30 hover:bg-accent hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-health-blue-light text-health-blue transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {suggestion.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Tap to start a conversation
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

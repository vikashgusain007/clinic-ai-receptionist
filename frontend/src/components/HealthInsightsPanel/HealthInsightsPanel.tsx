import {
  Brain,
  Calendar,
  ChevronRight,
  FileHeart,
  PanelRight,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { mockHealthInsights } from '@/data/mockHealthInsights'
import { cn } from '@/lib/utils'
import type { HealthTimelineEvent } from '@/types'

interface HealthInsightsPanelProps {
  open: boolean
  collapsed: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
  isLoading?: boolean
}

function statusColor(status: HealthTimelineEvent['status']) {
  switch (status) {
    case 'completed':
      return 'bg-health-green'
    case 'upcoming':
      return 'bg-primary'
    case 'review':
      return 'bg-muted-foreground'
  }
}

export function HealthInsightsPanel({
  open,
  collapsed,
  onToggleCollapse,
  onCloseMobile,
  isLoading = false,
}: HealthInsightsPanelProps) {
  const { recentRecords, storedMemories, timeline } = mockHealthInsights

  const panelContent = (
    <>
      <div
        className={cn(
          'flex items-center gap-2 border-b border-border p-3',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FileHeart className="h-4 w-4 text-health-blue" />
            <h2 className="text-sm font-semibold">Health Insights</h2>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden xl:flex"
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? 'Expand health insights' : 'Collapse health insights'
            }
          >
            <PanelRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={onCloseMobile}
            aria-label="Close health insights"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className={cn('space-y-4 p-3', collapsed && 'p-2')}>
          {!collapsed && (
            <>
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <FileHeart className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Recent Health Records
                  </h3>
                </div>
                <div className="space-y-2">
                  {isLoading
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                      ))
                    : recentRecords.map((record) => (
                        <div
                          key={record.id}
                          className="rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{record.title}</p>
                            <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {record.type}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {record.date}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {record.summary}
                          </p>
                        </div>
                      ))}
                </div>
              </section>

              <Separator />

              <section>
                <div className="mb-2 flex items-center gap-2">
                  <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Stored Memories
                  </h3>
                </div>
                <div className="space-y-2">
                  {storedMemories.map((memory) => (
                    <div
                      key={memory.id}
                      className="rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm"
                    >
                      <span className="rounded-md bg-health-blue-light px-2 py-0.5 text-[10px] font-medium text-health-blue">
                        {memory.category}
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-foreground">
                        {memory.content}
                      </p>
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Updated {memory.updatedAt}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Health Timeline
                  </h3>
                </div>
                <div className="space-y-0">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="relative flex gap-3 pb-4">
                      {index < timeline.length - 1 && (
                        <div className="absolute left-[5px] top-3 h-full w-px bg-border" />
                      )}
                      <div
                        className={cn(
                          'relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full',
                          statusColor(event.status),
                        )}
                      />
                      <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{event.title}</p>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {event.date}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {collapsed && (
            <div className="flex flex-col items-center gap-3 py-2">
              <FileHeart className="h-5 w-5 text-health-blue" />
              <Brain className="h-5 w-5 text-muted-foreground" />
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  )

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm xl:hidden"
          onClick={onCloseMobile}
          aria-label="Close health insights overlay"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-border bg-card transition-transform duration-300 xl:static xl:translate-x-0',
          open ? 'translate-x-0' : 'translate-x-full xl:translate-x-0',
          collapsed && 'xl:w-14',
          !open && 'hidden xl:flex',
        )}
      >
        {panelContent}
      </aside>
    </>
  )
}

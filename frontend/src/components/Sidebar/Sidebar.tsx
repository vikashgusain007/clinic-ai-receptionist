import {
  AlertCircle,
  MessageSquare,
  PanelLeft,
  Plus,
  X,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types'

interface SidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  collapsed: boolean
  mobileOpen: boolean
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onToggleCollapse: () => void
  onCloseMobile: () => void
}

export function Sidebar({
  conversations,
  activeConversationId,
  collapsed,
  mobileOpen,
  onNewChat,
  onSelectConversation,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const sortedConversations = [...conversations].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const sidebarContent = (
    <>
      <div
        className={cn(
          'flex items-center gap-2 p-3',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="truncate text-sm font-semibold">Health AI</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={cn('px-3', collapsed && 'px-2')}>
        <Button
          onClick={onNewChat}
          className={cn('w-full shadow-sm', collapsed && 'px-0')}
          variant={collapsed ? 'outline' : 'default'}
          size={collapsed ? 'icon' : 'default'}
          aria-label="New chat"
        >
          <Plus className="h-4 w-4" />
          {!collapsed && 'New Chat'}
        </Button>
      </div>

      <Separator className="my-3" />

      {!collapsed && (
        <p className="mb-2 px-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Recent
        </p>
      )}

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-3">
          {sortedConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                onSelectConversation(conversation.id)
                onCloseMobile()
              }}
              title={conversation.title}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent',
                activeConversationId === conversation.id &&
                  'bg-accent text-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              {!collapsed && (
                <span className="truncate">{conversation.title}</span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <div className={cn('space-y-1 p-3', collapsed && 'flex flex-col items-center')}>
        <ThemeToggle collapsed={collapsed} />
      </div>
    </>
  )

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed && 'lg:w-16',
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  return (
    <div className="animate-fade-in-up mx-4 mb-2 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">
          Unable to connect to Health AI.
        </p>
        <p className="text-xs text-destructive/80">Please try again.</p>
        {message && (
          <p className="mt-1 text-xs text-muted-foreground">{message}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

import { FileHeart, Menu, PanelLeft, PanelRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { ChatWindow } from '@/components/ChatWindow/ChatWindow'
import { HealthInsightsPanel } from '@/components/HealthInsightsPanel/HealthInsightsPanel'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useChat } from '@/hooks/useChat'

export function ChatPage() {
  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    error,
    sendMessage,
    startNewChat,
    selectConversation,
    clearError,
  } = useChat()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [insightsCollapsed, setInsightsCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false)

  const handleNewChat = useCallback(() => {
    startNewChat()
    setMobileSidebarOpen(false)
  }, [startNewChat])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      if (!isMod) return

      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault()
          handleNewChat()
          break
        case 'b':
          e.preventDefault()
          setSidebarCollapsed((prev) => !prev)
          break
        case 'i':
          e.preventDefault()
          if (window.innerWidth >= 1280) {
            setInsightsCollapsed((prev) => !prev)
          } else {
            setMobileInsightsOpen((prev) => !prev)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNewChat])

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full overflow-hidden bg-background">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onNewChat={handleNewChat}
          onSelectConversation={selectConversation}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border bg-card/80 px-3 py-2 backdrop-blur-sm lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="flex-1 text-sm font-semibold">Health AI</span>
            <ThemeToggle collapsed className="h-9 w-9 shrink-0" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileInsightsOpen(true)}
              aria-label="Open health insights"
            >
              <FileHeart className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden items-center gap-1 border-b border-border bg-card/50 px-3 py-1.5 lg:flex">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              <PanelLeft className="mr-1 h-3.5 w-3.5" />
              {sidebarCollapsed ? 'Expand' : 'Collapse'} sidebar
              <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
                ⌘B
              </kbd>
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle className="h-7 px-2 text-xs" />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={() => setInsightsCollapsed((prev) => !prev)}
              >
                <PanelRight className="mr-1 h-3.5 w-3.5" />
                Health Insights
                <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
                  ⌘I
                </kbd>
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSend={sendMessage}
              onDismissError={clearError}
            />

            <HealthInsightsPanel
              open={mobileInsightsOpen}
              collapsed={insightsCollapsed}
              onToggleCollapse={() => setInsightsCollapsed((prev) => !prev)}
              onCloseMobile={() => setMobileInsightsOpen(false)}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

import * as React from 'react';
import {
  Code2,
  FolderOpen,
  Hash,
  Search,
  Settings,
  Plus,
  Boxes,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { APP_NAME, APP_VERSION } from '@/constants';

export const DashboardApp: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col justify-between border-r border-border/70 bg-card/30 p-5">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">{APP_NAME}</h1>
              <p className="font-mono text-[11px] text-muted-foreground">
                v{APP_VERSION}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2.5 text-xs font-medium"
            >
              <Code2 className="h-4 w-4 text-primary" />
              All Snippets
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2.5 text-xs text-muted-foreground"
            >
              <FolderOpen className="h-4 w-4" />
              Collections
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2.5 text-xs text-muted-foreground"
            >
              <Hash className="h-4 w-4" />
              Tags
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2.5 text-xs text-muted-foreground"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </nav>
        </div>

        <div className="border-t border-border/50 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.href = '../settings/index.html';
            }}
            className="w-full justify-start gap-2 text-xs text-muted-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/70 px-8">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Dashboard Overview</h2>
            <p className="text-xs text-muted-foreground">
              Local snippet management workspace
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 py-1 text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Local-first Ready
            </Badge>
            <Button size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              New Snippet
            </Button>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-border/60 bg-card/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium">
                  Total Snippets
                </CardDescription>
                <CardTitle className="font-mono text-2xl font-bold">0</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Ready for import or web capture
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium">
                  Collections
                </CardDescription>
                <CardTitle className="font-mono text-2xl font-bold">0</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Grouped snippet workflows
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium">
                  Local Storage
                </CardDescription>
                <CardTitle className="flex items-center gap-2 font-mono text-2xl font-bold">
                  <Database className="h-5 w-5 text-primary" />
                  Local-only
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Zero telemetry, 100% private
              </CardContent>
            </Card>
          </div>

          {/* Scaffold Status Banner */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Boxes className="h-5 w-5" />
                <CardTitle className="text-base">
                  Phase 1: Project Foundation Initialized
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                The core extension architecture, styling system, and entry points are
                configured.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>
                  Manifest V3 extension service worker &amp; content script configured
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Tailwind CSS + Stitch dark developer theme active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>
                  Modular feature structure prepared for snippet store &amp; capture
                  pipeline
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

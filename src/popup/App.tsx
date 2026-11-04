import * as React from 'react';
import {
  Code2,
  LayoutDashboard,
  Settings as SettingsIcon,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuickCaptureCard } from '@/popup/components/QuickCaptureCard';
import { APP_NAME, APP_TAGLINE, APP_VERSION } from '@/constants';

export const App: React.FC = () => {
  const openDashboard = (): void => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({
        url: chrome.runtime.getURL('src/pages/dashboard/index.html'),
      });
    } else {
      window.open('/src/pages/dashboard/index.html', '_blank');
    }
  };

  const openSettings = (): void => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('/src/pages/settings/index.html', '_blank');
    }
  };

  return (
    <div className="flex w-[360px] flex-col bg-background p-4 text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">{APP_NAME}</h1>
            <p className="text-[11px] text-muted-foreground">{APP_TAGLINE}</p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
          v{APP_VERSION}
        </Badge>
      </header>

      {/* Main Content Area */}
      <main className="space-y-3">
        <QuickCaptureCard />

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={openDashboard}
            className="w-full justify-center gap-1.5 text-xs"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openSettings}
            className="w-full justify-center gap-1.5 text-xs"
          >
            <SettingsIcon className="h-3.5 w-3.5" />
            Settings
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-4 flex items-center justify-between border-t border-border/40 pt-2.5 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500/80" />
          <span>Local-First Storage</span>
        </div>
        <span>Manifest V3</span>
      </footer>
    </div>
  );
};

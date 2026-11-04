import * as React from 'react';
import {
  Code2,
  Moon,
  Sun,
  Laptop,
  ArrowLeft,
  Shield,
  Palette,
  Sliders,
  Database,
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
import type { ThemeMode } from '@/types';

export const SettingsApp: React.FC = () => {
  const [theme, setTheme] = React.useState<ThemeMode>('dark');

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div className="mx-auto max-w-4xl space-y-8 p-8">
        {/* Navigation & Header */}
        <header className="flex items-center justify-between border-b border-border/70 pb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '../dashboard/index.html';
                }
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Settings</h1>
                <Badge variant="outline" className="font-mono text-xs">
                  {APP_NAME}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Preferences, visual theme, and local configuration
              </p>
            </div>
          </div>
          <Badge variant="accent" className="font-mono text-xs">
            v{APP_VERSION}
          </Badge>
        </header>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance Section */}
          <Card className="border-border/60 bg-card/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Appearance &amp; Theme
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Customize the visual interface. Dark theme is the default Stitch developer
                mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center justify-center gap-2 text-xs"
                >
                  <Moon className="h-3.5 w-3.5" />
                  Dark (Default)
                </Button>
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center justify-center gap-2 text-xs"
                >
                  <Sun className="h-3.5 w-3.5" />
                  Light
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('system')}
                  className="flex items-center justify-center gap-2 text-xs"
                >
                  <Laptop className="h-3.5 w-3.5" />
                  System
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Editor Preferences Placeholder */}
          <Card className="border-border/60 bg-card/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Editor Preferences
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Syntax highlighting, tab indent size, and font rendering (configured in
                subsequent phases).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 py-2 text-xs">
                <span className="text-muted-foreground">Default Code Font</span>
                <span className="font-mono text-foreground/80">
                  JetBrains Mono / Fira Code
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 py-2 text-xs">
                <span className="text-muted-foreground">Tab Indentation</span>
                <span className="font-mono text-foreground/80">2 Spaces</span>
              </div>
              <div className="flex items-center justify-between py-2 text-xs">
                <span className="text-muted-foreground">Line Numbers</span>
                <span className="font-mono text-foreground/80">Enabled</span>
              </div>
            </CardContent>
          </Card>

          {/* Local-First Storage & Privacy */}
          <Card className="border-border/60 bg-card/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-sm font-semibold">
                  Storage &amp; Privacy
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                DevCodeSnap is 100% local-first. Your snippets never leave your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-background/50 p-3">
                <Database className="h-4 w-4 shrink-0 text-primary" />
                <p>
                  All data is stored directly on your machine in local extension storage
                  and client databases. No accounts, no external tracking, and zero cloud
                  telemetry.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer info */}
        <footer className="border-t border-border/40 pt-4 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span>DevCodeSnap - Open Source &amp; Local-First Snippet Studio</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

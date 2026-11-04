import * as React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const QuickCaptureCard: React.FC = () => {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Quick Capture</CardTitle>
          </div>
          <Badge variant="accent" className="font-mono text-[10px]">
            Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-start gap-2.5 rounded-lg border border-border/40 bg-background/50 p-3 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80" />
          <p className="leading-relaxed">
            Select code on any webpage to capture, or launch the Snippet Studio to manage
            your local library.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

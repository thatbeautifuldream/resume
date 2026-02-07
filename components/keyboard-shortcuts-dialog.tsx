"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface KeyboardShortcut {
  keys: string[];
  description: string;
}

const shortcuts: KeyboardShortcut[] = [
  { keys: ["⌘", "K"], description: "Toggle chat sidebar" },
  { keys: ["Esc"], description: "Close sidebar" },
  { keys: ["J"], description: "Toggle JSON view" },
  { keys: ["T"], description: "Toggle theme" },
  { keys: ["P"], description: "Print resume" },
  { keys: ["/"], description: "Show keyboard shortcuts" },
];

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Custom shortcuts available in this app
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors select-none"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <KbdGroup>
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex} className="inline-flex items-center gap-1">
                    <Kbd>{key}</Kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
              </KbdGroup>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

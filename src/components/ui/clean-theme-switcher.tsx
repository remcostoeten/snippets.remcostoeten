'use client'

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

type TProps = {
  className?: string
}

export function CleanThemeSwitcher({ className }: TProps) {
  const { setTheme, theme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' }
  ];

  return (
    <div className={cn("flex items-center rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm", className)}>
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isActive = theme === themeOption.value;
        
        return (
          <Button
            key={themeOption.value}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(themeOption.value)}
            className={cn(
              "h-8 px-2 sm:px-3 rounded-md transition-all duration-200",
              "hover:bg-muted/50 hover:scale-105",
              isActive 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-1 sm:ml-2 text-xs font-medium hidden sm:inline">{themeOption.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

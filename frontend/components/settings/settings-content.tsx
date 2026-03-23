"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useThemeContext } from "@/components/providers/theme-provider";
import { Moon, Sun, Monitor, Palette, Globe, Bell, Check } from "lucide-react";

export function SettingsContent() {
  const { theme, setTheme } = useThemeContext();
  const [currency, setCurrency] = useLocalStorage("currency", "USD");
  const [dateFormat, setDateFormat] = useLocalStorage("dateFormat", "short");
  const [notifications, setNotifications] = useLocalStorage("notifications", true);
  const [compactMode, setCompactMode] = useLocalStorage("compactMode", false);

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const dateFormats = [
    { value: "short", name: "Short (Jan 15, 2024)" },
    { value: "long", name: "Long (January 15, 2024)" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[rgb(var(--foreground-primary))]">Settings</h1>
        <p className="mt-1 text-sm text-[rgb(var(--foreground-muted))]">Customize your application preferences</p>
      </div>

      <Card className="p-6 hover-lift">
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={theme === "light" ? "default" : "outline"} size="icon" onClick={() => setTheme("light")} className="h-10 w-10 rounded-xl">
                  <Sun className="h-5 w-5" />
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} size="icon" onClick={() => setTheme("dark")} className="h-10 w-10 rounded-xl">
                  <Moon className="h-5 w-5" />
                </Button>
                <Button variant={theme === "system" ? "default" : "outline"} size="icon" onClick={() => setTheme("system")} className="h-10 w-10 rounded-xl">
                  <Monitor className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
              </div>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6 hover-lift">
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-0.5">
              <Label>Currency</Label>
            </div>
            <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name}
                </option>
              ))}
            </Select>

            <div className="space-y-0.5 mt-4">
              <Label>Date Format</Label>
            </div>
            <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
              {dateFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.name}
                </option>
              ))}
            </Select>

            <div className="flex items-center justify-between mt-4">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6 hover-lift">
        <CardHeader><CardTitle>About</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Palette className="h-5 w-5 text-[rgb(var(--primary))]" />
              <div>
                <p className="text-sm font-medium text-[rgb(var(--foreground-primary))]">FinTrack</p>
                <p className="text-xs text-[rgb(var(--foreground-muted))]">Personal Finance Tracker v1.0.0</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-[rgb(var(--foreground-muted))]" />
              <div>
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">Made with</p>
                <p className="text-xs text-[rgb(var(--foreground-muted))]">Next.js 16, React 19, Tailwind CSS 4</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-[rgb(var(--foreground-muted))]" />
              <div>
                <p className="text-sm text-[rgb(var(--foreground-secondary))]">Features</p>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--foreground-muted))]">
                    <Check className="h-3.5 w-3.5 text-[rgb(var(--success))]" />
                    <span>Dashboard with financial overview</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--foreground-muted))]">
                    <Check className="h-3.5 w-3.5 text-[rgb(var(--success))]" />
                    <span>Transaction management</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--foreground-muted))]">
                    <Check className="h-3.5 w-3.5 text-[rgb(var(--success))]" />
                    <span>Analytics and insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--foreground-muted))]">
                    <Check className="h-3.5 w-3.5 text-[rgb(var(--success))]" />
                    <span>Category and budget tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

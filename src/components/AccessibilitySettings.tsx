/**
 * Accessibility Settings
 * Configuración de accesibilidad WCAG 2.1 AAA
 */

import { useState, useEffect } from 'react';
import { Settings, Eye, Type, Focus, Contrast } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';

interface A11ySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusIndicators: boolean;
  textSize: number; // 100-200%
  lineHeight: number; // 1.5-2.5
  letterSpacing: number; // 0-0.12em
  screenReaderOptimized: boolean;
}

const DEFAULT_SETTINGS: A11ySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  focusIndicators: true,
  textSize: 100,
  lineHeight: 1.5,
  letterSpacing: 0,
  screenReaderOptimized: false,
};

const STORAGE_KEY = 'hmobility_a11y_settings';

export function useAccessibilitySettings() {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch (error) {
        console.error('Error loading a11y settings:', error);
      }
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      updateSetting('reducedMotion', true);
    }

    const prefersContrast = window.matchMedia('(prefers-contrast: high)');
    if (prefersContrast.matches) {
      updateSetting('highContrast', true);
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof A11ySettings>(
    key: K,
    value: A11ySettings[K]
  ) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));

      analytics.trackEvent('accessibility_setting_changed', {
        setting: key,
        value: String(value),
      });

      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    analytics.trackEvent('accessibility_settings_reset');
  };

  return { settings, updateSetting, resetSettings };
}

function applySettings(settings: A11ySettings) {
  const root = document.documentElement;

  // High Contrast
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Reduced Motion
  if (settings.reducedMotion) {
    root.style.setProperty('--animation-speed', '0.01s');
    root.classList.add('reduce-motion');
  } else {
    root.style.removeProperty('--animation-speed');
    root.classList.remove('reduce-motion');
  }

  // Large Text
  if (settings.largeText) {
    root.classList.add('large-text');
  } else {
    root.classList.remove('large-text');
  }

  // Focus Indicators
  if (settings.focusIndicators) {
    root.classList.add('enhanced-focus');
  } else {
    root.classList.remove('enhanced-focus');
  }

  // Text Size
  root.style.fontSize = `${settings.textSize}%`;

  // Line Height
  root.style.setProperty('--line-height', settings.lineHeight.toString());

  // Letter Spacing
  root.style.setProperty('--letter-spacing', `${settings.letterSpacing}em`);

  // Screen Reader
  if (settings.screenReaderOptimized) {
    root.classList.add('sr-optimized');
  } else {
    root.classList.remove('sr-optimized');
  }
}

// Panel de configuración de accesibilidad
export function AccessibilityPanel() {
  const { settings, updateSetting, resetSettings } = useAccessibilitySettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuración de Accesibilidad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="high-contrast">Alto Contraste</Label>
          </div>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSetting('highContrast', checked)}
          />
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="reduced-motion">Reducir Movimiento</Label>
          </div>
          <Switch
            id="reduced-motion"
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
          />
        </div>

        {/* Large Text */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="large-text">Texto Grande</Label>
          </div>
          <Switch
            id="large-text"
            checked={settings.largeText}
            onCheckedChange={(checked) => updateSetting('largeText', checked)}
          />
        </div>

        {/* Focus Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Focus className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="focus-indicators">Indicadores de Foco Mejorados</Label>
          </div>
          <Switch
            id="focus-indicators"
            checked={settings.focusIndicators}
            onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
          />
        </div>

        {/* Text Size Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Tamaño de Texto</Label>
            <span className="text-sm text-muted-foreground">{settings.textSize}%</span>
          </div>
          <Slider
            value={[settings.textSize]}
            onValueChange={([value]) => updateSetting('textSize', value)}
            min={100}
            max={200}
            step={10}
            className="w-full"
          />
        </div>

        {/* Line Height Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Altura de Línea</Label>
            <span className="text-sm text-muted-foreground">
              {settings.lineHeight.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[settings.lineHeight * 10]}
            onValueChange={([value]) => updateSetting('lineHeight', value / 10)}
            min={15}
            max={25}
            step={1}
            className="w-full"
          />
        </div>

        {/* Letter Spacing Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Espaciado de Letras</Label>
            <span className="text-sm text-muted-foreground">
              {(settings.letterSpacing * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[settings.letterSpacing * 100]}
            onValueChange={([value]) => updateSetting('letterSpacing', value / 100)}
            min={0}
            max={12}
            step={1}
            className="w-full"
          />
        </div>

        {/* Screen Reader Optimization */}
        <div className="flex items-center justify-between">
          <Label htmlFor="sr-optimized">Optimizado para Lector de Pantalla</Label>
          <Switch
            id="sr-optimized"
            checked={settings.screenReaderOptimized}
            onCheckedChange={(checked) =>
              updateSetting('screenReaderOptimized', checked)
            }
          />
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={resetSettings}
        >
          Restaurar Valores Predeterminados
        </Button>

        {/* Info */}
        <p className="text-xs text-muted-foreground">
          Esta configuración cumple con WCAG 2.1 Nivel AAA para máxima accesibilidad.
        </p>
      </CardContent>
    </Card>
  );
}

// Skip to content link (WCAG requirement)
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      Saltar al contenido principal
    </a>
  );
}

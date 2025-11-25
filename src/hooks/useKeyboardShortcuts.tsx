/**
 * Configuración de Keyboard Shortcuts
 * Atajos de teclado para navegación rápida
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          altMatch &&
          shiftMatch
        ) {
          e.preventDefault();
          shortcut.action();
          
          analytics.trackEvent('keyboard_shortcut_used', {
            key: shortcut.key,
            description: shortcut.description,
          });
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Shortcuts globales de la aplicación
export function useGlobalShortcuts() {
  const navigate = useNavigate();

  const shortcuts: Shortcut[] = [
    {
      key: 'k',
      ctrl: true,
      description: 'Abrir búsqueda',
      action: () => {
        // Trigger search modal
        document.getElementById('global-search')?.focus();
      },
    },
    {
      key: 'm',
      ctrl: true,
      description: 'Ir al mapa',
      action: () => navigate('/map'),
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Ir al dashboard',
      action: () => navigate('/gobierno/dashboard'),
    },
    {
      key: 'r',
      ctrl: true,
      description: 'Reportar incidente',
      action: () => navigate('/citizen-reports'),
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Ir al inicio',
      action: () => navigate('/'),
    },
    {
      key: '/',
      description: 'Mostrar atajos',
      action: () => {
        // Show shortcuts modal
        const event = new CustomEvent('show-shortcuts-modal');
        window.dispatchEvent(event);
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

// Modal de ayuda de shortcuts
export function ShortcutsHelpModal() {
  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Búsqueda global' },
    { keys: ['⌘', 'M'], description: 'Ir al mapa' },
    { keys: ['⌘', 'D'], description: 'Dashboard gobierno' },
    { keys: ['⌘', 'R'], description: 'Reportar incidente' },
    { keys: ['⌘', 'H'], description: 'Volver al inicio' },
    { keys: ['/'], description: 'Mostrar esta ayuda' },
    { keys: ['ESC'], description: 'Cerrar modal' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Atajos de Teclado</h2>
      <div className="space-y-3">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <div className="flex gap-1">
              {shortcut.keys.map((key, i) => (
                <kbd
                  key={i}
                  className="px-2 py-1 bg-muted rounded border text-xs font-mono"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-6">
        Presiona <kbd className="px-2 py-1 bg-muted rounded border">?</kbd> en cualquier momento para ver esta ayuda
      </p>
    </div>
  );
}

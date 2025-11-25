/**
 * Sistema de Favoritos
 * Permite a usuarios guardar páginas favoritas
 */

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/design-system';
import { analytics } from '@/lib/analytics';

interface Favorite {
  id: string;
  title: string;
  path: string;
  icon?: string;
  timestamp: Date;
}

const STORAGE_KEY = 'hmobility_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(parsed.map((f: any) => ({
          ...f,
          timestamp: new Date(f.timestamp),
        })));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: Favorite[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addFavorite = (favorite: Omit<Favorite, 'id' | 'timestamp'>) => {
    const newFavorite: Favorite = {
      ...favorite,
      id: `fav-${Date.now()}`,
      timestamp: new Date(),
    };

    const updated = [...favorites, newFavorite];
    saveFavorites(updated);

    analytics.trackEvent('favorite_added', {
      title: favorite.title,
      path: favorite.path,
    });
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    saveFavorites(updated);

    analytics.trackEvent('favorite_removed', { id });
  };

  const isFavorite = (path: string) => {
    return favorites.some((f) => f.path === path);
  };

  const toggleFavorite = (favorite: Omit<Favorite, 'id' | 'timestamp'>) => {
    const existing = favorites.find((f) => f.path === favorite.path);
    if (existing) {
      removeFavorite(existing.id);
    } else {
      addFavorite(favorite);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}

// Componente de botón de favorito
interface FavoriteButtonProps {
  title: string;
  path: string;
  icon?: string;
}

export function FavoriteButton({ title, path, icon }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(path);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleFavorite({ title, path, icon })}
      className={cn('transition-colors', favorite && 'text-yellow-500')}
      aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Star className={cn('w-5 h-5', favorite && 'fill-current')} />
    </Button>
  );
}

// Lista de favoritos para sidebar
export function FavoritesList() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Sin favoritos aún</p>
        <p className="text-xs mt-1">
          Presiona <Star className="w-3 h-3 inline" /> para guardar páginas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="flex items-center justify-between p-2 rounded hover:bg-muted group"
        >
          <a href={fav.path} className="flex-1 flex items-center gap-2">
            {fav.icon && <span>{fav.icon}</span>}
            <span className="text-sm font-medium">{fav.title}</span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeFavorite(fav.id)}
          >
            <Star className="w-4 h-4 fill-current text-yellow-500" />
          </Button>
        </div>
      ))}
    </div>
  );
}

/**
 * Draggable Widget Component
 * Widget individual con drag & drop y resize
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/design-system';
import { ReactNode } from 'react';

export interface WidgetConfig {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large' | 'full';
  component: ReactNode;
  icon?: ReactNode;
}

interface DraggableWidgetProps {
  widget: WidgetConfig;
  onRemove: (id: string) => void;
  onResize: (id: string, size: WidgetConfig['size']) => void;
}

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-2 row-span-1',
  large: 'col-span-2 row-span-2',
  full: 'col-span-3 row-span-2',
};

export function DraggableWidget({ widget, onRemove, onResize }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cycleSizes = () => {
    const sizes: WidgetConfig['size'][] = ['small', 'medium', 'large', 'full'];
    const currentIndex = sizes.indexOf(widget.size);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    onResize(widget.id, nextSize);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        sizeClasses[widget.size],
        'transition-all duration-200',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-shadow">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            >
              <GripVertical className="w-5 h-5" />
            </button>
            {widget.icon}
            <CardTitle className="text-lg font-semibold">{widget.title}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={cycleSizes}
            >
              {widget.size === 'small' || widget.size === 'medium' ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(widget.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {widget.component}
        </CardContent>
      </Card>
    </div>
  );
}

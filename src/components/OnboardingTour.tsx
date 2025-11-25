/**
 * Sistema de Onboarding con Tour Guiado
 * Introduce nuevos usuarios a las funcionalidades principales
 */

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn, designSystem } from '@/lib/design-system';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string; // Selector CSS del elemento a destacar
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip?: () => void;
  storageKey?: string;
}

export function OnboardingTour({
  steps,
  onComplete,
  onSkip,
  storageKey = 'hmobility_tour_completed',
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  useEffect(() => {
    // Verificar si el tour ya fue completado
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      setIsVisible(true);
      analytics.trackEvent('onboarding_started', { total_steps: steps.length });
    }
  }, [storageKey, steps.length]);

  useEffect(() => {
    if (!isVisible) return;

    const step = steps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightedElement(null);
    }

    analytics.trackEvent('onboarding_step_viewed', {
      step_number: currentStep + 1,
      step_id: step.id,
      step_title: step.title,
    });
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    analytics.trackEvent('onboarding_skipped', {
      step_number: currentStep + 1,
      total_steps: steps.length,
    });
    setIsVisible(false);
    onSkip?.();
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    analytics.trackEvent('onboarding_completed', {
      total_steps: steps.length,
    });
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible || steps.length === 0) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Spotlight para elemento destacado */}
      {highlightedElement && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 8,
            left: highlightedElement.getBoundingClientRect().left - 8,
            width: highlightedElement.getBoundingClientRect().width + 16,
            height: highlightedElement.getBoundingClientRect().height + 16,
            border: '3px solid',
            borderColor: designSystem.colors.brand.primary,
            borderRadius: designSystem.borderRadius.lg,
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 30px ${designSystem.colors.brand.primary}`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Card del tour */}
      <Card
        className={cn(
          'fixed z-[10000] w-full max-w-md',
          'shadow-2xl border-2',
          designSystem.animations.entrance.slideUp,
          step.position === 'center' && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          step.position === 'top' && 'top-4 left-1/2 -translate-x-1/2',
          step.position === 'bottom' && 'bottom-4 left-1/2 -translate-x-1/2',
          step.position === 'left' && 'top-1/2 left-4 -translate-y-1/2',
          step.position === 'right' && 'top-1/2 right-4 -translate-y-1/2',
          !step.position && 'bottom-4 right-4'
        )}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Paso {currentStep + 1} de {steps.length}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {step.title}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Imagen (opcional) */}
          {step.image && (
            <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Contenido */}
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {step.content}
          </p>

          {/* Acción personalizada */}
          {step.action && (
            <Button
              onClick={step.action.onClick}
              className="w-full mb-4"
              variant="outline"
            >
              {step.action.label}
            </Button>
          )}

          {/* Progress bar */}
          <Progress value={progress} className="mb-4 h-2" />

          {/* Navegación */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                <Check className="w-4 h-4 mr-1" />
                ¡Entendido!
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Indicadores de paso */}
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentStep
                    ? 'bg-primary w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Tours predefinidos para diferentes secciones
export const ciudadanoTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a HMObility!',
    content: 'Tu plataforma para mejorar la seguridad vial en Hermosillo. Vamos a mostrarte las funciones principales.',
    position: 'center',
  },
  {
    id: 'map',
    title: 'Mapa Interactivo',
    content: 'Explora los accidentes registrados, zonas de riesgo y la infraestructura vial de la ciudad.',
    target: '#mapa-interactivo',
    position: 'right',
  },
  {
    id: 'reports',
    title: 'Reporta Incidentes',
    content: 'Ayuda a mejorar tu ciudad reportando baches, falta de señalización u otros problemas viales.',
    target: '#boton-reportar',
    position: 'bottom',
  },
  {
    id: 'game',
    title: 'Aprende Jugando',
    content: 'Participa en nuestro juego educativo y conviértete en un experto en seguridad vial.',
    target: '#juego-educativo',
    position: 'bottom',
  },
  {
    id: 'data',
    title: 'Datos Abiertos',
    content: 'Accede a estadísticas actualizadas y descarga los datos para tus propios análisis.',
    position: 'center',
  },
];

export const gobiernoTourSteps: TourStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Ejecutivo',
    content: 'Vista unificada de los indicadores clave de seguridad vial en tiempo real.',
    position: 'center',
  },
  {
    id: 'high-injury',
    title: 'High-Injury Network',
    content: 'Identifica las zonas de mayor siniestralidad basadas en metodología Vision Zero.',
    target: '#high-injury-network',
    position: 'right',
  },
  {
    id: 'ia-recommendations',
    title: 'Recomendaciones IA',
    content: 'Recibe sugerencias automáticas basadas en análisis predictivo de accidentes.',
    target: '#ia-recommendations',
    position: 'bottom',
  },
  {
    id: 'centro-comando',
    title: 'Centro de Comando',
    content: 'Monitorea operativos en tiempo real y coordina respuestas a emergencias.',
    target: '#centro-comando',
    position: 'left',
  },
  {
    id: 'gemelo-digital',
    title: 'Gemelo Digital',
    content: 'Simula escenarios y visualiza el impacto de intervenciones viales en 3D.',
    position: 'center',
  },
];

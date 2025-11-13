/**
 * Data validation utilities using Zod
 */
import { z } from 'zod';

/**
 * Schema for accident data
 */
export const accidentDataSchema = z.object({
  id_evento: z.string(),
  tipo_accidente: z.string(),
  medio_reporta: z.string(),
  fecha_accidente: z.string(),
  fecha_reporte: z.string(),
  hora_reporte: z.string(),
  ubicacion: z.object({
    direccion_completa: z.string(),
    ubicacion_exacta: z.string(),
    colonia: z.string(),
    municipio: z.string(),
    estado: z.string(),
    coordenadas: z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
    }),
  }),
  vehiculo_involucrado: z.object({
    tipo: z.string(),
    descripcion: z.string(),
  }),
  numero_heridos: z.number().int().min(0),
  numero_defunciones: z.number().int().min(0),
  danos_materiales: z.string(),
  afectaciones: z.array(z.string()),
  intervencion_servicios_emergencia: z.object({
    policia_transito: z.boolean(),
    ambulancia: z.boolean(),
    bomberos: z.boolean(),
  }).optional(),
  instituciones_intervinientes: z.array(z.string()).optional(),
  condiciones_climaticas: z.string().optional(),
  descripcion_evento: z.string(),
  reportero: z.string().optional(),
  fotografo: z.string().optional(),
  fuente_url: z.string().url().optional(),
  mapa_url: z.string().url().optional(),
  clasificacion_evento: z.object({
    nivel_gravedad: z.string(),
    riesgo_publico: z.string(),
  }),
});

export type AccidentData = z.infer<typeof accidentDataSchema>;

/**
 * Schema for reglamento (regulation) data
 */
export const reglamentoSchema = z.object({
  categoria: z.string(),
  subcategoria: z.string(),
  descripcion: z.string(),
  articulo: z.string().optional(),
  fuente: z.string(),
});

export type ReglamentoEntry = z.infer<typeof reglamentoSchema>;

/**
 * Validate and parse data with error handling
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options?: { throwOnError?: boolean }
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (options?.throwOnError) {
      throw error;
    }
    console.error('Data validation error:', error);
    return null;
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 500); // Limit length
}

/**
 * Validate URL is safe for external links
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

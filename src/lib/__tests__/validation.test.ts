import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateData } from '@/lib/validation';

// Import actual schemas
import { accidentDataSchema } from '@/lib/validation';

describe('Validation', () => {
  describe('validateData', () => {
    it('validates correct accident data', () => {
      const validData = {
        id_evento: 'EVT001',
        tipo_accidente: 'Colisión',
        medio_reporta: 'Medios',
        fecha_accidente: '2024-01-15',
        fecha_reporte: '2024-01-15',
        hora_reporte: '14:30:00',
        ubicacion: {
          direccion_completa: 'Calle Principal 123',
          ubicacion_exacta: 'Frente a plaza comercial',
          colonia: 'Centro',
          municipio: 'Hermosillo',
          estado: 'Sonora',
          coordenadas: {
            lat: 29.0892,
            lon: -110.9618,
          },
        },
        vehiculo_involucrado: {
          tipo: 'Automóvil',
          descripcion: 'Sedán gris',
        },
        numero_heridos: 2,
        numero_defunciones: 0,
        danos_materiales: 'Moderados',
        afectaciones: ['Tráfico'],
        descripcion_evento: 'Accidente de prueba',
        clasificacion_evento: {
          nivel_gravedad: 'Alto',
          riesgo_publico: 'Medio',
        },
      };

      const result = validateData(accidentDataSchema, validData);
      expect(result).toEqual(validData);
    });

    it('rejects invalid accident data', () => {
      const invalidData = {
        id: '1',
        latitud: 'not-a-number', // Invalid
        longitud: -110.9618,
        fecha_accidente: '2024-01-15',
      };

      const result = validateData(accidentDataSchema, invalidData);
      expect(result).toBeNull();
    });

    it('validates array of accidents', () => {
      const schema = z.array(accidentDataSchema);
      const validArray = [
        {
          id_evento: 'EVT001',
          tipo_accidente: 'Colisión',
          medio_reporta: 'Medios',
          fecha_accidente: '2024-01-15',
          fecha_reporte: '2024-01-15',
          hora_reporte: '14:30:00',
          ubicacion: {
            direccion_completa: 'Calle Principal 123',
            ubicacion_exacta: 'Test',
            colonia: 'Centro',
            municipio: 'Hermosillo',
            estado: 'Sonora',
            coordenadas: { lat: 29.0892, lon: -110.9618 },
          },
          vehiculo_involucrado: {
            tipo: 'Automóvil',
            descripcion: 'Test',
          },
          numero_heridos: 2,
          numero_defunciones: 0,
          danos_materiales: 'Test',
          afectaciones: ['Tráfico'],
          descripcion_evento: 'Test',
          clasificacion_evento: {
            nivel_gravedad: 'Alto',
            riesgo_publico: 'Medio',
          },
        },
      ];

      const result = validateData(schema, validArray);
      expect(result).toEqual(validArray);
    });

    it('rejects array with invalid items', () => {
      const schema = z.array(accidentDataSchema);
      const invalidArray = [
        {
          id: '1',
          latitud: 29.0892,
          longitud: -110.9618,
          fecha_accidente: '2024-01-15',
          hora: '14:30:00',
          gravedad: 'Alta',
          tipo_accidente: 'Colisión',
          victimas: 2,
          descripcion: 'Valid',
        },
        {
          id: '2',
          latitud: 'invalid', // Invalid
          longitud: -110.9559,
        },
      ];

      const result = validateData(schema, invalidArray);
      expect(result).toBeNull();
    });
  });

  describe('accidentDataSchema', () => {
    it('validates required fields', () => {
      const data = {
        id_evento: 'EVT001',
        tipo_accidente: 'Colisión',
        medio_reporta: 'Medios',
        fecha_accidente: '2024-01-15',
        fecha_reporte: '2024-01-15',
        hora_reporte: '14:30:00',
        ubicacion: {
          direccion_completa: 'Test',
          ubicacion_exacta: 'Test',
          colonia: 'Test',
          municipio: 'Test',
          estado: 'Test',
          coordenadas: { lat: 29.0892, lon: -110.9618 },
        },
        vehiculo_involucrado: {
          tipo: 'Test',
          descripcion: 'Test',
        },
        numero_heridos: 2,
        numero_defunciones: 0,
        danos_materiales: 'Test',
        afectaciones: ['Test'],
        descripcion_evento: 'Test',
        clasificacion_evento: {
          nivel_gravedad: 'Alto',
          riesgo_publico: 'Medio',
        },
      };

      expect(() => accidentDataSchema.parse(data)).not.toThrow();
    });

    it('rejects missing required fields', () => {
      const data = {
        id_evento: '1',
        // Missing all other required fields
      };

      expect(() => accidentDataSchema.parse(data)).toThrow();
    });

    it('validates coordinate ranges', () => {
      const data = {
        id_evento: 'EVT001',
        tipo_accidente: 'Test',
        medio_reporta: 'Test',
        fecha_accidente: '2024-01-15',
        fecha_reporte: '2024-01-15',
        hora_reporte: '14:30:00',
        ubicacion: {
          direccion_completa: 'Test',
          ubicacion_exacta: 'Test',
          colonia: 'Test',
          municipio: 'Test',
          estado: 'Test',
          coordenadas: {
            lat: 29.0892, // Valid Hermosillo latitude
            lon: -110.9618, // Valid Hermosillo longitude
          },
        },
        vehiculo_involucrado: {
          tipo: 'Test',
          descripcion: 'Test',
        },
        numero_heridos: 2,
        numero_defunciones: 0,
        danos_materiales: 'Test',
        afectaciones: ['Test'],
        descripcion_evento: 'Test',
        clasificacion_evento: {
          nivel_gravedad: 'Test',
          riesgo_publico: 'Test',
        },
      };

      expect(() => accidentDataSchema.parse(data)).not.toThrow();
    });
  });
});

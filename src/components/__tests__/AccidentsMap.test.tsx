import { describe, it, expect } from 'vitest';

// AccidentsMap has complex Leaflet dependencies that are hard to mock
// These are smoke tests to ensure the module can be imported
describe('AccidentsMap', () => {
  it('module exists and can be imported', async () => {
    const module = await import('@/components/AccidentsMap');
    expect(module.default).toBeDefined();
  });

  it('is a valid React component', async () => {
    const module = await import('@/components/AccidentsMap');
    expect(typeof module.default).toBe('function');
  });
});

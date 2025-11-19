import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { fireEvent } from '@testing-library/react';
import OSMLayerControl from '@/components/OSMLayerControl';

describe('OSMLayerControl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the control panel with all layer toggles', () => {
    render(<OSMLayerControl />);

    expect(screen.getByText(/Capas de Infraestructura/i)).toBeInTheDocument();
    expect(screen.getByText(/Semáforos/i)).toBeInTheDocument();
    expect(screen.getByText(/Cruces/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciclovías/i)).toBeInTheDocument();
    expect(screen.getByText(/Calles/i)).toBeInTheDocument();
  });

  it('displays layer labels', () => {
    render(<OSMLayerControl />);

    // Check if layer labels are rendered
    expect(screen.getByText(/Semáforos/i)).toBeInTheDocument();
    expect(screen.getByText(/Cruces/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciclovías/i)).toBeInTheDocument();
    expect(screen.getByText(/Calles/i)).toBeInTheDocument();
  });

  it('all layers start unchecked by default', () => {
    render(<OSMLayerControl />);

    const switches = screen.getAllByRole('switch');
    switches.forEach((switchElement) => {
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });
  });

  it('toggles layer visibility when switch is clicked', () => {
    render(<OSMLayerControl />);

    const switches = screen.getAllByRole('switch');
    const firstSwitch = switches[0];

    // Initially unchecked
    expect(firstSwitch).toHaveAttribute('data-state', 'unchecked');

    // Click to check
    fireEvent.click(firstSwitch);
    expect(firstSwitch).toHaveAttribute('data-state', 'checked');

    // Click again to uncheck
    fireEvent.click(firstSwitch);
    expect(firstSwitch).toHaveAttribute('data-state', 'unchecked');
  });

  it('shows OSM badge', () => {
    render(<OSMLayerControl />);

    // Component renders with OSM badge
    expect(screen.getByText(/OSM/i)).toBeInTheDocument();
  });

  it('renders with proper styling classes', () => {
    const { container } = render(<OSMLayerControl />);

    const card = container.querySelector('.bg-white\\/95');
    expect(card).toBeTruthy();
  });

  it('renders control panel with proper structure', () => {
    const { container } = render(<OSMLayerControl />);
    
    // Check that component renders without crashing
    expect(container.querySelector('[style*="position: absolute"]')).toBeTruthy();
  });
});

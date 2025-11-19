import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('logs debug messages in development', () => {
    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG]')
    );
  });

  it('logs info messages', () => {
    logger.info('Info message');
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]')
    );
  });

  it('logs warnings', () => {
    logger.warn('Warning message');
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[WARN]')
    );
  });

  it('logs errors', () => {
    logger.error('Error message');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR]')
    );
  });

  it('includes metadata in logs', () => {
    logger.info('Message with metadata', { userId: 123, action: 'click' });
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('userId')
    );
  });

  it('includes timestamp in all logs', () => {
    logger.info('Timestamped message');
    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\d{4}-\d{2}-\d{2}/)
    );
  });
});

import { describe, it, expect, vi } from 'vitest';
import { getDeviceById } from './get-device';

describe('getDeviceById', () => {
  it('returns device if found', async () => {
    const repo = {
      getById: vi
        .fn()
        .mockResolvedValue({ id: 'abc', name: 'Test', quantity: 1 }),
    };
    const result = await getDeviceById({ deviceRepo: repo }, 'abc');
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'abc', name: 'Test', quantity: 1 });
  });

  it('returns error if not found', async () => {
    const repo = {
      getById: vi.fn().mockResolvedValue(null),
    };
    const result = await getDeviceById({ deviceRepo: repo }, 'notfound');
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).toBe('Device not found');
  });
});

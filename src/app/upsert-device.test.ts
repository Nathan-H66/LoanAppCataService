import { describe, it, expect, vi } from 'vitest';
import { upsertDevice } from './upsert-device';
import type { DeviceRepo } from '../domain/device-repo';
import type { DeviceUpdatedNotifier } from './device-updated-notifier';

describe('upsertDevice', () => {
  it('saves device and notifies', async () => {
    const saved: any[] = [];
    const repo: DeviceRepo = {
      save: async (d) => {
        saved.push(d);
      },
      getById: async () => null,
      list: async () => [],
      delete: async () => {},
    };

    const notifier: DeviceUpdatedNotifier = {
      notifyDeviceUpdated: vi.fn(async () => {}),
    };

    const deps = { deviceRepo: repo, deviceUpdatedNotifier: notifier };

    const result = await upsertDevice(deps, {
      id: 'u-1',
      name: 'Upsertable',
      description: 'For testing',
      category: 'Test',
      quantity: 2,
    });

    expect(result.success).toBe(true);
    expect(saved).toHaveLength(1);
    expect((notifier.notifyDeviceUpdated as any).mock.calls.length).toBe(1);
  });

  it('returns failure when repo.save throws', async () => {
    const repo: DeviceRepo = {
      save: async () => {
        throw new Error('save failed');
      },
      getById: async () => null,
      list: async () => [],
      delete: async () => {},
    };

    const notifier: DeviceUpdatedNotifier = {
      notifyDeviceUpdated: vi.fn(async () => {}),
    };

    const result = await upsertDevice(
      { deviceRepo: repo, deviceUpdatedNotifier: notifier },
      {
        id: 'u-2',
        name: 'Failing',
        description: 'Should fail',
        category: 'Test',
        quantity: 1,
      }
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('save failed');
  });
});

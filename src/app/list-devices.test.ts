import { describe, it, expect } from 'vitest';
import { listDevices } from './list-devices';
import { FakeDeviceRepo } from '../infra/fake-device-repo';
import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

describe('listProducts', () => {
  it('should return empty array when no products exist', async () => {
    // Arrange
    const deviceRepo = new FakeDeviceRepo();

    // Act
    const result = await listDevices({
      deviceRepo,
      authContext: {
        authenticated: false,
        scopes: [],
        subject: undefined,
      },
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should return all products from the repository', async () => {
    // Arrange
    const devices: Device[] = [
      {
        id: 'dev-1',
        name: 'Device 1',

        description: 'First device',
        category: 'Category A',
      },
      {
        id: 'dev-2',
        name: 'Device 2',
        description: 'Second device',
        category: 'Category B',
      },
    ];
    const deviceRepo = new FakeDeviceRepo(devices);

    // Act
    const result = await listDevices({
      deviceRepo,
      authContext: {
        authenticated: false,
        scopes: [],
        subject: undefined,
      },
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual(devices);
  });

  describe('error scenarios', () => {
    // Error scenario tests can be added here
    it('should handle repository errors gracefully', async () => {
      // Arrange: create a repo that throws when listing
      const deviceRepo = {
        list: async () => {
          throw new Error('repository failure');
        },
        getById: async (_id: string) => null,
        save: async (d: Device) => d,
        delete: async (_id: string) => {},
      } as unknown as DeviceRepo;

      // Act
      const result = await listDevices({
        deviceRepo,
        authContext: {
          authenticated: false,
          scopes: [],
          subject: undefined,
        },
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('repository failure');
    });
  });
});

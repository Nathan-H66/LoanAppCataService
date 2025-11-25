import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';
import type { AuthContext } from './auth-context';

export type ListDevicesDeps = {
  deviceRepo: DeviceRepo;
  authContext: AuthContext;
};

// DTO for listing devices
export type DeviceListItem = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export type ListDevicesResult = {
  success: boolean;
  data?: DeviceListItem[];
  error?: string;
};

/**
 * Create a use-case for listing devices.
 * Usage:
 *   const result = await listDevices({ deviceRepo, authContext });
 */
export async function listDevices(
  deps: ListDevicesDeps
): Promise<ListDevicesResult> {
  const { deviceRepo, authContext } = deps;

  try {
    const devices = await deviceRepo.list();

    // Map devices to DTO format
    const processedDevices: DeviceListItem[] = devices.map((device) => ({
      id: device.id,
      name: device.name,
      description: device.description,
      category: device.category,
    }));

    return { success: true, data: processedDevices };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
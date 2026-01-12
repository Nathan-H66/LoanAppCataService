import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';
import type { AuthContext } from './auth-context';
import { Logger } from './logger';

export type ListDevicesDeps = {
  deviceRepo: DeviceRepo;
  authContext: AuthContext;
  logger?: Logger;
};

// DTO for listing devices
export type DeviceListItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
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

  deps.logger?.info?.('Listing devices');
  try {
    const devices = await deviceRepo.list();
    deps.logger?.debug?.(`Fetched ${devices.length} devices`);
    const processedDevices: DeviceListItem[] = devices.map((device) => ({
      id: device.id,
      name: device.name,
      description: device.description,
      category: device.category,
      quantity: device.quantity,
    }));
    deps.logger?.debug?.(`Mapped ${processedDevices.length} devices to DTO`);
    return { success: true, data: processedDevices };
  } catch (error) {
    deps.logger?.error?.(`Error listing devices: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
}

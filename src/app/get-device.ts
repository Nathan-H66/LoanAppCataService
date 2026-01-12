import type { DeviceRepo } from '../domain/device-repo';
import type { Device } from '../domain/device';
import { Logger } from './logger';

export type getDeviceByIdDeps = {
  deviceRepo: DeviceRepo;
  logger?: Logger;
};

export type getDeviceByIdResult = {
  success: boolean;
  data?: Device;
  error?: string;
};

export async function getDeviceById(
  deps: getDeviceByIdDeps,
  id: string
): Promise<getDeviceByIdResult> {
  deps.logger?.info?.(`Attempting to fetch device with id: ${id}`);
  try {
    const device = await deps.deviceRepo.getById(id);
    if (!device) {
      deps.logger?.warn?.(`Device not found for id: ${id}`);
      return { success: false, error: 'Device not found' };
    }
    deps.logger?.info?.(`Device found for id: ${id}`);
    return { success: true, data: device };
  } catch (error) {
    deps.logger?.error?.(
      `Error fetching device with id: ${id}: ${(error as Error).message}`
    );
    return { success: false, error: (error as Error).message };
  }
}

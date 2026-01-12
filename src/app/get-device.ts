import type { DeviceRepo } from '../domain/device-repo';
import type { Device } from '../domain/device';
import { Logger } from './logger';

export type GetDeviceByIdDeps = {
  deviceRepo: DeviceRepo;
  logger?: Logger;
};

export type GetDeviceByIdResult = {
  success: boolean;
  data?: Device;
  error?: string;
};

export async function getDeviceById(
  deps: GetDeviceByIdDeps,
  id: string
): Promise<GetDeviceByIdResult> {
  try {
    const device = await deps.deviceRepo.getById(id);
    if (!device) {
      return { success: false, error: 'Device not found' };
    }
    deps.logger.info(`Fetched device with id: ${id}`);
    return { success: true, data: device };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

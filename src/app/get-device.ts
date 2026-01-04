import type { DeviceRepo } from '../domain/device-repo';
import type { Device } from '../domain/device';

export type GetDeviceByIdDeps = {
  deviceRepo: DeviceRepo;
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
    return { success: true, data: device };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

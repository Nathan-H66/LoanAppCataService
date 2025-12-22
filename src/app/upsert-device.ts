import {
  DeviceUpdatedNotifier,
  DeviceUpdatedDto,
} from './device-updated-notifier';
import { Device, createDevice, DeviceParams } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

export type UpsertDeviceDeps = {
  deviceRepo: DeviceRepo;
  deviceUpdatedNotifier: DeviceUpdatedNotifier;
};

export type UpsertDeviceCommand = {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
};

export type UpsertDeviceResult = {
  success: boolean;
  data?: Device;
  error?: string;
};

/**
 * Create a use-case for upserting a device.
 * This will create a new device or update an existing one.
 * Usage:
 *   const result = await upsertDevice({ deviceRepo, deviceUpdatedNotifier }, deviceData);
 */
export async function upsertDevice(
  deps: UpsertDeviceDeps,
  command: UpsertDeviceCommand
): Promise<UpsertDeviceResult> {
  const { deviceRepo } = deps;

  try {
    // Validate and create the device entity
    const device = createDevice({
      id: command.id,
      name: command.name,
      description: command.description,
      category: command.category,
      quantity: command.quantity,
    });

    // Save (upsert) the device
    await deviceRepo.save(device);

    // Notify about the device update
    const dto: DeviceUpdatedDto = {
      id: device.id,
      name: device.name,
      description: device.description,
      category: device.category,
      quantity: device.quantity,
      updatedAt: new Date().toISOString(),
    };
    await deps.deviceUpdatedNotifier.notifyDeviceUpdated(dto);

    return { success: true, data: device };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

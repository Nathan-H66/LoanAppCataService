import type { Device } from './device';

export interface DeviceRepo {
  //Handles creating and saving a new device
  save(device: Device): Promise<void>;
  //Retrieves a device by its ID, returning null if not found
  getById(id: string): Promise<Device | null>;
  //Lists all devices in the repository
  list(): Promise<Device[]>;
  //Removes a device by its ID
  delete(id: string): Promise<void>;
}
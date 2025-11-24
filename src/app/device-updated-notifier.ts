// DTO for device update notification event
export type DeviceUpdatedDto = {
  id: string;
  name: string;
  description: string;
  category: string;
  updatedAt: string; // ISO string format
};

export interface DeviceUpdatedNotifier {
  notifyDeviceUpdated(device: DeviceUpdatedDto): Promise<void>;
}
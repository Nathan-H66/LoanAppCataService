import type {
  DeviceUpdatedNotifier,
  DeviceUpdatedDto,
} from '../app/device-updated-notifier';

export type HttpDeviceUpdatedNotifierOptions = {
  baseUrl: string;
  fetch: typeof fetch;
  hostKey?: string;
};

export class HttpDeviceUpdatedNotifier implements DeviceUpdatedNotifier {
  private baseUrl: string;
  private fetchFn: typeof fetch;
  private hostKey?: string;

  constructor(options: HttpDeviceUpdatedNotifierOptions) {
    this.baseUrl = options.baseUrl;
    this.fetchFn = options.fetch;
    this.hostKey = options.hostKey?.trim() ? options.hostKey : undefined;
  }

  async notifyDeviceUpdated(device: DeviceUpdatedDto): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.hostKey) {
      headers['x-functions-key'] = this.hostKey;
    }

    await this.fetchFn(`${this.baseUrl}/integration/events/device-updated`, {
      method: 'POST',
      headers,
      body: JSON.stringify(device),
    });
  }
}
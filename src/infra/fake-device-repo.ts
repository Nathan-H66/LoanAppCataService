import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

/**
 * Fake in-memory implementation of DeviceRepo for tests and local dev.
 * Not safe for concurrency across processes — intended as a fake.
 */
export class FakeDeviceRepo implements DeviceRepo {
  private store: Map<string, Device> = new Map();

  constructor(initial: Device[] = []) {
    for (const d of initial) this.store.set(d.id, { ...d });
  }

  async getById(id: string): Promise<Device | null> {
    const found = this.store.get(id) ?? null;
    // return a shallow clone to avoid accidental external mutation
    return found ? { ...found } : null;
  }

  async list(): Promise<Device[]> {
    return Array.from(this.store.values()).map((d) => ({ ...d }));
  }

  async save(device: Device): Promise<void> {
    // upsert semantics: store the device
    this.store.set(device.id, { ...device });
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
import { CosmosClient, Container } from '@azure/cosmos';
import type { Device } from '../domain/device';
import type { DeviceRepo } from '../domain/device-repo';

// Internal DTO type for Cosmos DB container shape
type DeviceDTO = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type CosmosDeviceRepoOptions = {
  endpoint: string;
  databaseId: string;
  containerId: string;
  key?: string;
};

export class CosmosDeviceRepo implements DeviceRepo {
  private container: Container;

  constructor(options: CosmosDeviceRepoOptions) {
    const client = options.key
      ? new CosmosClient({ endpoint: options.endpoint, key: options.key })
      : new CosmosClient({ endpoint: options.endpoint });
    const db = client.database(options.databaseId);
    this.container = db.container(options.containerId);
  }

  private toDTO(device: Device): DeviceDTO {
    return {
      id: device.id,
      name: device.name,
      description: device.description,
      category: device.category,
    };
  }

  private fromDTO(dto: DeviceDTO): Device {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      category: dto.category,
    };
  }

  async save(device: Device): Promise<void> {
    const dto = this.toDTO(device);
    await this.container.items.upsert(dto);
  }

  async getById(id: string): Promise<Device | null> {
    try {
      const { resource } = await this.container.item(id, id).read<DeviceDTO>();
      return resource ? this.fromDTO(resource) : null;
    } catch (err: any) {
      if (err.code === 404) return null;
      throw err;
    }
  }

  async list(): Promise<Device[]> {
    const query = 'SELECT * FROM c';
    const { resources } = await this.container.items
      .query<DeviceDTO>(query)
      .fetchAll();
    return resources.map((dto) => this.fromDTO(dto));
  }

  async delete(id: string): Promise<void> {
    await this.container.item(id, id).delete();
  }
}
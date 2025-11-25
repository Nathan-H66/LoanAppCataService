// Device type definition
export type Device = {
  id: string;
  name: string;
  description: string;
  category: string;
};

// Parameter object type for device creation
export type DeviceParams = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export class DeviceError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'DeviceError';
  }
}

// Factory function to create a Device with validation
export function createDevice(params: DeviceParams): Device {
  const { id, name, description, category } = params;

  if (!id || typeof id !== 'string') {
    throw new DeviceError('id', 'Device id is required and must be a string.');
  }
  if (!name || typeof name !== 'string') {
    throw new DeviceError(
      'name',
      'Device name is required and must be a string.'
    );
  }
  if (!description || typeof description !== 'string') {
    throw new DeviceError(
      'description',
      'Device description is required and must be a string.'
    );
  }
  if (!category || typeof category !== 'string') {
    throw new DeviceError(
      'category',
      'Device category is required and must be a string.'
    );
  }

  return Object.freeze({
    id,
    name,
    description,
    category,
  });
}
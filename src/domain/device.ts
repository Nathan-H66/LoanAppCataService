// Device type definition
export type Device = {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
};

// Parameter object type for device creation
export type DeviceParams = {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
};

export class DeviceError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'DeviceError';
  }
}

// Factory function to create a Device with validation
export function createDevice(params: DeviceParams): Device {
  const { id, name, description, category, quantity } = params;

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

  if (
    quantity === undefined ||
    typeof quantity !== 'number' ||
    !Number.isFinite(quantity) ||
    quantity < 0
  ) {
    throw new DeviceError(
      'quantity',
      'Device quantity is required and must be a non-negative number.'
    );
  }

  return Object.freeze({
    id,
    name,
    description,
    category,
    quantity,
  });
}

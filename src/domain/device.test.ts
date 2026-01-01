import { describe, it, expect } from 'vitest';
import { createDevice, DeviceError } from './device';

describe('createDevice', () => {
  it('creates a valid device and returns a frozen object', () => {
    const device = createDevice({
      id: 'd-100',
      name: 'Test Device',
      description: 'A device used for tests',
      category: 'Test',
      quantity: 1,
    });

    expect(device.id).toBe('d-100');
    expect(device.name).toBe('Test Device');
    expect(Object.isFrozen(device)).toBe(true);
  });

  it('throws DeviceError when a required field is missing', () => {
    expect(() =>
      createDevice({
        id: 'd-101',
        name: '',
        description: 'x',
        category: 'c',
        quantity: 1,
      })
    ).toThrowError(DeviceError);
  });

  it('throws DeviceError for invalid quantity (negative)', () => {
    expect(() =>
      createDevice({
        id: 'd-102',
        name: 'N',
        description: 'x',
        category: 'c',
        quantity: -5,
      })
    ).toThrowError(DeviceError);
  });
});

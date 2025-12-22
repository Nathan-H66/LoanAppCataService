import type { DeviceParams } from '../domain/device';

export const seedDevices: DeviceParams[] = [
  {
    id: 'seed-001',
    name: 'Google Laptop',
    description: 'A seeded example device for local testing.',
    category: 'Laptop',
    quantity: 5,
  },
  {
    id: 'seed-002',
    name: 'Generic Laptop',
    description: 'Another seeded device to get you started.',
    category: 'Laptop',
    quantity: 8,
  },
  {
    id: 'seed-003',
    name: 'Generic Tablet',
    description: 'Test Device for Dev',
    category: 'Tablet',
    quantity: 10,
  },
];

export default seedDevices;

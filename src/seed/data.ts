import type { DeviceParams } from '../domain/device';

export const seedDevices: DeviceParams[] = [
  {
    id: 'seed-001',
    name: 'iPad Air',
    description: 'Lightweight tablet with 10.9-inch Liquid Retina display.',
    category: 'Tablet',
    quantity: 12,
  },
  {
    id: 'seed-002',
    name: 'Galaxy Tab S8',
    description: 'High-performance Android tablet with S Pen support.',
    category: 'Tablet',
    quantity: 7,
  },
  {
    id: 'seed-003',
    name: 'Surface Go',
    description: 'Compact 2-in-1 tablet for productivity and portability.',
    category: 'Tablet',
    quantity: 5,
  },
  {
    id: 'seed-004',
    name: 'iPhone 14',
    description:
      'Smartphone with advanced camera system and long battery life.',
    category: 'Phone',
    quantity: 20,
  },
  {
    id: 'seed-005',
    name: 'Pixel 7',
    description:
      'Google phone with clean Android experience and excellent camera.',
    category: 'Phone',
    quantity: 9,
  },
  {
    id: 'seed-006',
    name: 'Galaxy S23',
    description: 'Flagship Android phone with powerful performance.',
    category: 'Phone',
    quantity: 6,
  },
];

export default seedDevices;

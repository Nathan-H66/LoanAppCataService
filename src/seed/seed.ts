import { getDeviceRepo } from '../config/appServices';
import { createDevice, DeviceParams } from '../domain/device';
import seedDevices from './data';

async function run(): Promise<void> {
  const repo = getDeviceRepo();

  for (const params of seedDevices as DeviceParams[]) {
    try {
      const device = createDevice(params);
      await repo.save(device);
      // eslint-disable-next-line no-console
      console.log(`Saved device: ${device.id}`);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(`Failed to save device ${params.id}:`, err.message || err);
    }
  }
}

if (require.main === module) {
  run().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

export { run };

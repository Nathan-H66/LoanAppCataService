import { CosmosDeviceRepo } from '../infra/cosmos-device-repo';
import { DeviceRepo } from '../domain/device-repo';

let deviceRepoInstance: CosmosDeviceRepo | null = null;
// Config for cosmos to be added here
const COSMOS_OPTIONS = {
  endpoint: '',
  databaseId: '',
  containerId: '',
  key: process.env.COSMOS_KEY,
};

let cachedProductRepo: DeviceRepo | null = null;

export const getDeviceRepo = (): DeviceRepo => {
  if (!cachedDeviceRepo) {
    cachedDeviceRepo = new CosmosDeviceRepo(COSMOS_OPTIONS);
  }
  return cachedDeviceRepo;
};
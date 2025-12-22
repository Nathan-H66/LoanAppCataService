import { ListDevicesDeps } from '../app/list-devices';
import { UpsertDeviceDeps } from '../app/upsert-device';
import { DeviceRepo } from '../domain/device-repo';
import type { Device } from '../domain/device';
import { FakeDeviceRepo } from '../infra/fake-device-repo';
import { CosmosDeviceRepo } from '../infra/cosmos-device-repo';
import { DummyDeviceUpdatedNotifier } from '../infra/dummy-device-updated-notifier';
import { HttpDeviceUpdatedNotifier } from '../infra/http-device-updated-notifier';
import { DeviceUpdatedNotifier } from '../app/device-updated-notifier';
import { OAuth2Validator } from '../infra/oauth2-validator';
import type { AuthContext } from '../app/auth-context';
import type { HttpRequest } from '@azure/functions';

let cachedDeviceUpdatedNotifier: DeviceUpdatedNotifier | null = null;

export const getDeviceUpdatedNotifier = (): DeviceUpdatedNotifier => {
  if (!cachedDeviceUpdatedNotifier) {
    const baseUrl = process.env.DEVICE_UPDATED_BASE_URL;
    if (baseUrl && baseUrl.trim() !== '') {
      const hostKey = process.env.DEVICE_UPDATED_KEY;
      cachedDeviceUpdatedNotifier = new HttpDeviceUpdatedNotifier({
        baseUrl,
        fetch: (globalThis as any).fetch,
        hostKey,
      });
    } else {
      cachedDeviceUpdatedNotifier = new DummyDeviceUpdatedNotifier();
    }
  }
  return cachedDeviceUpdatedNotifier;
};

let cachedDeviceRepo: DeviceRepo | null = null;

export const getDeviceRepo = (): DeviceRepo => {
  if (!cachedDeviceRepo) {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const databaseId = process.env.COSMOS_DATABASE;
    const containerId = process.env.COSMOS_CONTAINER;
    const key = process.env.COSMOS_KEY;

    if (endpoint && databaseId && containerId) {
      // Construct a Cosmos-backed repo when the required env vars are present
      cachedDeviceRepo = new CosmosDeviceRepo({
        endpoint,
        databaseId,
        containerId,
        key,
      });
    } else {
      // Fallback to in-memory seeded FakeDeviceRepo
      const initialDevices: Device[] = [
        {
          id: 'd-001',
          name: 'Seeded Smart Thermostat',
          category: 'HVAC',
          description: 'A seeded example device for local testing.',
          quantity: 5,
        },
        {
          id: 'd-002',
          name: 'Seeded Motion Sensor',
          category: 'Security',
          description: 'Another seeded device to get you started.',
          quantity: 2,
        },
      ];
      cachedDeviceRepo = new FakeDeviceRepo(initialDevices);
    }
  }
  return cachedDeviceRepo;
};

let cachedOAuth2Validator: OAuth2Validator | null = null;

export const getOAuth2Validator = (): OAuth2Validator | null => {
  if (!cachedOAuth2Validator) {
    const jwksUri = process.env.OAUTH2_JWKS_URI;
    const issuer = process.env.OAUTH2_ISSUER;
    const audience = process.env.OAUTH2_AUDIENCE;

    if (jwksUri && issuer && audience) {
      cachedOAuth2Validator = new OAuth2Validator({
        jwksUri,
        issuer,
        audience,
      });
    }
  }
  return cachedOAuth2Validator;
};

export const makeListDevicesDeps = async (
  request: HttpRequest
): Promise<ListDevicesDeps> => {
  // Validate OAuth2 token if validator is configured
  const validator = getOAuth2Validator();
  const authContext: AuthContext = validator
    ? await validator.validate(request)
    : { authenticated: false, scopes: [] };

  return {
    deviceRepo: getDeviceRepo(),
    authContext,
  };
};

export const makeUpsertDeviceDeps = (): UpsertDeviceDeps => ({
  deviceRepo: getDeviceRepo(),
  deviceUpdatedNotifier: getDeviceUpdatedNotifier(),
});

let cachedProductRepo: CosmosDeviceRepo | null = null;

// Lazy singleton accessor for a CosmosDeviceRepo. Options are hard-coded
// except for the Cosmos key which is read from `process.env.COSMOS_KEY`.
export const getProductRepo = (): CosmosDeviceRepo => {
  if (!cachedProductRepo) {
    const options = {
      endpoint: process.env.COSMOS_ENDPOINT,
      databaseId: process.env.COSMOS_DATABASE,
      containerId: process.env.COSMOS_CONTAINER,
      key: process.env.COSMOS_KEY,
    };

    cachedProductRepo = new CosmosDeviceRepo(options);
  }
  return cachedProductRepo;
};

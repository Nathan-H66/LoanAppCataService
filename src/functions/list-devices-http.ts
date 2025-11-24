import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { listDevices } from '../app/list-devices';
import { makeListDevicesDeps } from '../config/appServices';

const listDevicesHandler = async (
  request: HttpRequest
): Promise<HttpResponseInit> => {
  const deps = await makeListDevicesDeps(request);
  const result = await listDevices(deps);

  if (!result.success) {
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: 'Failed to list devices',
        error: result.error,
      },
    };
  }

  const devices = result.data ?? [];
  return {
    status: 200,
    jsonBody: devices,
  };
};

app.http('listDevicesHttp', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'devices',
  handler: listDevicesHandler,
});
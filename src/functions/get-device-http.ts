import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { getDeviceById } from '../app/get-device';
import { getDeviceRepo } from '../config/appServices';

const getDeviceHandler = async (
  request: HttpRequest
): Promise<HttpResponseInit> => {
  const id = request.params['id'];
  if (!id) {
    return {
      status: 400,
      jsonBody: {
        success: false,
        message: 'Device id is required in route',
      },
    };
  }

  const result = await getDeviceById({ deviceRepo: getDeviceRepo() }, id);
  if (!result.success) {
    return {
      status: 404,
      jsonBody: {
        success: false,
        message: result.error || 'Device not found',
      },
    };
  }

  return {
    status: 200,
    jsonBody: result.data,
  };
};

app.http('getDeviceHttp', {
  methods: ['GET'],
  authLevel: 'function',
  route: 'devices/{id}',
  handler: getDeviceHandler,
});

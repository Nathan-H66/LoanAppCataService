import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { getDeviceById } from '../app/get-device';
import { getDeviceRepo, makeGetDeviceDeps } from '../config/appServices';

export const getDeviceHandler = async (
  request: HttpRequest,
  context: InvocationContext
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
  const deps = makeGetDeviceDeps(context);
  const result = await getDeviceById(deps, id);
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

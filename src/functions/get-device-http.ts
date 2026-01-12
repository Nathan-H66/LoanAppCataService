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
  context.log('TEST LOG: Handler invoked');
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
  // Create a logger using context.log
  const logger = {
    info: (msg: string) => context.log(msg),
    warn: (msg: string) => context.log(`WARN: ${msg}`),
    error: (msg: string) => context.log(`ERROR: ${msg}`),
    debug: (msg: string) => context.log(`DEBUG: ${msg}`),
    trace: (msg: string) => context.log(`TRACE: ${msg}`),
  };
  // Pass logger to dependency factory
  const deps = makeGetDeviceDeps(logger);
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

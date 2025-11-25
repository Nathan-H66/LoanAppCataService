import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { upsertDevice } from '../app/upsert-device';
import { makeUpsertDeviceDeps } from '../config/appServices';

const upsertDeviceHandler = async (
  request: HttpRequest
): Promise<HttpResponseInit> => {
  try {
    const body = (await request.json()) as any;

    // Validate required fields
    if (!body || typeof body !== 'object') {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: 'Request body is required',
        },
      };
    }

    const { id, name, description, category } = body;

    if (!id || !name || !description || !category) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: 'Missing required fields: id, name, description, category',
        },
      };
    }

    const deps = makeUpsertDeviceDeps();
    const result = await upsertDevice(deps, {
      id,
      name,
      description,
      category,
    });

    if (!result.success) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: 'Failed to upsert device',
          error: result.error,
        },
      };
    }

    return {
      status: 200,
      jsonBody: result.data,
    };
  } catch (error) {
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: 'Internal server error',
        error: (error as Error).message,
      },
    };
  }
};

app.http('upsertDeviceHttp', {
  methods: ['PUT', 'POST'],
  authLevel: 'function',
  route: 'devices',
  handler: upsertDeviceHandler,
});
import { describe, it, expect } from 'vitest';
import { getOAuth2Validator } from '../config/appServices';

describe('getOAuth2Validator', () => {
  it('returns null if env vars are missing', () => {
    const oldEnv = { ...process.env };
    delete process.env.OAUTH2_JWKS_URI;
    delete process.env.OAUTH2_ISSUER;
    delete process.env.OAUTH2_AUDIENCE;
    expect(getOAuth2Validator()).toBeNull();
    process.env = oldEnv;
  });

  it('returns an OAuth2Validator if env vars are set', () => {
    const oldEnv = { ...process.env };
    process.env.OAUTH2_JWKS_URI = 'https://example.com/.well-known/jwks.json';
    process.env.OAUTH2_ISSUER = 'https://example.com/';
    process.env.OAUTH2_AUDIENCE = 'test-audience';
    const validator = getOAuth2Validator();
    expect(validator).toBeTruthy();
    process.env = oldEnv;
  });
});

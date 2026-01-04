import { describe, it, expect } from 'vitest';
import { OAuth2Validator } from './oauth2-validator';

// Dummy config for constructor
const options = {
  jwksUri: 'https://example.com/.well-known/jwks.json',
  issuer: 'https://example.com/',
  audience: 'test-audience',
};

describe('OAuth2Validator', () => {
  it('should construct with valid options', () => {
    const validator = new OAuth2Validator(options);
    expect(validator).toBeInstanceOf(OAuth2Validator);
  });

  it('should return null if no Authorization header', () => {
    const validator = new OAuth2Validator(options);
    // @ts-expect-error minimal mock
    const req = { headers: new Map() };
    // @ts-ignore
    expect(validator['extractToken'](req)).toBeNull();
  });

  it('should return null if Authorization header is malformed', () => {
    const validator = new OAuth2Validator(options);
    // @ts-expect-error minimal mock
    const req = { headers: new Map([['authorization', 'Basic abc']]) };
    // @ts-ignore
    expect(validator['extractToken'](req)).toBeNull();
  });

  it('should extract token from valid Bearer header', () => {
    const validator = new OAuth2Validator(options);
    // @ts-expect-error minimal mock
    const req = { headers: new Map([['authorization', 'Bearer mytoken']]) };
    // @ts-ignore
    expect(validator['extractToken'](req)).toBe('mytoken');
  });
});

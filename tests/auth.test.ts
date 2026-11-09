import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '../lib/validations/auth.schema.ts';

describe('Authentication Validation and Hashing', () => {
  it('should validate a valid registration payload', () => {
    const valid = {
      name: 'Ranit Saha',
      email: 'ranit@example.com',
      password: 'password123',
    };
    const res = registerSchema.safeParse(valid);
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.name, 'Ranit Saha');
      assert.equal(res.data.email, 'ranit@example.com');
    }
  });

  it('should reject registration with invalid email', () => {
    const invalid = {
      name: 'Ranit Saha',
      email: 'not-an-email',
      password: 'password123',
    };
    const res = registerSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });

  it('should reject registration with password shorter than 6 characters', () => {
    const invalid = {
      name: 'Ranit Saha',
      email: 'ranit@example.com',
      password: '123',
    };
    const res = registerSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });

  it('should validate valid login credentials', () => {
    const valid = {
      email: 'RANIT@EXAMPLE.COM',
      password: 'mypassword',
    };
    const res = loginSchema.safeParse(valid);
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.email, 'ranit@example.com'); // normalized
    }
  });

  it('should hash password and verify with bcrypt correctly', async () => {
    const rawPassword = 'superSecretPassword!';
    const hash = await bcrypt.hash(rawPassword, 10);

    assert.notEqual(hash, rawPassword);
    const isMatch = await bcrypt.compare(rawPassword, hash);
    assert.equal(isMatch, true);

    const isWrongMatch = await bcrypt.compare('wrongPassword', hash);
    assert.equal(isWrongMatch, false);
  });
});

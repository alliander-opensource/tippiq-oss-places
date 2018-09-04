import { email, password, minLength, required } from './validation';

describe('email validation', () => {
  it('should raise an error on invalid email', () => {
    expect(email('test')).toBe('Invalid email address');
  });

  it('should not raise an error on valid email', () => {
    expect(email('test@test.com')).toBe('');
  });
});

describe('password validation', () => {
  it('should raise an error on invalid password', () => {
    expect(password('test')).toBe('Invalid password');
  });

  it('should not raise an error on valid password', () => {
    expect(password('test123ABC')).toBe('');
  });
});

describe('required validation', () => {
  it('should raise an error on empty value', () => {
    expect(required('')).toBe('Required');
  });

  it('should not raise an error on valid input', () => {
    expect(required('test')).toBe('');
  });
});

describe('min length validation', () => {
  it('should raise an error on too short value', () => {
    expect(minLength(8)('test')).toBe('Must be at least 8 characters');
  });

  it('should not raise an error on valid input', () => {
    expect(minLength(4)('test')).toBe('');
  });
});

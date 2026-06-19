import { describe, expect, it } from 'vitest';
import { ROUTES } from './constants/routes';

describe('route constants', () => {
  it('defines core auth routes', () => {
    expect(ROUTES.SIGNIN).toBe('/signin');
    expect(ROUTES.SIGNUP).toBe('/signup');
    expect(ROUTES.RESET_PASSWORD).toBe('/reset-password');
  });

  it('defines course routes', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.COURSE_DETAIL).toContain('/courses/');
  });
});

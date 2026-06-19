import { describe, expect, it } from 'vitest';
import axiosClient from '@/lib/api';

describe('axiosClient', () => {
  it('uses credentialed requests and has a baseURL', () => {
    expect(axiosClient.defaults.withCredentials).toBe(true);
    expect(axiosClient.defaults.baseURL).toBeTruthy();
  });

  it('registers request and response interceptors', () => {
    expect(axiosClient.interceptors.request.handlers.length).toBeGreaterThan(0);
    expect(axiosClient.interceptors.response.handlers.length).toBeGreaterThan(0);
  });
});

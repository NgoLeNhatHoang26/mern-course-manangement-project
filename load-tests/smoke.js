import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://course-management-api-yozg.onrender.com';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    checks: ['rate>0.99'],
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const healthRes = http.get(`${BASE_URL}/health`, {
    tags: { endpoint: 'health' },
  });

  check(healthRes, {
    'health status 200': (r) => r.status === 200,
    'health body has status UP': (r) => {
      try {
        const body = r.json();
        return body?.status === 'UP' || body?.data?.status === 'UP';
      } catch {
        return false;
      }
    },
  });

  const coursesRes = http.get(`${BASE_URL}/api/courses?page=1&limit=12`, {
    tags: { endpoint: 'courses_list' },
  });

  check(coursesRes, {
    'courses list status 200': (r) => r.status === 200,
  });

  sleep(1);
}

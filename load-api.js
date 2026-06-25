import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://course-management-api-yozg.onrender.com';
const EMAIL = __ENV.EMAIL || 'JonSnow@gmail.com';
const PASSWORD = __ENV.PASSWORD || 'jon123';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.05'],      
    http_req_duration: ['p(95)<1200'], 
  },
  scenarios: {
    browse_courses: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '30s', target: 0 },
      ],
      exec: 'browseCourses',
    },
    auth_me: {
      executor: 'constant-vus',
      vus: 10,
      duration: '2m',
      exec: 'getMe',
      startTime: '30s',
    },
  },
};

let accessToken = '';

export function setup() {

    // 1. Warmup — đúng URL
    const warmup = http.get(`${BASE_URL}/health`);
    console.log(`Warmup status: ${warmup.status}`);
    // 2. Login một lần
    const loginRes = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({ email: EMAIL, password: PASSWORD }),
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: '120s',
      }
    );
    console.log(`Login status: ${loginRes.status}`);
    console.log(`Login body: ${loginRes.body}`);
    check(loginRes, {
      'login status 200': (r) => r.status === 200,
    });
    const body = loginRes.json();
    const token = body?.data?.token || '';
    return { token };
}

export function browseCourses() {
  const res = http.get(`${BASE_URL}/api/courses?page=1&limit=12`);
  check(res, {
    'courses status 200': (r) => r.status === 200,
  });
  sleep(1);
}

export function getMe(data) {
  const token = data?.token || accessToken;
  if (!token) {
    sleep(1);
    return;
  }

  const res = http.get(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    'auth/me status 200': (r) => r.status === 200,
  });
  sleep(1);
}
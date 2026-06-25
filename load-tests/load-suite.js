import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://course-management-api-yozg.onrender.com';
const EMAIL = __ENV.EMAIL || '';
const PASSWORD = __ENV.PASSWORD || '';

export const options = {
  scenarios: {
    critical_paths: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '20s', target: 3 },
        { duration: '1m', target: 3 },
        { duration: '20s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    'http_req_duration{endpoint:courses_list}': ['p(95)<500'],
    'http_req_duration{endpoint:course_detail}': ['p(95)<600'],
    'http_req_duration{endpoint:auth_me}': ['p(95)<600'],
    'checks{endpoint:courses_list}': ['rate>0.85'],
    http_req_failed: ['rate<0.20'],
  },
};

function unwrapData(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  return payload;
}

function pickCourseId(payload) {
  const data = unwrapData(payload);
  if (Array.isArray(data) && data.length > 0) {
    return data[0]._id || data[0].id || '';
  }
  if (data?.courses?.length) {
    return data.courses[0]._id || data.courses[0].id || '';
  }
  if (data?.items?.length) {
    return data.items[0]._id || data.items[0].id || '';
  }
  return '';
}

export function setup() {
  const warmup = http.get(`${BASE_URL}/health`, { tags: { endpoint: 'health' } });
  console.log(`[setup] warmup status=${warmup.status}`);

  let token = '';
  let courseId = '';

  if (EMAIL && PASSWORD) {
    const loginRes = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({ email: EMAIL, password: PASSWORD }),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { endpoint: 'auth_login' },
        timeout: '120s',
      },
    );

    console.log(`[setup] login status=${loginRes.status}`);
    if (loginRes.status !== 200) {
      console.log(`[setup] login body=${loginRes.body}`);
    } else {
      const loginBody = loginRes.json();
      token = unwrapData(loginBody)?.token || loginBody?.token || '';
    }
  } else {
    console.log('[setup] EMAIL/PASSWORD not set — skipping authenticated endpoints');
  }

  const coursesRes = http.get(`${BASE_URL}/api/courses?page=1&limit=12`, {
    tags: { endpoint: 'courses_list' },
  });

  if (coursesRes.status === 200) {
    try {
      courseId = pickCourseId(coursesRes.json());
    } catch {
      courseId = '';
    }
  }

  console.log(`[setup] courseId=${courseId || '(none)'}`);
  return { token, courseId };
}

function browseCoursesList() {
  const res = http.get(`${BASE_URL}/api/courses?page=1&limit=12`, {
    tags: { endpoint: 'courses_list' },
  });

  check(res, {
    'courses list status 200': (r) => r.status === 200,
  }, { endpoint: 'courses_list' });
}

function browseCourseDetail(courseId) {
  const res = http.get(`${BASE_URL}/api/courses/${courseId}`, {
    tags: { endpoint: 'course_detail' },
  });

  check(res, {
    'course detail status 200': (r) => r.status === 200,
  }, { endpoint: 'course_detail' });
}

function readAuthMe(token) {
  const res = http.get(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    tags: { endpoint: 'auth_me' },
  });

  check(res, {
    'auth/me status 200': (r) => r.status === 200,
  }, { endpoint: 'auth_me' });
}

function readMyEnrollments(token) {
  const res = http.get(`${BASE_URL}/api/enrollments/me`, {
    headers: { Authorization: `Bearer ${token}` },
    tags: { endpoint: 'enrollments_me' },
  });

  check(res, {
    'enrollments/me status 200': (r) => r.status === 200,
  }, { endpoint: 'enrollments_me' });
}

export default function (data) {
  const token = data?.token || '';
  const courseId = data?.courseId || '';
  const roll = Math.random();

  if (roll < 0.6) {
    browseCoursesList();
  } else if (roll < 0.85 && courseId) {
    browseCourseDetail(courseId);
  } else if (roll < 0.93 && token) {
    readAuthMe(token);
  } else if (token) {
    readMyEnrollments(token);
  } else {
    browseCoursesList();
  }

  sleep(2);
}

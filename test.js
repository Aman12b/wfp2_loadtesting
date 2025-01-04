import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const options = {
    stages: [
        { duration: '20s', target: 100 },
        { duration: '20s', target: 500 },
        { duration: '20s', target: 1000 },
        { duration: '20s', target: 1500 },
        { duration: '20s', target: 2000 },
        { duration: '20s', target: 2500 },
        { duration: '20s', target: 3000 },
        { duration: '20s', target: 3500 },
        { duration: '20s', target: 4000 },
    ],
};

const Env = {
    monolithURL: 'http://192.168.0.170:8080/stats',
    kubernetesURL: 'http://192.168.0.180/stats',
};

function generatePayload() {
    return JSON.stringify({
        numbers: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
    });
}

function testService(url) {
    const payload = generatePayload();
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);

    check(res, {
        [`${url} status is 200`]: (r) => r.status === 200,
        [`${url} response time < 500ms`]: (r) => r.timings.duration < 500,
    });
}

export default function () {
    const serviceType = __ENV.TYPE; E

    switch (serviceType) {
        case '1': // Monolith
            testService(Env.monolithURL);
            break;
        case '2': // Kubernetes
            testService(Env.kubernetesURL);
            break;
        default:
            console.error('Invalid TYPE. Use 1 for Monolith and 2 for Kubernetes.');
            break;
    }

    sleep(1);
}

import http from "k6/http";
import { check, sleep } from "k6";

const monolithURL = "http://192.168.0.170:8080/stats";
const kubernetesURL = "http://192.168.0.180/stats";

const serviceType = __ENV.TYPE;

export default function () {
    const url = serviceType === "1" ? monolithURL : kubernetesURL;

    const payload = JSON.stringify({
        numbers: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
    });

    const params = { headers: { "Content-Type": "application/json" } };

    const res = http.post(url, payload, params);

    check(res, {
        "status is 200": (r) => r.status === 200,
        "response time < 500ms": (r) => r.timings.duration < 500,
    });

    sleep(1);
}

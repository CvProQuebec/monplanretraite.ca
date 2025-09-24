import http from "k6/http";
import { sleep, check } from "k6";

const BASE_URL = __ENV.K6_BASE_URL || "http://127.0.0.1:4173";

export const options = {
  scenarios: {
    smoke: {
      executor: "constant-vus",
      vus: Number(__ENV.K6_VUS || 10),
      duration: __ENV.K6_DURATION || "30s"
    }
  },
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.01"]
  }
};

export default function () {
  const pages = ["/", "/wizard/profil", "/outils", "/planification-urgence"];
  for (const path of pages) {
    const response = http.get(`${BASE_URL}${path}`);
    check(response, {
      [`${path} status 200`]: res => res.status === 200,
      [`${path} body`]: res => res.body && res.body.length > 0
    });
  }
  sleep(1);
}

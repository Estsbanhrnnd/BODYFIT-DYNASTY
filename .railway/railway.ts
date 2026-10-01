import { defineRailway, project, service } from "railway/iac";

// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "BodyFit-Dynasty-Mobile";

export default defineRailway(() => {
  const BodyFit_Dynasty_Mobile = service("BodyFit-Dynasty-Mobile", {
    healthcheck: "/api/healthz",
    healthcheckTimeout: 120,
    // dockerfilePath from CaC: "artifacts/api-server/Dockerfile"
    // builder from CaC: "DOCKERFILE"
  });
  return project("bodyfit-dynasty", {
    resources: [BodyFit_Dynasty_Mobile],
  });
});

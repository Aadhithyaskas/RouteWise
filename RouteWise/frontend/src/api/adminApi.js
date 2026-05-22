import API from "./api";

export const assignJob = (data) =>
  API.post("/admin-api/assign-job/", data);

export const getSalespersonJobs = (id) =>
  API.get(`/admin-api/salesperson/${id}/jobs/`);

export const updateSalespersonLocation = (data) =>
  API.post("/admin-api/salesperson/update-location/", data);

export const getNearbyCustomers = (spId) =>
  API.get(`/admin-api/salesperson/${spId}/nearby-customers/`);

export const setThresholds = (spId, data) =>
  API.post(`/admin-api/salesperson/${spId}/threshold/`, data);

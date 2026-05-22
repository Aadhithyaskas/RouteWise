import API from "./api";

export const submitCustomerRequest = (data) =>
  API.post("/customer-api/request/", data);

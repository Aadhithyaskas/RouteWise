import API from "./api";

export const registerUser = (data) =>
  API.post("/admin-api/auth/register/", data);

export const loginUser = (data) =>
  API.post("/admin-api/auth/login/", data);

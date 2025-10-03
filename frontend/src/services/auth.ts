import api from "./api";

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const res = await api.post("/usuarios/register/", {
    username,
    email,
    password,
  });
  return res.data;
}

export async function loginUser(identifier: string, password: string) {
  const res = await api.post(
    "/usuarios/login/",
    { identifier, password },
    { withCredentials: true }
  );
  return res.data;
}

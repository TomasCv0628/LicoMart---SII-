import api from "./api";

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

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

export async function logoutUser() {
  const res = await api.post("/usuarios/logout/");
  return res.data;
}

// Funciones para manejar el estado de autenticación en localStorage
export function saveUserToStorage(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
}

export function getUserFromStorage(): User | null {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function clearUserFromStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
}

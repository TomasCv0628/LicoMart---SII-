import { useState } from "react";
import {
  registerUser,
  loginUser,
  saveUserToStorage,
  type User,
} from "../services/auth";

type Props = {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
};

const AuthModal: React.FC<Props> = ({ visible, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    username: "",
    email: "",
  });
  const [error, setError] = useState("");

  if (!visible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        // Login con Axios
        console.log("Intentando login con:", form.identifier);
        const data = await loginUser(form.identifier, form.password);
        console.log("Respuesta del login:", data);
        if (data.success) {
          // Crear objeto usuario con los datos recibidos
          const user: User = {
            id: data.usuario_id,
            nombre: form.identifier,
            email: form.identifier.includes("@") ? form.identifier : "",
            rol: "usuario",
          };

          // Guardar usuario en localStorage
          saveUserToStorage(user);
          onLoginSuccess();
          onClose();
        } else {
          setError(data.error || "Error al iniciar sesión");
        }
      } else {
        // Registro con Axios
        const data = await registerUser(
          form.username,
          form.email,
          form.password
        );
        if (data.success) {
          setIsLogin(true); // Cambia a login tras registro exitoso
          setError(""); // Limpiar errores
        } else {
          setError(data.error || "Error al registrar");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        setError(`Error de conexión: ${error.message}`);
      } else {
        setError("Error de conexión");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1A1D21] p-6 rounded-xl w-full max-w-sm relative">
        <button className="absolute top-2 right-2 text-white" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-[#2563EB] font-bold text-lg mb-4">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isLogin ? (
            <>
              <input
                name="identifier"
                type="text"
                placeholder="Usuario o Email"
                value={form.identifier}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white border"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white border"
                required
              />
            </>
          ) : (
            <>
              <input
                name="username"
                type="text"
                placeholder="Usuario"
                value={form.username}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white border"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white border"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                className="p-2 rounded bg-black text-white border"
                required
              />
            </>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-[#2563EB] text-white py-2 rounded font-semibold"
          >
            {isLogin ? "Acceder" : "Registrarse"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-[#D97706] underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import { useState } from "react";
import { FaEyeSlash, FaEye, FaRegUser } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { MdOutlineMessage, MdOutlineEmail, MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthImagePattern } from "../components/AuthImagePattern";
import toast from "react-hot-toast";

export function Register() {
  const { signup, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor, introduce un correo electrónico válido.");
      return;
    }
    signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MdOutlineMessage className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Crear cuenta</h1>
              <p className="text-base-content/60">
                Comienza con tu cuenta gratuita
              </p>
            </div>
          </div>
          {/* Add form here */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaRegUser />
                </div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.fullName}
                  className="input input-bordered w-full pl-10 "
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdOutlineEmail />
                </div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  className="input input-bordered w-full pl-10 "
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdPassword />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={formData.password}
                  className="input input-bordered w-full pl-10 "
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={handleShowPassword}
                    className="focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <div className="flex items-center justify-center h-screen">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>
          <div className="text-center">
            <p
              className="text-base-content/60
            "
            >
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Bienvenido"
        subtitle="¡Únete a nuestra comunidad!"
      />
    </div>
  );
}

import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { MdOutlineMessage } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

export function Navbar() {
  const { authUser, logout } = useAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-200 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 ">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdOutlineMessage className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat Online</h1>
            </Link>
          </div>
          <div className="flex items-center gap2">
            <Link
              to="/settings"
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <IoSettingsOutline className="w-4 h-4" />
              <span className="hidden sm:inline">Configuracion</span>
            </Link>
            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm btn-ghost">
                  <FaRegUser className="size-5" />
                  Perfil
                </Link>
                <button onClick={logout} className="btn btn-sm btn-ghost">
                  <IoIosLogOut className="size-5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

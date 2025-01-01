import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!authUser && isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Add routes here */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Register /> : <Navigate to={"/"} />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

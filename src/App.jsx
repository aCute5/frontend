import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import RecipesPage from "./pages/recipes";
import MixItUp from "./pages/mixitup";
import ProtectedRoute from "./protectedRoute";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div
              className="text-xl font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              CookBook
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="ghost" onClick={() => navigate("/mixitup")}>
                Mix It Up!
              </Button>
              {token ? (
                <>
                  <Button variant="ghost" onClick={() => navigate("/recipes")}>
                    Le Mie Ricette
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<MixItUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/mixitup" element={<MixItUp />} />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import RecipesPage from "./pages/recipes";

const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold">CookBook</div>
            <div className="flex space-x-4">
              <Button variant="ghost">Le Mie Ricette</Button>
              <Button variant="ghost">Ricette Pubbliche</Button>
              <Button variant="ghost">Mix It Up!</Button>
            </div>
            <Button>Aggiungi Ricetta</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
                <CardDescription>
                  Tempo di preparazione: {recipe.prepTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{recipe.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Visualizza</Button>
                <Button variant="destructive">Elimina</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <RecipesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RecipesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

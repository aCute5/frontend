import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:5000/api/recipes?userId=${userId}`
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    try {
      await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRecipe,
          userId,
        }),
      });
      fetchRecipes();
      setNewRecipe({ title: "", ingredients: "", instructions: "" });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:5000/api/recipes/${id}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      await fetchRecipes(); // Ricarica le ricette dopo l'eliminazione
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 py-8">
      {/* Header */}
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#484848]">CookBook</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#ff9c00] text-white rounded-md hover:bg-[#ff9c00]/90"
          >
            Logout
          </button>
        </div>

        {/* Add Recipe Form */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
          <h2 className="text-2xl font-bold text-[#484848] mb-4">
            Add New Recipe
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#484848] mb-2">Title</label>
              <input
                type="text"
                value={newRecipe.title}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-[#484848] mb-2">Ingredients</label>
              <textarea
                value={newRecipe.ingredients}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, ingredients: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-[#484848] mb-2">Instructions</label>
              <textarea
                value={newRecipe.instructions}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, instructions: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                rows="3"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#129575] text-white rounded-md hover:bg-[#129575]/90"
            >
              Add Recipe
            </button>
          </form>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Placeholder per l'immagine */}
              <div className="h-48 bg-gray-200">
                {/* Qui potresti aggiungere un'immagine se disponibile */}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#484848] mb-2">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">By {recipe.email}</p>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-[#484848]">
                      Ingredients:
                    </h4>
                    <p className="text-gray-600">{recipe.ingredients}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#484848]">
                      Instructions:
                    </h4>
                    <p className="text-gray-600">{recipe.instructions}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="inline-block bg-[#129575] text-white px-3 py-1 rounded-full text-sm">
                    4.0
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

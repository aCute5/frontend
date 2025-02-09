// src/pages/MixItUp.jsx
import React, { useState, useEffect } from "react";

export default function MixItUp() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/recipes");
      const data = await response.json();
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 to-slate-100 py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#484848] mb-4">
            Mix It Up! 🍳
          </h1>
          <p className="text-xl text-gray-600">
            Explore creative recipes from our community
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#129575]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-[#129575]/20 to-[#129575]/10 flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#484848] mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Created by {recipe.email}
                  </p>
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
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      ⭐ Community Recipe
                    </span>
                    <span className="inline-block bg-[#129575] text-white px-3 py-1 rounded-full text-sm">
                      4.0
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

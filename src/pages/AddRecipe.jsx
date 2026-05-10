import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function AddRecipe() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const saved = JSON.parse(localStorage.getItem("customRecipes")) || [];

    const recipeToEdit = saved.find((r) => r.idMeal === id);

    if (recipeToEdit) {
      setTitle(recipeToEdit.strMeal);
      setImage(recipeToEdit.strMealThumb);
      setInstructions(recipeToEdit.strInstructions);
      setIngredients(recipeToEdit.customIngredients.join(", "));
    }
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();

    const newRecipe = {
      idMeal: id || Date.now().toString(),
      strMeal: title,
      strMealThumb: image,
      strInstructions: instructions,
      customIngredients: ingredients.split(",").map((item) => item.trim()),
    };

    const saved = JSON.parse(localStorage.getItem("customRecipes")) || [];

    let updatedRecipes;

    if (id) {
      // EDIT MODE
      updatedRecipes = saved.map((r) => (r.idMeal === id ? newRecipe : r));

      alert("Recipe updated!");
    } else {
      // ADD MODE
      updatedRecipes = [...saved, newRecipe];

      alert("Recipe added!");
    }

    localStorage.setItem("customRecipes", JSON.stringify(updatedRecipes));

    localStorage.setItem("userRecipes", JSON.stringify(updatedRecipes));

    navigate("/");
  }

  return (
    <div className="form-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>
      <h2 className="add-recipe">Add Your Recipe 🍳</h2>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />

        <textarea
          placeholder="Ingredients [comma seperated]"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <button type="submit">{id ? "Update Recipe" : "Add Recipe"}</button>
      </form>
    </div>
  );
}

export default AddRecipe;

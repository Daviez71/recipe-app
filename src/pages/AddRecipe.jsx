import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddRecipe() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    console.log("form Submitted");
    

    const newRecipe = {
      idMeal: Date.now().toString(),
      // unique id
      strMeal: title,
      strMealThumb: image,
      strInstructions: instructions,
      customIngredients: ingredients.split(",").map((item) => item.trim()),
    };
    const saved = JSON.parse(localStorage.getItem("customRecipes")) || [];
    localStorage.setItem(
      "customRecipes",
      JSON.stringify([...saved, newRecipe]),
    );

    const existing = 
    JSON.parse(localStorage.getItem("userRecipes")) || [];

    const updated = [...existing, newRecipe];

    localStorage.setItem("userRecipes", JSON.stringify(updated));

    alert("Recipe added!");

    navigate("/");
  }
  return (
    <div className="form-container">
      <h2>Add Your Recipe 🍳</h2>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input type="text" 
        placeholder="Image URL"
        value= {image}
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

        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipe;

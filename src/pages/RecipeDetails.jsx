import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();
  const [day, setDay] = useState("");
  const isCustom = recipe && recipe.customIngredients;

  useEffect(() => {
    const customRecipes =
      JSON.parse(localStorage.getItem("customRecipes")) || [];

    const found = customRecipes.find((r) => r.idMeal === id);

    if (found) {
      setRecipe(found);
    } else {
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response) => response.json())
        .then((data) => {
          setRecipe(data.meals ? data.meals[0] : null);
        });
    }
  }, [id]);
  // run when the page loads or id changes

  if (!recipe) return <div className="loader">Loading...</div>;

  let ingredients = [];

  if (recipe.customIngredients) {
    ingredients = recipe.customIngredients;
  } else {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        // skips empty values and prevents showing nonsense
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
  }

  function handleAddToPlan() {
    if (!day) {
      alert("Please select a day");
      return;
    }
    const existing = JSON.parse(localStorage.getItem("mealPlan")) || {};

    if (existing[day]) {
      const confirmReplace = window.confirm(
        `${day} already has a meal. Replace it`,
      );

      if (!confirmReplace) return;
    }
    const updatedPlan = {
      ...existing,
      [day]: recipe,
    };
    localStorage.setItem("mealPlan", JSON.stringify(updatedPlan));

    alert(`${recipe.strMeal} added to ${day}`);
  }

  function handleDelete(){
    const confirmDelete = window.confirm("Delete this recipe?");

    if (!confirmDelete) return;

    const saved = 
    JSON.parse(localStorage.getItem("customRecipes")) || [];

    const updated = saved.filter((r) => r.idMeal !== id);

    localStorage.setItem("customRecipes", JSON.stringify(updated));

    const user = 
    JSON.parse(localStorage.getItem("userRecipes")) || []

    const updatedUser = user.filter((r) => r.idMeal !== id);

    localStorage.setItem("userRecipes", JSON.stringify(updatedUser));

    alert("Recipe deleted")

    navigate("/")
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <h2>{recipe.strMeal}</h2>

      {isCustom && (
        <button onClick={handleDelete} className="delete-btn">
          Delete Recipe 🗑️
        </button>
      )}
      <img
        src={recipe.strMealThumb || "https://via.placeholder.com/300"}
        alt={recipe.strMeal}
        width="300"
        className="details-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300";
        }}
      />

      <div className="details-content">
        <h3>Ingredients</h3>
        <ol>
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="meal-planner">
        <h3>Plan this meal</h3>

        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="select-plan"
        >
          <option value="">Select a day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wedneeday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>

        <button onClick={handleAddToPlan} className="plan-btn">
          Add to Plan
        </button>
      </div>

      <div className="instructions">
        <h3>Instructions</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          {recipe.strInstructions || "No instructions provided"}
        </p>
      </div>
    </div>
  );
}

export default RecipeDetails;

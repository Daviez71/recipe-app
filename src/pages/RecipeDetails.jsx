import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();
  const [day, setDay] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
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
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};

    setRating(savedRatings[id] || 0);

    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];

    setComments(savedComments[id] || []);
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

  function handleAddToshoppingList() {
    const existing = JSON.parse(localStorage.getItem("shoppingList")) || [];

    const formattedIngredients = ingredients.map((item) => ({
      text: item,
      checked: false,
    }));

    const combined = [...existing, ...formattedIngredients];

    const updated = combined.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.text === item.text),
    );

    localStorage.setItem("shoppingList", JSON.stringify(updated));
    alert("ingredients added to shopping List 🛒");
  }

  function handleDelete() {
    const confirmDelete = window.confirm("Delete this recipe?");

    if (!confirmDelete) return;

    const saved = JSON.parse(localStorage.getItem("customRecipes")) || [];

    const updated = saved.filter((r) => r.idMeal !== id);

    localStorage.setItem("customRecipes", JSON.stringify(updated));

    const user = JSON.parse(localStorage.getItem("userRecipes")) || [];

    const updatedUser = user.filter((r) => r.idMeal !== id);

    localStorage.setItem("userRecipes", JSON.stringify(updatedUser));

    alert("Recipe deleted");

    navigate("/");
  }

  function handleRating(value) {
    setRating(value);
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};

    const updatedRatings = {
      ...savedRatings,
      [id]: value,
    };
    localStorage.setItem("ratings", JSON.stringify(updatedRatings));
  }

  function handleAddComment() {
    if (!comment.trim()) return;

    const updatedComments = [...comments, comment];

    setComments(updatedComments);

    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];

    savedComments[id] = updatedComments;

    localStorage.setItem("comments", JSON.stringify(savedComments));
    setComment("");
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <h2>{recipe.strMeal}</h2>
      <div className="rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            style={{
              cursor: "pointer",
              fontSize: "28px",
            }}
          >
            {star <= rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>

      {isCustom && (
        <button onClick={handleDelete} className="delete-btn">
          Delete Recipe 🗑️
        </button>
      )}

      {isCustom && (
        <button onClick={() => navigate(`/edit/${id}`)}>Edit ✏️</button>
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

        <button className="shopping-btn" onClick={handleAddToshoppingList}>
          🛒 Add Ingredients to Shopping List
        </button>
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
          <option value="Wednesday">Wednesday</option>
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

      <div className="comment-section">
        <h3>💬 Comments</h3>
        <div className="comment-input">
          <input type="text" 
          placeholder="write a comment..."
          value={comment}
          onChange={(e)=> setComment(e.target.value)}
          />
  <button onClick={handleAddComment}>
    Post
  </button>
        </div>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          <ul>
            {comments.map((c, index)=> (
              <li key={index}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;

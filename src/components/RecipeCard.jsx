import { Link } from "react-router-dom";

function RecipeCard({ recipe, toggleFavourite, isFavourite }) {
  return (
    <div className="recipe-card">
      <Link
        to={`/recipe/${recipe.idMeal}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <h3>{recipe.strMeal}</h3>

        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          width="200"
          onError={(e) => {
            e.target.onerror = null;
          }}
        />
      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavourite(recipe);
        }}
      >
        {isFavourite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

export default RecipeCard;

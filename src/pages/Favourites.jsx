import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("favourites");
    setFavourites(saved ? JSON.parse(saved) : []);
  }, []);

  function toggleFavourite(recipe) {
    const updated = favourites.filter(
        (item) => item.idMeal !== recipe.idMeal);

    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  }

  function clearFavourites(){
    const confirmClear = window.confirm("Clear all favourites");
    if(!confirmClear) return;

    setFavourites([]);
    localStorage.removeItem("favourites")
  }

  return (
    <div className="home">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <h2>My Favourites ❤️</h2>
      <button className="clear-btn" onClick={clearFavourites}>
         Clear Favourites 🧹
      </button>

      <div className="recipes-container">
        {favourites.length === 0 ? (
          <p className="empty-state">
            No favourites yet 😥
            </p>
        ) : (
          favourites.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              toggleFavourite={toggleFavourite}
              isFavourite={true}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Favourites;

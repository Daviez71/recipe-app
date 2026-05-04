import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { useNavigate } from "react-router-dom";

function Home() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.meals);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userRecipes, setUserRecipes] = useState([])

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  useEffect(()=> {
    const saved = localStorage.getItem("userRecipes");
    if(saved) {
      setUserRecipes(JSON.parse(saved))
    }
  }, [])

  function handleSearch() {
    if (!searchTerm) return;

    setHasSearched(true);
    setCategory("");
    setLoading(true);

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.meals || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function toggleFavourite(recipe) {
    const exists = favourites.find((item) => item.idMeal === recipe.idMeal);

    if (exists) {
      setFavourites(favourites.filter((item) => item.idMeal !== recipe.idMeal));
    } else {
      setFavourites([...favourites, recipe]);
    }
  }

  function handleCategory(cat) {
    setCategory(cat);

    setLoading(true);
    setSearchTerm("");
    setHasSearched(false);

    // if (category === "") {
    //   // fetch all recipes again
    //   fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    //     .then((response) => response.json())
    //     .then((data) => setRecipes(data.meals || []));
    // }else {

    // fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    //   .then((response) => response.json())
    //   .then((data) =>
    //     setRecipes(data.meals || []));

    const url =
      cat === ""
        ? "https://www.themealdb.com/api/json/v1/1/search.php?s="
        : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.meals || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        console.error(error);
      });
  }

  const allRecipes = [...userRecipes, ...recipes]

  return (
    <div className="home">
      <div className="header">
        <h1>Recipe App 🍛</h1>

        <div className="header-actions">
          <button type="submit" onClick={() => navigate("/add")} className="add-btn">
            Add Recipe ➕
          </button>

          <button className="meal-btn" onClick={() => navigate("/meal-plan")}>
            Meal Plan 📅
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <button onClick={handleSearch} className="search-btn">
        Search
      </button>

      <div className="categories">
        <button
          className={category === "" ? "active" : ""}
          onClick={() => handleCategory("")}
        >
          All 🍽️
        </button>

        <button
          className={category === "Chicken" ? "active" : ""}
          onClick={() => handleCategory("Chicken")}
        >
          Chicken 🍗
        </button>

        <button
          className={category === "Beef" ? "active" : ""}
          onClick={() => handleCategory("Beef")}
        >
          Beef 🥩
        </button>

        <button
          className={category === "Seafood" ? "active" : ""}
          onClick={() => handleCategory("Seafood")}
        >
          Seafood 🦐
        </button>
      </div>

      <h2>Recipes</h2>
      <div className="recipes-container">
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : recipes.length === 0 && hasSearched ? (
          <p className="no-results">No recipes found 😥</p>
        ) : (
          allRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              toggleFavourite={toggleFavourite}
              isFavourite={favourites.some(
                (item) => item.idMeal === recipe.idMeal,
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;

import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import RecipeDetails from "./pages/RecipeDetails";
import Favourites from "./pages/Favourites";
import { Link } from "react-router-dom";
import MealPlan from "./pages/MealPlan";
import AddRecipe from "./pages/AddRecipe";

function App() {
  return (
    <div>
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/meal-plan" element={<MealPlan />} />
        <Route path="/add" element={<AddRecipe/>} />
      </Routes>
      <Link to="/favourites">❤️ Favourites</Link>
    </div>
  );
}

export default App;

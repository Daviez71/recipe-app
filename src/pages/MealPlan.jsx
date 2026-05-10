import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MealPlan() {
  const [plan, setPlan] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("mealPlan");
    setPlan(saved ? JSON.parse(saved) : {});
  }, []);

  function removeMeal(day) {
    const updated = {...plan}

    delete updated[day]

    setPlan(updated);
    localStorage.setItem("mealPlan", JSON.stringify(updated))
  }
  function clearPlan(){
    const confirmClear = window.confirm("Clear all meals?");
    if(!confirmClear) return;

    setPlan({})
    localStorage.removeItem("mealPlan")
  }

  return (
    <div className="home">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>
      <h2>My Meal Plan 📅</h2>
      <button className="clear-btn" onClick={clearPlan}>
        Clear Plan 🧹
      </button>

      {Object.keys(plan).length === 0 ? (
        <p className="empty-state">
          No meals planned yet😥
          </p>
      ) : (
        <div className="meal-plan">
          {Object.entries(plan).map(([day, recipe]) => (
            // convert object to array for the .map()
            <div key={day} className="meal-day">
              <h3>{day}</h3>
              <p>{recipe.strMeal}</p>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} width="150" />

              <button onClick={() => removeMeal(day)}>Remove ❌</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MealPlan;

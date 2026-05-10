import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import RecipeDetails from "./pages/RecipeDetails";
import Favourites from "./pages/Favourites";
import { Link } from "react-router-dom";
import MealPlan from "./pages/MealPlan";
import AddRecipe from "./pages/AddRecipe";
import { useEffect, useState } from "react";
import ShoppingList from "./pages/ShoppingList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { auth } from "./firebase";
import ProtectedRoute from "./components/ProtectedRoute";

import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");

    return savedMode === "true";
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    await signOut(auth);

    alert("Logged out");
  }

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="header-links">
        <Link to="/">🏠 Home</Link>

        <Link to="/favourites">❤️ Favourites</Link>

        <Link to="/shopping-list">🛒 Shopping List</Link>

        {user && (
          <span className="user-email">
            👤 {user.email}
          </span>
        )}

        {user ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/signup">Signup</Link>
          </>
        )}

        <button onClick={() => setDarkMode(!darkMode)} className="dark-btn">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute user={user}>
              <Favourites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-plan"
          element={
            <ProtectedRoute user={user}>
              <MealPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-recipe"
          element={
            <ProtectedRoute user={user}>
              <AddRecipe />
            </ProtectedRoute>
          }
        />

        <Route path="/edit/:id" element={<AddRecipe />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <footer className="footer">
        <p>
           Recipe App 🍳 built with React & Firebase
        </p>
      </footer>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ShoppingList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("shoppingList")) || [];

    setItems(savedItems);
  }, []);

  function handleToggle(indexToToggle) {
    const updated = items.map((item, index) =>
      index === indexToToggle ? { ...item, checked: !item.checked } : item,
    );

    setItems(updated);

    localStorage.setItem("shoppingList", JSON.stringify(updated));

    function handleDelete(indexToDelete) {
      const updated = items.filter((_, index) => index !== indexToDelete);

      setItems(updated);

      localStorage.setItem("shoppingList", JSON.stringify(updated));
    }
  }

  function handleClearAll() {
    localStorage.removeItem("shoppingList");

    setItems([]);
  }
  return (
    <div className="shopping-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>
      <h2>🛒 Shopping List</h2>

      {items.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <>
          <ul className="shopping-list">
            {items.map((item, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggle(index)}
                />

                <span
                  style={{
                    textDecoration: item.checked ? "line-through" : "none",
                  }}
                >
                  {item.text}
                </span>
                <button onClick={() => handleDelete(index)}>❌</button>
              </li>
            ))}
          </ul>
          <button onClick={handleClearAll}>Clear All</button>
        </>
      )}
    </div>
  );
}

export default ShoppingList;

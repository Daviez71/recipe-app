import { useState } from "react";
import { auth } from "../firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created  🎉");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <div className="auth-container">
      <h2>Signup✨</h2>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account?
        <Link to="/Login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;

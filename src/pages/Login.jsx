import { useState } from "react";
import { auth } from "../firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful 🎉");

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="auth-container">
      <h2>Login 🔐</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input type="password" 
        placeholder="Password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        required/>

        <button type="submit">
            Login
        </button>
      </form>

      <p>
        Don't have an account?

        <Link to="/signup">
        Signup
        </Link>
      </p>
    </div>
  );
}

export default Login;
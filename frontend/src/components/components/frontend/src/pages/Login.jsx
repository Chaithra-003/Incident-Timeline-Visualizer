 import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      localStorage.setItem("token", "secure-token");

      navigate("/dashboard");

    } else {

      alert("Invalid Credentials");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-pink-700 p-6">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 w-full max-w-md shadow-2xl">

        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          🔐 Security Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/30 text-white mb-5"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 rounded-2xl bg-black/30 border border-white/30 text-white mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 py-4 rounded-2xl text-xl font-bold text-white hover:scale-105 transition"
        >
          Login
        </button>

        <div className="mt-6 text-center text-pink-200">

          <p>
            Demo Credentials
          </p>

          <p>
            Username: admin
          </p>

          <p>
            Password: admin123
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
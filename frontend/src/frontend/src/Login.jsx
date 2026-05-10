 import { useState } from "react";

function Login() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      localStorage.setItem(
        "token",
        "secure-demo-token"
      );

      window.location.reload();

    } else {

      alert("Invalid Credentials");

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-700 flex items-center justify-center p-6">

      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl w-full max-w-md border border-white/20">

        <h1 className="text-5xl font-extrabold text-center text-white mb-8">
          🔐 Secure Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full p-4 rounded-2xl bg-black/30 text-white mb-5"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 rounded-2xl bg-black/30 text-white mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-pink-500 py-4 rounded-2xl text-xl font-bold text-white"
        >
          Login
        </button>

        <div className="mt-6 text-center text-gray-300">

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
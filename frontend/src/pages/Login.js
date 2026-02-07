import React, { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setError("");
      alert("Login successful");
      navigate("/social");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://img.freepik.com/free-vector/background-with-blue-energy_1035-6298.jpg?semt=ais_hybrid&w=740&q=80')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 25, 99, 0.8)",
          width: "350px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "30px", color: "#333" }}>Login</h2>

        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "20px",
              fontWeight: "bold"
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#003898d2")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2575fc")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#0f5ce3",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0524af")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#0f53c9")}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#000000" }}>
          Don’t have an account?{" "}
          <Link to="/" style={{ color: "#0848b7", textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

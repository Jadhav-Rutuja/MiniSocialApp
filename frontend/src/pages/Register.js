import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profilePhoto: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/auth/register", form);
      setSuccess("Registration successful! Please login.");
      setError("");
      setForm({ username: "", email: "", password: "", profilePhoto: ""});
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundPosition: "center",
        backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdBUu1CMmdsm_f5MDj6AyyTZhq4mPK98_SiA&s')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "#f0f0f0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 43, 43, 0.2)",
          width: "350px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "30px", color: "#333" }}>Register</h2>

        {error && (
          <p style={{ color: "red", marginBottom: "20px", fontWeight: "bold" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "green", marginBottom: "20px", fontWeight: "bold" }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#dd2476")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />

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
              transition: "0.3s"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#dd2476")}
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
              transition: "0.3s"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#dd2476")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />

          <input
            name="profilePhoto"
            type="text"
            placeholder="Profile Photo URL (optional)"
            value={form.profilePhoto}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#dd2476")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#04a58a",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#026d62")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#04a58a")}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#000000" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007d5e", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


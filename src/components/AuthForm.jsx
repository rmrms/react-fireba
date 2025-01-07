import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import "./style/style.css";

export const AuthForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.email); // Konzolba írja az emailt
        setCurrentUser(user);
      } else {
        console.log("No user is logged in.");
        setCurrentUser(null);
      }
    });

    return () => unsubscribe(); // Tisztítás unmount esetén
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Dokumentum létrehozása a Firestore-ban
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email, // Email mentése
        createdAt: serverTimestamp(),
        name: "Default Name",
        avatarURL: "",
      });

      setError("");
      setSuccessMessage("Registration successful!");
      setFormData({ email: "", password: "", confirmPassword: "" });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      setSuccessMessage("Login successful!");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccessMessage("Logout successful!");
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form">
      {currentUser ? (
        <div className="user-info">
          <p>Logged in as: {currentUser.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="form-container">
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}
            <button type="submit">{isLogin ? "Login" : "Register"}</button>
          </form>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setError("");
                setSuccessMessage("");
                setIsLogin(!isLogin);
              }}
              className="toggle-button"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "./style/style.css";

/**
 * HomePage component that displays the user's dashboard.
 *
 * @component
 */

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../../firebase';

/**
 * HomePage component.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const HomePage = () => {
  // State to store the current user
  const [currentUser, setCurrentUser] = useState(null);
  // State to store the user's name
  const [userName, setUserName] = useState("");
  // State to store notifications
  const [notifications, setNotifications] = useState([]);
  // State to store the user's avatar URL
  const [avatarURL, setAvatarURL] = useState("");
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Effect to check user login status
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch the user's name and avatar URL from Firestore
        const fetchUserName = async () => {
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserName(data.name || "Név nem elérhető");
            setAvatarURL(data.avatarURL || "");
          }
        };

        fetchUserName();
      }
    });
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Effect to retrieve notifications from Firestore
  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to changes in the "items" collection for the current user
    const unsubscribe = onSnapshot(
      query(
        collection(db, "items"), // Connecting to the "items" collection
        where("userId", "==", currentUser.uid)
      ),
      (snapshot) => {
        // Map snapshot data to notifications state
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            createdAt:
              docData.createdAt?.toDate().toLocaleString() || "Unknown",
          };
        });
        setNotifications(data);
      },
      (error) => {
        console.error("Error fetching notifications:", error.message);
      }
    );

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [currentUser]);

  // Handler for logging out the user
  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out the user
      navigate("/register"); // Navigate to the register page
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>Welcome to the Dashboard</h1>
        {currentUser ? (
          <>
            <div className="user-info">
              <p>
                Logged in as:{" "}
                {avatarURL && (
                  <img
                    className="avatar"
                    src={avatarURL}
                    alt="Avatar"
                    onClick={() => navigate("/profile")}
                  />
                )}{" "}
                {userName || currentUser.email}
              </p>
            </div>

            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <p>Please log in to see your dashboard.</p>
        )}
      </header>

      <main className="main-content">
        <section className="instructions">
          <h2>About This Page</h2>
          <p>
            This page serves as your main dashboard after logging in or
            registering. You can navigate to the Product Page to create and
            manage items.
          </p>
        </section>

        <section className="notifications">
          <h2>Notifications</h2>
          {notifications.length > 0 ? (
            <ul>
              {notifications
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((item) => (
                  <li key={item.id}>
                    <p>
                      <strong>Item Name:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Creation Date:</strong> {item.createdAt}
                    </p>
                  </li>
                ))}
            </ul>
          ) : (
            <p>No notifications yet.</p>
          )}
        </section>

        <section className="navigation">
          <button onClick={() => navigate("/products")} className="nav-button">
            Go to Product Page
          </button>
        </section>
        <section className="navigation">
          <button onClick={() => navigate("/profile")} className="nav-button">
            Go to Profile Page
          </button>
        </section>
        <section className="navigation">
          <button
            onClick={() => navigate("/navigationhandler")}
            className="nav-button"
          >
            Visit the Mix Nav-Handler Page (Home of unfinished practice
            projects)
          </button>
        </section>
      </main>
    </div>
  );
};

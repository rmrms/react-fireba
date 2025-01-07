import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import "./style/style.css";

export const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [avatarURL, setAvatarURL] = useState("");
  const navigate = useNavigate();

  // User Login Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
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
    return unsubscribe;
  }, []);

  // Notification retrieval from FS
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      collection(db, "items"), // ← ← ← Connecting to the "items" collection
      (snapshot) => {
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

    return unsubscribe;
  }, [currentUser]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth); // LogOut
      navigate("/register"); // Nav
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
            <p>
              Logged in as:{" "}
              {avatarURL && (
                <img className="avatar" src={avatarURL} alt="Avatar" />
              )}{" "}
              {userName || currentUser.email}
            </p>

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
              {notifications.map((item) => (
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
      </main>
    </div>
  );
};

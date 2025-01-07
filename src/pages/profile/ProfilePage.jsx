import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./style/style.css";

export const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        console.error("No user is logged in.");
        return;
      }

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setName(data.name || "");
        setAvatarURL(data.avatarURL || "");
      } else {
        console.error("User document does not exist in Firestore.");
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async () => {
    if (!auth.currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        name: name,
        avatarURL: avatarURL,
      });

      setUserData((prevData) => ({
        ...prevData,
        name: name,
        avatarURL: avatarURL,
      }));
      console.log("Profile updated succefully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p>Email: {userData.email || "Email not found"}</p>{" "}
      <p>
        Joined:{" "}
        {userData.createdAt
          ? new Date(userData.createdAt.toDate()).toLocaleDateString()
          : "Join date not available"}
      </p>
      <div>
        {avatarURL && (
          <div>
            <img className="avatar" src={avatarURL} alt="Avatar" />
          </div>
        )}
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
      </div>
      <div>
        <label>Avatar URL:</label>
        <input
          type="text"
          value={avatarURL}
          onChange={(e) => setAvatarURL(e.target.value)}
          placeholder="Avatar Image URL"
        />
      </div>
      <button onClick={updateProfile}>Update Profile</button>
      <button onClick={() => navigate("/home")}>Back to Home Page</button>
    </div>
  );
};

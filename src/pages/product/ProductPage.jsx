import { useEffect, useState, useCallback } from "react"; // Importing necessary hooks from React
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation
import { db, auth } from "../../config/firebase"; // Importing Firebase configuration
import {
  query,
  where,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore"; // Importing Firestore functions
import "./style/style.css"; // Importing CSS for styling

export function ProductPage() {
  const [itemList, setItemList] = useState([]); // State to store list of items
  const [newItemName, setNewItemName] = useState(""); // State to store new item name
  const [newDescription, setNewDescription] = useState(""); // State to store new item description
  const [newPrice, setNewPrice] = useState(0); // State to store new item price
  const [newQuantity, setNewQuantity] = useState(1); // State to store new item quantity
  const [newCategory, setNewCategory] = useState(""); // State to store new item category
  const [isAvailable, setIsAvailable] = useState(true); // State to store new item availability
  const navigate = useNavigate(); // Hook for navigation

  const itemsCollectionRef = collection(db, "items"); // Reference to the Firestore collection "items"

  // Memoized function to fetch items using useCallback
  const getItemList = useCallback(async () => {
    try {
      const q = query(
        itemsCollectionRef,
        where("userId", "==", auth?.currentUser?.uid) // Query to get items of the logged-in user
      );
      const snapshot = await getDocs(q); // Fetching documents from Firestore
      const filteredData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })); // Mapping documents to an array of item objects
      setItemList(filteredData); // Updating state with fetched items
    } catch (err) {
      console.error("Error fetching items:", err.message); // Logging error if fetching fails
    }
  }, [itemsCollectionRef]); // Dependency array for useCallback

  // useEffect to fetch items when component mounts or getItemList changes
  useEffect(() => {
    getItemList(); // Calling getItemList to fetch items
  }, [getItemList]); // Dependency array for useEffect

  // Function to handle submission of a new item
  const onSubmitItem = async () => {
    try {
      await addDoc(itemsCollectionRef, {
        name: newItemName,
        description: newDescription,
        price: newPrice,
        quantity: newQuantity,
        category: newCategory,
        isAvailable: isAvailable,
        userId: auth?.currentUser?.uid,
        createdAt: serverTimestamp(), // Adding a timestamp
      }); // Adding a new document to Firestore
      getItemList(); // Refreshing the item list after adding a new item
    } catch (err) {
      console.error("Error adding item:", err.message); // Logging error if adding fails
    }
  };

  // Function to handle deletion of an item
  const deleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "items", id); // Reference to the document to be deleted
      await deleteDoc(itemDoc); // Deleting the document from Firestore
      setItemList((prev) => prev.filter((item) => item.id !== id)); // Updating state to remove deleted item
    } catch (err) {
      console.error("Error deleting item:", err.message); // Logging error if deletion fails
    }
  };

  return (
    <div className="ProductPage">
      {/* Form section for adding a new item */}
      <div className="item-input">
        <input
          placeholder="Item Name..."
          onChange={(e) => setNewItemName(e.target.value)} // Updating state with input value
        />
        <textarea
          placeholder="Description..."
          onChange={(e) => setNewDescription(e.target.value)} // Updating state with textarea value
        />
        <input
          placeholder="Price..."
          type="number"
          onChange={(e) => setNewPrice(Number(e.target.value))} // Updating state with input value and converting to number
        />
        <input
          placeholder="Quantity..."
          type="number"
          onChange={(e) => setNewQuantity(Number(e.target.value))} // Updating state with input value and converting to number
        />
        <input
          placeholder="Category..."
          onChange={(e) => setNewCategory(e.target.value)} // Updating state with input value
        />
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)} // Updating state with checkbox value
        />
        <label>Available</label>
        <button onClick={onSubmitItem}>Submit Item</button> {/* Button to submit new item */}
      </div>
      {/* Items section to display list of items */}
      <div className="item-list">
        {itemList
          .sort((a, b) => b.createdAt - a.createdAt) // Sorting items by creation date
          .map((item) => (
            <div key={item.id} className="item-card"> {/* Displaying each item */}
              <h1 style={{ color: item.isAvailable ? "green" : "red" }}>
                {item.name} {/* Displaying item name with color based on availability */}
              </h1>
              <p>{item.description}</p> {/* Displaying item description */}
              <p>Price: {item.price}</p> {/* Displaying item price */}
              <p>Quantity: {item.quantity}</p> {/* Displaying item quantity */}
              <p>Category: {item.category}</p> {/* Displaying item category */}
              {item.createdAt && (
                <p>Created At: {item.createdAt.toDate().toLocaleString()}</p> 
              )} {/* Displaying item creation date */}
              <button onClick={() => deleteItem(item.id)}>Delete Item</button> {/* Button to delete item */}
            </div>
          ))}
      </div>
      {/* Navigation button to go back to home page */}
      <button onClick={() => navigate("/home")} className="nav-button">
        Back to Home page
      </button>
    </div>
  );
}

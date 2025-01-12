import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/firebase";
import {
  query,
  where,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import "./style/style.css";

export function ProductPage() {
  const [itemList, setItemList] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newQuantity, setNewQuantity] = useState(1);
  const [newCategory, setNewCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const itemsCollectionRef = collection(db, "items");

  // Memoized getItemList using useCallback
  const getItemList = useCallback(async () => {
    try {
      const q = query(
        itemsCollectionRef,
        where("userId", "==", auth?.currentUser?.uid) // Csak a bejelentkezett felhasználó termékei
      );
      const snapshot = await getDocs(q);
      const filteredData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItemList(filteredData);
    } catch (err) {
      console.error("Error fetching items:", err.message);
    }
  }, [itemsCollectionRef]);

  // Fetch items
  useEffect(() => {
    getItemList();
  }, [getItemList]); // This will run whenever getItemList changes

  // Sub New Item
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
        createdAt: serverTimestamp(), // <--- Automatic Timestamp
      });
      getItemList();
    } catch (err) {
      console.error("Error adding item:", err.message);
    }
  };

  // Del Items
  const deleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "items", id);
      await deleteDoc(itemDoc);
      setItemList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err.message);
    }
  };

  // Filter Items

  const filteredItems = itemList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="ProductPage">
      <div>
        <input type="text" value={searchTerm} placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
        <ul>
          {filteredItems.map((item) => (<li key={item.id}>{item.name}</li>))}
        </ul>
      </div>
      {/* Form section */}
      <div className="item-input">
        <input
          placeholder="Item Name..."
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <textarea
          placeholder="Description..."
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          placeholder="Price..."
          type="number"
          onChange={(e) => setNewPrice(Number(e.target.value))}
        />
        <input
          placeholder="Quantity..."
          type="number"
          onChange={(e) => setNewQuantity(Number(e.target.value))}
        />
        <input
          placeholder="Category..."
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
        <label>Available</label>
        <button onClick={onSubmitItem}>Submit Item</button>
      </div>

      {/* Items section */}
      <div className="item-list">
        {itemList.map((item) => (
          <div key={item.id} className="item-card">
            <h1 style={{ color: item.isAvailable ? "green" : "red" }}>
              {item.name}
            </h1>
            <p>{item.description}</p>
            <p>Price: {item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Category: {item.category}</p>
            {item.createdAt && (
              <p>Created At: {item.createdAt.toDate().toLocaleString()}</p>
            )}
            <button onClick={() => deleteItem(item.id)}>Delete Item</button>
          </div>
        ))}
      </div>

      {/* Navigation button */}
      <button onClick={() => navigate("/home")} className="nav-button">
        Back to Home page
      </button>
    </div>
  );
}

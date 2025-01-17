import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthForm } from "../src/components/AuthForm";
import { HomePage } from "../src/pages/home/HomePage.jsx";
import { ProductPage } from "../src/pages/product/ProductPage";
import { ProfilePage } from "./pages/profile/ProfilePage.jsx";
import BoxGame from "./pages/miscellaneous/BoxGame/BoxGame.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/boxgame" element={<BoxGame />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

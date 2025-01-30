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
import Main from "./pages/miscellaneous/NavigationHandler/SubSites/qrcodegen/Main.jsx";
import BoxGame from "./pages/miscellaneous/BoxGame/BoxGame.jsx";
import NavigationHandler from "./pages/miscellaneous/NavigationHandler/NavigationHandler.jsx";
import FormHandler from "./pages/miscellaneous/NavigationHandler/SubSites/forms/Forms.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/boxgame" element={<BoxGame />} />
        <Route path="/formhandlerpractice" element={<FormHandler/>} />
        <Route path="/navigationhandler" element={<NavigationHandler />} />
        <Route path="qrcodegen" element={<Main/>}/>
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </Router>
  );
}

export default App;

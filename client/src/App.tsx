import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import Registration from "./Pages/Registration";
import StockImagePlatform from "./Pages/StockImagePlatform";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProfilePage from "./Components/Profile";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<StockImagePlatform />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

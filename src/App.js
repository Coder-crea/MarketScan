import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tabs from "./utils/TabsNavigation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./components/homeComponents/Search";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Tabs />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import "./App.css";
// import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tabs from "./utils/TabsNavigation";

import Search from "./components/homeComponents/Search";
function App() {
  return (
    <BrowserRouter>
      <Tabs />
      <Routes>
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

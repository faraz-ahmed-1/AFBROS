import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Depositors from "./pages/Depositors";
import Expenses from "./pages/Expenses";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/depositors" element={<Depositors />} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
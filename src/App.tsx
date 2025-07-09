import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FeirantePage from "./pages/FeirantePage";
import "./styles/App.css";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import SalePage from "./pages/SalePage"

const App: React.FC = () => (
  <div className="app">
<nav className="nav">
  <Link to="/">Home</Link> |{" "}
  <Link to="/feirantes">Feirantes</Link> |{" "}
  <Link to="/categorias">Categorias</Link> |{" "}
  <Link to="/produtos">Produtos</Link> |{" "}
  <Link to="/vendas">Vendas</Link> {}
</nav>

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/feirantes" element={<FeirantePage />} />
  <Route path="/produtos" element={<ProductPage />} />
  <Route path="/categorias" element={<CategoryPage />} />
  <Route path="/vendas" element={<SalePage />} /> {}
</Routes>
  </div>
);

export default App;
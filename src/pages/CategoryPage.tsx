import React, { useEffect, useState } from "react";
import { Categoria } from "../types";
import { carregar, salvar } from "../services/storage";
import CategoryForm from "../components/CategoryForm";
import "../styles/CategoryPage.css";

const STORAGE_KEY = "categorias";

const CategoryPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setCategorias(carregar<Categoria>(STORAGE_KEY));
  }, []);

  const persist = (data: Categoria[]) => {
    setCategorias(data);
    salvar(STORAGE_KEY, data);
  };

  const handleSave = (data: Categoria) => {
    const atualizadas = editing
      ? categorias.map((c) => (c.id === data.id ? data : c))
      : [...categorias, data];

    persist(atualizadas);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    persist(categorias.filter((c) => c.id !== id));
  };

  return (
    <div className="category-page">
      <h2>Categorias</h2>

      {showForm ? (
        <CategoryForm
          initialData={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Nova Categoria</button>
      )}

      <ul className="category-list">
        {categorias.length === 0 && <p>Nenhuma categoria cadastrada.</p>}
        {categorias.map((cat) => (
          <li key={cat.id} className="category-card">
            <span>{cat.nome}</span>
            <div>
              <button id="ButEdit"
                onClick={() => {
                  setEditing(cat);
                  setShowForm(true);
                }}
              >
                Editar
              </button>
              <button id="ButExcluir" onClick={() => handleDelete(cat.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;

import React, { useEffect, useState } from "react";
import { Categoria } from "../types";
import { categoriaService } from "../services/api";
import CategoryForm from "../components/CategoryForm";
import "../styles/CategoryPage.css";

const CategoryPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await categoriaService.getAll();
        setCategorias(data);
      } catch (err) {
        setError("Erro ao carregar categorias");
        console.error(err);
      }
    };
    loadData();
  }, []);

  const handleSave = async (categoria: Categoria) => {
    try {
      if (editing) {
        await categoriaService.update(categoria.id, categoria);
      } else {
        await categoriaService.create(categoria);
      }
      setEditing(null);
      setShowForm(false);
      const updatedData = await categoriaService.getAll();
      setCategorias(updatedData);
    } catch (err) {
      setError("Erro ao salvar categoria");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja excluir esta categoria?")) return;
    try {
      await categoriaService.delete(id);
      const updatedData = await categoriaService.getAll();
      setCategorias(updatedData);
    } catch (err) {
      setError("Erro ao excluir categoria");
      console.error(err);
    }
  };

  return (
    <div className="category-page">
      <h2>Categorias</h2>

      {error && <div className="error">{error}</div>}

      {showForm ? (
        <CategoryForm
          initialData={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Nova Categoria</button>
      )}

      <table className="category-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan={2}>Nenhuma categoria cadastrada.</td>
            </tr>
          ) : (
            categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>
                  <button onClick={() => {
                    setEditing(c);
                    setShowForm(true);
                  }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(c.id)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryPage;

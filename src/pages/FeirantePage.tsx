import React, { useEffect, useState } from "react";
import { Feirante } from "../types";
import { carregar, salvar } from "../services/storage";
import FeiranteForm from "../components/FeiranteForm";
import "../styles/FeirantePage.css";

const STORAGE_KEY = "feirantes";

const FeirantePage: React.FC = () => {
  const [feirantes, setFeirantes] = useState<Feirante[]>([]);
  const [editing, setEditing] = useState<Feirante | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setFeirantes(carregar<Feirante>(STORAGE_KEY));
  }, []);

  const persist = (data: Feirante[]) => {
    setFeirantes(data);
    salvar(STORAGE_KEY, data);
  };

  const handleSave = (feirante: Feirante) => {
    const atualizado = editing
      ? feirantes.map((f) => (f.id === feirante.id ? feirante : f))
      : [...feirantes, feirante];

    persist(atualizado);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir este feirante?")) {
      persist(feirantes.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="feirante-page">
      <h2>Feirantes</h2>

      {showForm ? (
        <FeiranteForm
          initialData={editing ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Novo Feirante</button>
      )}

      <table className="feirante-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Contato</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {feirantes.length === 0 && (
            <tr>
              <td colSpan={3}>Nenhum feirante cadastrado.</td>
            </tr>
          )}
          {feirantes.map((f) => (
            <tr key={f.id}>
              <td>{f.nome}</td>
              <td>{f.contato}</td>
              <td>
                <button id="ButEdit"
                  onClick={() => {
                    setEditing(f);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>{" "}
                <button id="ButExcluir" onClick={() => handleDelete(f.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeirantePage;

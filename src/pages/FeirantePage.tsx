import React, { useEffect, useState } from "react";
import { Feirante } from "../types";
import { feiranteService } from "../services/api";
import FeiranteForm from "../components/FeiranteForm";
import "../styles/FeirantePage.css";

const FeirantePage: React.FC = () => {
  const [feirantes, setFeirantes] = useState<Feirante[]>([]);
  const [editing, setEditing] = useState<Feirante | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadFeirantes = async () => {
      const data = await feiranteService.getAll();
      setFeirantes(data);
    };
    loadFeirantes();
  }, []);

  const handleSave = async (feirante: Feirante) => {
    if (editing) {
      await feiranteService.update(feirante.id, feirante);
    } else {
      await feiranteService.create(feirante);
    }
    const updated = await feiranteService.getAll();
    setFeirantes(updated);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente excluir este feirante?")) {
      await feiranteService.delete(id);
      const updated = await feiranteService.getAll();
      setFeirantes(updated);
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
                <button onClick={() => {
                  setEditing(f);
                  setShowForm(true);
                }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(f.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeirantePage;

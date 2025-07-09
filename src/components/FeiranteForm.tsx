import React, { FormEvent, useState } from "react";
import { Feirante } from "../types";

type Props = {
  initialData?: Feirante;
  onSave: (data: Feirante) => void;
  onCancel: () => void;
};

const FeiranteForm: React.FC<Props> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [contato, setContato] = useState(initialData?.contato ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const novo: Feirante = {
      id: initialData?.id ?? crypto.randomUUID(),
      nome,
      contato
    };
    onSave(novo);
  };

  return (
    <form onSubmit={handleSubmit} className="feirante-form">
      <div className="form-group">
        <label>Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Contato</label>
        <input
          value={contato}
          onChange={(e) => setContato(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">
          {initialData ? "Salvar" : "Adicionar"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FeiranteForm;

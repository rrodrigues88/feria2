import React, { FormEvent, useState } from "react";
import { Categoria } from "../types";

type Props = {
  initialData?: Categoria;
  onSave: (c: Categoria) => void;
  onCancel: () => void;
};

const CategoryForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [nome, setNome] = useState(initialData?.nome ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const novaCategoria: Categoria = {
      id: initialData?.id ?? crypto.randomUUID(),
      nome,
    };
    onSave(novaCategoria);
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <div className="form-group">
        <label>Nome da Categoria</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">{initialData ? "Salvar" : "Adicionar"}</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default CategoryForm;

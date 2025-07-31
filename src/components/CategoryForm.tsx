import React, { FormEvent, useState } from "react";
import { Categoria } from "../types";

type Props = {
  initialData?: Categoria;
  onSave: (c: Categoria) => void;
  onCancel: () => void;
};

const gerarUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const CategoryForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [nome, setNome] = useState(initialData?.nome ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const novaCategoria: Categoria = {
      id: initialData?.id ?? gerarUUID(),
      nome,
    };
    onSave(novaCategoria);
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <div className="form-group">
        <label htmlFor="nome">Nome da Categoria</label>
        <input
          id="nome"
          name="nome"
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

import React, { useState, useEffect } from "react";
import { Produto, Feirante, Categoria } from "../types";

interface ProductFormProps {
  initialData?: Produto;
  feirantes: Feirante[];
  categorias: Categoria[];
  onSave: (produto: Produto) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  feirantes,
  categorias,
  onSave,
  onCancel,
}) => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [feiranteId, setFeiranteId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setPreco(initialData.preco.toString());
      setQuantidade(initialData.quantidade.toString());
      setFeiranteId(initialData.feiranteId);
      setCategoriaId(initialData.categoriaId);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Produto = {
      id: initialData?.id ?? crypto.randomUUID(),
      nome,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
      feiranteId,
      categoriaId,
    };

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div>
        <label>Nome:</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>

      <div>
        <label>Preço:</label>
        <input
          type="number"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Quantidade:</label>
        <input
          type="number"
          min="0"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Feirante:</label>
        <select
          value={feiranteId}
          onChange={(e) => setFeiranteId(e.target.value)}
          required
        >
          <option value="">Selecione um feirante</option>
          {feirantes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Categoria:</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

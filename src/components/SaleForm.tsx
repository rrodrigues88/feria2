import React, { useEffect, useState, FormEvent } from "react";
import { Venda, Produto } from "../types";
import { carregar } from "../services/storage";

type Props = {
  initialData?: Partial<Venda>;
  onSave: (v: Venda) => void;
  onCancel: () => void;
};

const STORAGE_PRODUTOS = "produtos";

const SaleForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [produtoId, setProdutoId] = useState(initialData?.produtoId ?? "");
  const [quantidade, setQuantidade] = useState(initialData?.quantidade ?? 1);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    setProdutos(carregar<Produto>(STORAGE_PRODUTOS));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const produtoSelecionado = produtos.find((p) => p.id === produtoId);
    if (!produtoSelecionado) {
      alert("Produto inválido.");
      return;
    }

    if (quantidade > produtoSelecionado.quantidade) {
      alert(`Quantidade solicitada maior que o estoque disponível (${produtoSelecionado.quantidade}).`);
      return;
    }

    const novaVenda: Venda = {
      id: initialData?.id ?? crypto.randomUUID(),
      produtoId,
      quantidade,
      data: initialData?.data ?? new Date().toISOString(),
      feiranteId: produtoSelecionado.feiranteId,
    };

    onSave(novaVenda);
  };

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      <div className="form-group">
        <label>Produto</label>
        <select
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          required
        >
          <option value="">-- selecione --</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
        {produtos.length === 0 && (
          <small>Nenhum produto cadastrado ainda.</small>
        )}
      </div>

      {produtoId && (
        <p>
          Estoque disponível:{" "}
          <strong>
            {produtos.find((p) => p.id === produtoId)?.quantidade ?? 0}
          </strong>
        </p>
      )}

      <div className="form-group">
        <label>Quantidade</label>
        <input
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => setQuantidade(parseInt(e.target.value))}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">
          {initialData?.id ? "Salvar" : "Registrar Venda"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default SaleForm;

import React, { useEffect, useState } from "react";
import { Produto, Feirante, Categoria } from "../types";
import { carregar, salvar } from "../services/storage";
import ProductForm from "../components/ProductForm";
import "../styles/ProductPage.css";

const STORAGE_KEY = "produtos";
const STORAGE_FEIRANTES = "feirantes";
const STORAGE_CATEGORIAS = "categorias";

const ProductPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [feirantes, setFeirantes] = useState<Feirante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    setProdutos(carregar<Produto>(STORAGE_KEY));
    setFeirantes(carregar<Feirante>(STORAGE_FEIRANTES));
    setCategorias(carregar<Categoria>(STORAGE_CATEGORIAS));
  }, []);

  const persist = (data: Produto[]) => {
    setProdutos(data);
    salvar(STORAGE_KEY, data);
  };

  const handleSave = (p: Produto) => {
    const atualizado = editing
      ? produtos.map((prod) => (prod.id === p.id ? p : prod))
      : [...produtos, p];

    persist(atualizado);
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    persist(produtos.filter((p) => p.id !== id));
  };

  const nomeFeirante = (id: string) =>
    feirantes.find((f) => f.id === id)?.nome ?? "—";

  const nomeCategoria = (id: string) =>
    categorias.find((c) => c.id === id)?.nome ?? "—";

  return (
    <div className="product-page">
      <h2>Produtos</h2>

      {showForm ? (
        <ProductForm
          initialData={editing ?? undefined}
          feirantes={feirantes}
          categorias={categorias}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Novo Produto</button>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Feirante</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length === 0 && (
            <tr>
              <td colSpan={6}>Nenhum produto cadastrado.</td>
            </tr>
          )}
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>R$ {p.preco.toFixed(2)}</td>
              <td>{p.quantidade}</td>
              <td>{nomeFeirante(p.feiranteId)}</td>
              <td>{nomeCategoria(p.categoriaId)}</td>
              <td>
                <button
                  onClick={() => {
                    setEditing(p);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>{" "}
                <button onClick={() => handleDelete(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;

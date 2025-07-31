import React, { useEffect, useState } from "react";
import { Produto, Feirante, Categoria } from "../types";
import { produtoService, feiranteService, categoriaService } from "../services/api";
import ProductForm from "../components/ProductForm";
import "../styles/ProductPage.css";

const ProductPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [feirantes, setFeirantes] = useState<Feirante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, feiranteData, categoriaData] = await Promise.all([
          produtoService.getAll(),
          feiranteService.getAll(),
          categoriaService.getAll()
        ]);
        setProdutos(prodData);
        setFeirantes(feiranteData);
        setCategorias(categoriaData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    loadData();
  }, []);

  const handleSave = async (produto: Produto) => {
    if (editing) {
      await produtoService.update(produto.id, produto);
    } else {
      await produtoService.create(produto);
    }
    const updatedData = await produtoService.getAll();
    setProdutos(updatedData);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (produto: Produto) => {
    setEditing(produto);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja excluir este produto?")) {
      await produtoService.delete(id);
      const updatedData = await produtoService.getAll();
      setProdutos(updatedData);
    }
  };

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
            setEditing(null);
            setShowForm(false);
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
          {produtos.length === 0 ? (
            <tr>
              <td colSpan={6}>Nenhum produto cadastrado.</td>
            </tr>
          ) : (
            produtos.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>R$ {p.preco.toFixed(2)}</td>
                <td>{p.quantidade}</td>
                <td>{feirantes.find(f => f.id === p.feiranteId)?.nome ?? "—"}</td>
                <td>{categorias.find(c => c.id === p.categoriaId)?.nome ?? "—"}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p.id)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;

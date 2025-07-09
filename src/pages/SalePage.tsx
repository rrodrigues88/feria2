import React, { useEffect, useState } from "react";
import { Produto, Feirante, Categoria, Venda } from "../types";
import { carregar, salvar } from "../services/storage";
import SaleForm from "../components/SaleForm";
import "../styles/SalePage.css";

const STORAGE_PRODUTOS = "produtos";
const STORAGE_FEIRANTES = "feirantes";
const STORAGE_CATEGORIAS = "categorias";
const STORAGE_VENDAS = "vendas";

const SalePage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [feirantes, setFeirantes] = useState<Feirante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);

  const [vendaEmAndamento, setVendaEmAndamento] = useState<Venda | null>(null);

  useEffect(() => {
    setProdutos(carregar<Produto>(STORAGE_PRODUTOS));
    setFeirantes(carregar<Feirante>(STORAGE_FEIRANTES));
    setCategorias(carregar<Categoria>(STORAGE_CATEGORIAS));
    setVendas(carregar<Venda>(STORAGE_VENDAS));
  }, []);

  const atualizarProdutos = (produtosAtualizados: Produto[]) => {
    setProdutos(produtosAtualizados);
    salvar(STORAGE_PRODUTOS, produtosAtualizados);
  };

  const registrarVenda = (venda: Venda) => {
    let vendasAtualizadas: Venda[];

    const vendaAnterior = vendas.find((v) => v.id === venda.id);
    if (vendaAnterior) {
      // Corrige estoque anterior
      const produtosCorrigidos = produtos.map((p) => {
        if (p.id === vendaAnterior.produtoId) {
          return { ...p, quantidade: p.quantidade + vendaAnterior.quantidade };
        }
        return p;
      });

      // Atualiza a venda
      vendasAtualizadas = vendas.map((v) => (v.id === venda.id ? venda : v));
      salvar(STORAGE_VENDAS, vendasAtualizadas);
      setVendas(vendasAtualizadas);

      const produtosFinais = produtosCorrigidos.map((p) =>
        p.id === venda.produtoId
          ? { ...p, quantidade: p.quantidade - venda.quantidade }
          : p
      );
      atualizarProdutos(produtosFinais);
    } else {
      // Nova venda
      vendasAtualizadas = [...vendas, venda];
      salvar(STORAGE_VENDAS, vendasAtualizadas);
      setVendas(vendasAtualizadas);

      const produtosFinais = produtos.map((p) =>
        p.id === venda.produtoId
          ? { ...p, quantidade: p.quantidade - venda.quantidade }
          : p
      );
      atualizarProdutos(produtosFinais);
    }

    setVendaEmAndamento(null);
  };

  const excluirVenda = (venda: Venda) => {
    if (!window.confirm("Deseja excluir esta venda?")) return;

    // Remove venda
    const vendasAtualizadas = vendas.filter((v) => v.id !== venda.id);
    setVendas(vendasAtualizadas);
    salvar(STORAGE_VENDAS, vendasAtualizadas);

    // Devolve quantidade ao estoque
    const produtosCorrigidos = produtos.map((p) =>
      p.id === venda.produtoId
        ? { ...p, quantidade: p.quantidade + venda.quantidade }
        : p
    );
    atualizarProdutos(produtosCorrigidos);
  };

  const nomeProduto = (id: string) =>
    produtos.find((p) => p.id === id)?.nome ?? "—";

  const precoProduto = (id: string) =>
    produtos.find((p) => p.id === id)?.preco ?? 0;

  const nomeFeirante = (id: string) =>
    feirantes.find((f) => f.id === id)?.nome ?? "—";

  const formatarData = (data: string) =>
    new Date(data).toLocaleString("pt-BR");

  return (
    <div className="sale-page">
      <h2>Produtos Disponíveis para Venda</h2>

      {vendaEmAndamento && (
        <SaleForm
          initialData={vendaEmAndamento}
          onSave={registrarVenda}
          onCancel={() => setVendaEmAndamento(null)}
        />
      )}

      <table className="sale-table">
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
              <td colSpan={6}>Nenhum produto disponível.</td>
            </tr>
          )}
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>R$ {p.preco.toFixed(2)}</td>
              <td>{p.quantidade}</td>
              <td>{nomeFeirante(p.feiranteId)}</td>
              <td>{categorias.find((c) => c.id === p.categoriaId)?.nome ?? "—"}</td>
              <td>
                <button
                  onClick={() =>
                    setVendaEmAndamento({
                      id: crypto.randomUUID(),
                      produtoId: p.id,
                      quantidade: 1,
                      data: new Date().toISOString(),
                      feiranteId: p.feiranteId,
                    })
                  }
                  disabled={p.quantidade <= 0}
                >
                  Vender
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Histórico de Vendas</h2>
      <table className="sale-history-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
            <th>Data</th>
            <th>Feirante</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendas.length === 0 && (
            <tr>
              <td colSpan={6}>Nenhuma venda registrada.</td>
            </tr>
          )}
          {vendas.map((v) => (
            <tr key={v.id}>
              <td>{nomeProduto(v.produtoId)}</td>
              <td>{v.quantidade}</td>
              <td>R$ {(v.quantidade * precoProduto(v.produtoId)).toFixed(2)}</td>
              <td>{formatarData(v.data)}</td>
              <td>{nomeFeirante(v.feiranteId)}</td>
              <td>
              <div className="action-buttons">
                <button id="ButExc" onClick={() => setVendaEmAndamento(v)}>Editar</button>
                <button id="ButSale" onClick={() => excluirVenda(v)}>Excluir</button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalePage;

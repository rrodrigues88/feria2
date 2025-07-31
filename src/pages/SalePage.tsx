import React, { useEffect, useState } from "react";
import { Produto, Feirante, Categoria, Venda, CreateVendaDTO } from "../types";
import { produtoService, feiranteService, categoriaService, vendaService } from "../services/api";
import SaleForm from "../components/SaleForm";
import "../styles/SalePage.css";

const SalePage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [feirantes, setFeirantes] = useState<Feirante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendaEmAndamento, setVendaEmAndamento] = useState<CreateVendaDTO | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [produtosData, feirantesData, categoriasData, vendasData] = await Promise.all([
          produtoService.getAll(),
          feiranteService.getAll(),
          categoriaService.getAll(),
          vendaService.getAll()
        ]);
        setProdutos(produtosData);
        setFeirantes(feirantesData);
        setCategorias(categoriasData);
        setVendas(vendasData);
      } catch (err) {
        setError("Erro ao carregar dados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const registrarVenda = async (venda: CreateVendaDTO) => {
    try {
      const novaVenda = await vendaService.create(venda);
      setVendas([...vendas, novaVenda]);
      setVendaEmAndamento(null);
      const produtosAtualizados = await produtoService.getAll();
      setProdutos(produtosAtualizados);
    } catch (err) {
      setError("Erro ao registrar venda");
      console.error(err);
    }
  };

  const excluirVenda = async (venda: Venda) => {
    if (!window.confirm("Deseja excluir esta venda?")) return;
    try {
      setVendas(vendas.filter(v => v.id !== venda.id));
      const produtosAtualizados = await produtoService.getAll();
      setProdutos(produtosAtualizados);
    } catch (err) {
      setError("Erro ao excluir venda");
      console.error(err);
    }
  };

  const nomeProduto = (id: string) => produtos.find(p => p.id === id)?.nome ?? "—";
  const precoProduto = (id: string) => produtos.find(p => p.id === id)?.preco ?? 0;
  const nomeFeirante = (id: string) => feirantes.find(f => f.id === id)?.nome ?? "—";
  const formatarData = (data: string) => new Date(data).toLocaleString("pt-BR");

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

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
          {produtos.length === 0 ? (
            <tr>
              <td colSpan={6}>Nenhum produto disponível.</td>
            </tr>
          ) : (
            produtos.map(p => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>R$ {p.preco?.toFixed(2)}</td>
                <td>{p.quantidade}</td>
                <td>{nomeFeirante(p.feiranteId)}</td>
                <td>{categorias.find(c => c.id === p.categoriaId)?.nome ?? "—"}</td>
                <td>
                  <button
                    onClick={() =>
                      setVendaEmAndamento({
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
            ))
          )}
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
          {vendas.length === 0 ? (
            <tr>
              <td colSpan={6}>Nenhuma venda registrada.</td>
            </tr>
          ) : (
            vendas.map(v => (
              <tr key={v.id}>
                <td>{nomeProduto(v.produtoId)}</td>
                <td>{v.quantidade}</td>
                <td>R$ {(v.quantidade * precoProduto(v.produtoId)).toFixed(2)}</td>
                <td>{formatarData(v.data)}</td>
                <td>{nomeFeirante(v.feiranteId)}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => setVendaEmAndamento(v)}>Editar</button>
                    <button onClick={() => excluirVenda(v)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalePage;

import React, { useEffect, useState } from 'react';
import { Produto, CreateVendaDTO } from '../types';
import { produtoService, vendaService } from '../services/api';

interface SaleFormProps {
  initialData?: Partial<CreateVendaDTO>;
  onSave: (venda: CreateVendaDTO) => void;
  onCancel: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ initialData, onSave, onCancel }) => {
  const [produtoId, setProdutoId] = useState<string>(initialData?.produtoId || '');
  const [quantidade, setQuantidade] = useState<number>(initialData?.quantidade || 1);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProdutos = async () => {
      try {
        setLoading(true);
        const data = await produtoService.getAll();
        setProdutos(data);
      } catch (err) {
        setError('Falha ao carregar produtos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProdutos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const produtoSelecionado = produtos.find(p => p.id === produtoId);
      
      if (!produtoSelecionado) {
        throw new Error('Selecione um produto válido');
      }

      if (quantidade <= 0) {
        throw new Error('Quantidade deve ser maior que zero');
      }

      if (quantidade > produtoSelecionado.quantidade) {
        throw new Error(`Estoque insuficiente (disponível: ${produtoSelecionado.quantidade})`);
      }

      const vendaData: CreateVendaDTO = {
        produtoId,
        quantidade,
        feiranteId: produtoSelecionado.feiranteId,
        data: new Date().toISOString()
      };

      onSave(vendaData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && produtos.length === 0) {
    return <div className="loading">Carregando produtos...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="produto">Produto</label>
        <select
          id="produto"
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          required
          disabled={loading || produtos.length === 0}
        >
          <option value="">Selecione um produto</option>
          {produtos.map((produto) => (
            <option 
              key={produto.id} 
              value={produto.id}
              disabled={produto.quantidade <= 0}
            >
              {produto.nome} ({produto.quantidade} disponíveis)
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantidade">Quantidade</label>
        <input
          id="quantidade"
          type="number"
          min="1"
          max={produtos.find(p => p.id === produtoId)?.quantidade || 1}
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          required
          disabled={!produtoId || loading}
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Processando...' : 'Confirmar Venda'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="cancel-button"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default SaleForm;

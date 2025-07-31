export type Categoria = {
  id: string;
  nome: string;
};

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  feiranteId: string;
  categoriaId: string;
  descricao?: string; 
};

export type Feirante = {
  id: string;
  nome: string;
  contato: string;
  cpf?: string; 
};

export type Venda = {
  id: string;
  produtoId: string;
  quantidade: number;
  data: string;
  feiranteId: string;
  valorUnitario?: number; 
};

export type CreateVendaDTO = Omit<Venda, 'id'>;
export type UpdateProdutoDTO = Partial<Produto> & { id: string };
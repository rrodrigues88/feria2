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
};

export type Feirante = {
  id: string;
  nome: string;
  contato: string;
};

export type Venda = {
  id: string;
  produtoId: string;
  quantidade: number;
  data: string;
  feiranteId: string;
};


const API_BASE_URL = "http://localhost:8080";

const fetchApi = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
  if (!response.ok) throw new Error('Erro na requisição');
  return await response.json();
};

const postApi = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Erro ao salvar');
  return await response.json();
};

const putApi = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Erro ao atualizar');
  return await response.json();
};

const deleteApi = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Erro ao excluir');
  return response.ok;
};

export const categoriaService = {
  getAll: () => fetchApi('Categoria'),
  getById: (id: string) => fetchApi(`Categoria/${id}`),
  create: (data: any) => postApi('Categoria', data),
  update: (id: string, data: any) => putApi(`Categoria/${id}`, data),
  delete: (id: string) => deleteApi(`Categoria/${id}`)
};

export const feiranteService = {
  getAll: () => fetchApi('Feirante'),
  getById: (id: string) => fetchApi(`Feirante/${id}`),
  create: (data: any) => postApi('Feirante', data),
  update: (id: string, data: any) => putApi(`Feirante/${id}`, data),
  delete: (id: string) => deleteApi(`Feirante/${id}`)
};

export const produtoService = {
  getAll: () => fetchApi('Produto'),
  getById: (id: string) => fetchApi(`Produto/${id}`),
  create: (data: any) => postApi('Produto', data),
  update: (id: string, data: any) => putApi(`Produto/${id}`, data),
  delete: (id: string) => deleteApi(`Produto/${id}`)
};

export const vendaService = {
  getAll: () => fetchApi('Venda'),
  getById: (id: string) => fetchApi(`Venda/${id}`),
  create: (data: any) => postApi('Venda', data),
  update: (id: string, data: any) => putApi(`Venda/${id}`, data),
  delete: (id: string) => deleteApi(`Venda/${id}`)
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

export const apiUtils = {
  getPaginated: async <T>(endpoint: string, page: number, limit: number): Promise<PaginatedResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}?_page=${page}&_limit=${limit}`);
    const total = parseInt(response.headers.get('X-Total-Count') || '0');
    const data = await response.json();
    return { data, total };
  }
};

export const carregar = <T,>(chave: string): T[] => {
  const dados = localStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
};

export const salvar = <T,>(chave: string, dados: T[]) => {
  localStorage.setItem(chave, JSON.stringify(dados));
};

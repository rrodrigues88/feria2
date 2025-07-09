export const salvar = <T>(chave: string, dados: T[]) => {
  localStorage.setItem(chave, JSON.stringify(dados));
};

export const carregar = <T>(chave: string): T[] => {
  const data = localStorage.getItem(chave);
  return data ? JSON.parse(data) : [];
};

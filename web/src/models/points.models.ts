export interface UF {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface Item {
  id: number;
  title: string;
  image_url: string;
}

export interface City {
  nome: string;
}

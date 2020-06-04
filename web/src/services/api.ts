import axios from "axios";

const baseURL = "http://localhost:3333";
const ibgeURL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const api = axios.create();

export const loadItems = async () => {
  return await api.get(`${baseURL}/items`);
};

export const loadUF = async () => {
  return await api.get(`${ibgeURL}?orderBy=nome`);
};

export const loadCity = async (uf: string) => {
  return await api.get(`${ibgeURL}/${uf}/municipios`);
};

export const savePoint = async (data: {}) => {
  return api.post(`${baseURL}/points`, data);
};

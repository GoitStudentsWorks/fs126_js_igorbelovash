import axios from 'axios';
const api = axios.create({
  baseURL: 'https://deserts-store.b.goit.study/api',
});

export async function getCategories() {
  const { data } = await api.get('/categories');
  return data;
}

export async function getDesserts({ page = 1, limit = 8, category = '' } = {}) {
  const params = { page, limit };
  if (category) params.category = category;
  const { data } = await api.get('/desserts', { params });
  return data;
}


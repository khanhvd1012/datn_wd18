import api from './api';

export const createContactApi = async (data: any) => {
  const res = await api.post('/contacts', data);
  return res.data;
};

export const getAllContactsApi = async () => {
  const res = await api.get('/contacts');
  return res.data.data || res.data;
};

export const deleteContactApi = async (id: string) => {
  const res = await api.delete(`/contacts/${id}`);
  return res.data;
};

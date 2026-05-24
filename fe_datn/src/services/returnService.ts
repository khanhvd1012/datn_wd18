import api from "./api";

export const createReturnRequest = async (
  data: any
) => {

  const res = await api.post(
    "/returns",
    data
  );

  return res.data;
};

export const getAllReturns = async () => {

  const res = await api.get(
    "/returns"
  );

  return res.data;
};

export const approveReturn = async (
  id: string
) => {

  const res = await api.put(
    `/returns/${id}/approve`
  );

  return res.data;
};

export const rejectReturn = async (
  id: string
) => {

  const res = await api.put(
    `/returns/${id}/reject`
  );

  return res.data;
};
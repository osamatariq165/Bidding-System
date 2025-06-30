import axios from "axios";

const API_URL = "http://localhost:3000";

export const getAuctions = () =>
  axios.get(`${API_URL}/auction`).then(res => res.data);

export const getAuction = (id: number) =>
  axios.get(`${API_URL}/auction/${id}`).then(res => res.data);

export const createAuction = (data: {
  name: string;
  description: string;
  startingPrice: number;
  duration: number;
}) =>
  axios.post(`${API_URL}/auction`, data).then(res => res.data);

export const placeBid = (data: {
  itemId: number;
  userId: number;
  amount: number;
}) =>
  axios.post(`${API_URL}/bid`, data).then(res => res.data);

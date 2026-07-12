import apiClient from '../api/axios';

const VEHICLE_ENDPOINTS = {
  BASE: '/vehicles',
  SEARCH: '/vehicles/search',
};

export const getAllVehicles = async () => {
  const response = await apiClient.get(VEHICLE_ENDPOINTS.BASE);
  return response.data;
};

export const getVehicleById = async (id) => {
  const response = await apiClient.get(`${VEHICLE_ENDPOINTS.BASE}/${id}`);
  return response.data;
};

export const searchVehicles = async (params) => {
  const response = await apiClient.get(VEHICLE_ENDPOINTS.SEARCH, { params });
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await apiClient.post(VEHICLE_ENDPOINTS.BASE, vehicleData);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await apiClient.put(`${VEHICLE_ENDPOINTS.BASE}/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id) => {
  await apiClient.delete(`${VEHICLE_ENDPOINTS.BASE}/${id}`);
};

export const purchaseVehicle = async (id) => {
  const response = await apiClient.post(`${VEHICLE_ENDPOINTS.BASE}/${id}/purchase`);
  return response.data;
};

export const restockVehicle = async (id, quantity) => {
  const response = await apiClient.post(`${VEHICLE_ENDPOINTS.BASE}/${id}/restock`, { quantity });
  return response.data;
};

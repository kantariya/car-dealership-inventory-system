import apiClient from '../api/axios';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
};

export const registerUser = async ({ email, password, name }) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, {
    email,
    password,
    name,
  });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
    email,
    password,
  });
  return response.data;
};

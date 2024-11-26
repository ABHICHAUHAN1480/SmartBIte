
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export const login = (userData) => axios.post(`${API_URL}/login`, userData);
export const signup = (userData) => axios.post(`${API_URL}/signup`, userData);

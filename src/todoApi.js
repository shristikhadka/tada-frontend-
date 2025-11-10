import axios from 'axios';
import { getAuthToken } from './utils/auth';
import { API_BASE_URL } from './config';

//create axios instance with auth interceptor
const apiClient=axios.create({
    baseURL: API_BASE_URL,
});
 // Add auth header to every request
 apiClient.interceptors.request.use((config)=>{
    const token=getAuthToken();
    if(token){
        config.headers.Authorization=`Basic ${token}`;
    }
    return config;
 });

 // Export functions using the authenticated client
export const getAllTodos=()=>apiClient.get('/user/todos');
export const addTodo=(todo)=>apiClient.post('/user/todos',todo);
export const updateTodo=(id,updateTodo)=>apiClient.put(`/user/todos/${id}`,updateTodo);
export const deleteTodo=(id)=>apiClient.delete(`/user/todos/${id}`);
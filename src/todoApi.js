import axios from 'axios';

const API_BASE_URL="http://localhost:8080/api/todos";

export const getAllTodos=()=>axios.get(API_BASE_URL);
export const addTodo=(todo)=>axios.post(API_BASE_URL,todo);
export const updateTodo=(id,updateTodo)=>axios.put(`${API_BASE_URL}/${id}`,updateTodo);
export const deleteTodo=(id)=>axios.delete(`${API_BASE_URL}/${id}`);
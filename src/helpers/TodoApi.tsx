import axios from 'axios'
import { Todo } from './types';

export const baseURL = 'http://localhost:3000';

export const URLpath = '/todos';

const todosApi = axios.create({
    baseURL
})

// export const fetcher = (url: string) => axios.get(url).then(res => res.data);


export const fetchAllTodos = async () => {
    const response = await todosApi.get(URLpath);
    return response.data;
}

export const deleteTodo = async (id: Pick<Todo, 'id'>) => {
    const response = await todosApi.delete(`${URLpath}/${id}`)
    return response.data;
}

export const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    const response = await todosApi.post(URLpath, newTodo)
    return response.data;
}
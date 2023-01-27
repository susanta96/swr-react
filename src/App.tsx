// import { useState } from 'react'
import React, { useState } from 'react';
import { addTodo, deleteTodo, fetchAllTodos, URLpath as cachekey } from './helpers/TodoApi';
import useSWR from 'swr';
import './App.css'
import type { Todo } from './helpers/types';

function App() {
  const [localTodo, setLocalTodo] = useState<string>('');

  const { isLoading, error, data: todos, mutate} = useSWR<Todo[]>(cachekey, fetchAllTodos, {
    onSuccess: (data: Todo[]) => data.sort((a, b) => b.id - a.id)
  })
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalTodo(e.target.value.toString())
  }

  async function handleDelete(todoId: Pick<Todo, 'id'>) {
    try {
      await deleteTodo(todoId);
      mutate();
      alert("Success! Deleted item.")
     
    } catch (err) {
        alert("Failed to delete the item.")
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const newTodo = {
        userId: 1,
        title: localTodo,
        completed: false
      }
      await addTodo(newTodo);
      setLocalTodo('');
      mutate();
      alert("Success! Added item.")
    } catch (err) {
        alert("Failed to add the item.")
    }
  }

  return (
    <div className="App">
      <form className="form-group" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <label htmlFor="todo">Create Todo</label>
        <input type="text" name="todo" value={localTodo} onChange={(e) => handleChange(e)} />
      </form>
      {
        isLoading ?
        <p>Loading ....</p>
        : error ?
        <p>{error.message}</p>
        :
        <ul className="todo-list">
          {
            todos?.length && todos.map((todo) => (
              <li className="todo-item"><div>{todo.id}.&nbsp;{todo.title}</div>
                <button className='del-icon' onClick={() => handleDelete(todo.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </li>
            ))
          }
        </ul>
      }
    </div>
  )
}

export default App

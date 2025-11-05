import { useState, useEffect } from "react";
import {
  getAllTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../todoApi";
import "./TodoList.css";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const[editingId,setEditingId]=useState(null);
  const[editedTitle,setEditedTitle]=useState("");

  // Load all todos once on mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Fetch todos from backend
  const loadTodos = async () => {
    try {
      const res = await getAllTodos();
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  // Add new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    const todo = { title: newTodo, completed: false };
    try {
      const res = await addTodo(todo);
      setTodos((prev) => [...prev, res.data]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Mark todo as done
  const handleMarkAsDone = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = { ...todo, completed: true };
    try {
      const res = await updateTodo(id, updated);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const handleStartEditing=(todo)=>{
    setEditingId(todo.id);
    setEditedTitle(todo.title);
  }
  const handleUpdateTodo=async(id)=>{
    const todo=todos.find((t)=>t.id==id);
    if(!todo)return;
    const updated={...todo,title:editedTitle};
    try{
        const res=await updateTodo(id,updated);
        setTodos((prev)=>prev.map((t)=>t.id==id?res.data:t));
        setEditingId(null);
        setEditedTitle("");
    }catch(err){
        console.error("Error updating todo",err)
    }
  }

  return (
    <div className="todo-container">
      <h3 className="todo-header">Your Tasks</h3>

      <div className="todo-input-section">
        <input
          className="todo-input"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button className="btn-add" onClick={handleAddTodo}>Add Task</button>
      </div>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">No tasks yet. Add one above!</div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <div className="todo-content">
                {editingId === todo.id ? (
                  <>
                    <input
                      className="edit-input"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateTodo(todo.id)}
                      autoFocus
                    />
                    <button className="btn btn-save" onClick={() => handleUpdateTodo(todo.id)}>
                      Save
                    </button>
                  </>
                ) : (
                  <li className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                    {todo.title}
                  </li>
                )}
              </div>

              <div className="todo-actions">
                {editingId !== todo.id && (
                  <button className="btn btn-edit" onClick={() => handleStartEditing(todo)}>
                    Edit
                  </button>
                )}
                <button className="btn btn-delete" onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
                <button
                  className={`btn btn-done ${todo.completed ? 'completed' : ''}`}
                  onClick={() => handleMarkAsDone(todo.id)}
                  disabled={todo.completed}
                >
                  {todo.completed ? 'Done' : 'Mark Done'}
                </button>
              </div>
            </div>
          ))
        )}
      </ul>
    </div>
  );
}

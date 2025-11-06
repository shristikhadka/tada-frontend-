import TodoList from '../components/TodoList';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <TodoList />
    </div>
  );
}
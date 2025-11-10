import { getAllUsers, deleteUser } from "../adminApi";
import { useState, useEffect } from "react";
import './AdminDashboard.css';

export default function AdminDashboard(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [deletingUserId, setDeletingUserId] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try{
            setLoading(true);
            setError("");
            setDeleteMessage("");
            const res = await getAllUsers();
            setUsers(res.data);
        }catch(err){
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please check if you have ADMIN role.");
        }finally{
            setLoading(false);
        }
    }

    const handleDeleteUser = async (id) => {
        // Confirm deletion
        if (!window.confirm(`Are you sure you want to delete user with ID ${id}?`)) {
            return;
        }

        try{
            setDeletingUserId(id);
            setDeleteMessage("");
            await deleteUser(id);
            setDeleteMessage("User deleted successfully!");
            // Refresh the user list
            await loadUsers();
        }catch(err){
            console.error("Error deleting user:", err);
            setDeleteMessage("Error deleting user: " + (err.response?.data?.message || err.message));
        }finally{
            setDeletingUserId(null);
        }
    }

    return(
        <div className="admin-container">
            <div className="admin-card">
                <h1 className="admin-title">Admin Dashboard</h1>
                <p className="admin-subtitle">Manage all users in the system</p>

                {loading ? (
                    <div className="loading-text">Loading users...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <div className="users-header">
                            <h2>All Users ({users.length})</h2>
                            <button 
                                className="refresh-button" 
                                onClick={loadUsers}
                            >
                                Refresh
                            </button>
                        </div>

                        {deleteMessage && (
                            <div className={`message ${deleteMessage.includes('Error') ? 'error-message' : 'success-message'}`}>
                                {deleteMessage}
                            </div>
                        )}

                        {users.length === 0 ? (
                            <div className="no-users">No users found</div>
                        ) : (
                            <div className="users-table-container">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Roles</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td className="username-cell">{user.userName}</td>
                                                <td>
                                                    <div className="roles-container">
                                                        {user.roles && user.roles.map((role, index) => (
                                                            <span key={index} className={`role-badge ${role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="delete-button"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={deletingUserId === user.id}
                                                    >
                                                        {deletingUserId === user.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

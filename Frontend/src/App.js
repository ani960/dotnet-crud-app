import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  const fetchUsers = () => {
    axios.get("https://localhost:7114/api/users")
      .then(res => setUsers(res.data))
      .catch(() => toast.error("Error fetching users"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!name) newErrors.name = "Name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add / Update
  const handleSubmit = () => {
    if (!validate()) return;

    if (editId === null) {
      axios.post("https://localhost:7114/api/users", { name, email })
        .then(() => {
          fetchUsers();
          setName("");
          setEmail("");
          setErrors({});
          toast.success("User added successfully!");
        })
        .catch(() => toast.error("Error adding user"));
    } else {
      axios.put(`https://localhost:7114/api/users/${editId}`, {
        id: editId,
        name,
        email
      }).then(() => {
        fetchUsers();
        setName("");
        setEmail("");
        setEditId(null);
        setErrors({});
        toast.success("User updated successfully!");
      })
      .catch(() => toast.error("Error updating user"));
    }
  };

  // Delete
  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`https://localhost:7114/api/users/${id}`)
        .then(() => {
          fetchUsers();
          toast.success("User deleted successfully!");
        })
        .catch(() => toast.error("Error deleting user"));
    }
  };

  // Edit
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  // Search filter
  const query = search.trim().toLowerCase();
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  );

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className={`${darkMode ? "bg-dark text-light" : "bg-light"} min-vh-100 py-5`}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid d-flex justify-content-center">
        <div className={`card p-4 shadow w-75 ${darkMode ? "bg-dark border-light text-light" : ""}`}>

          {/* Toggle Button */}
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={toggleTheme}
              className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"}`}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <h2 className="text-center mb-4">User Management</h2>

          {/* FORM */}
          <div className="mb-3">

            <input
              className={`form-control mb-1 ${darkMode ? "bg-dark text-light border-light" : ""}`}
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}

            <input
              className={`form-control mb-1 mt-2 ${darkMode ? "bg-dark text-light border-light" : ""}`}
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}

            <button
              onClick={handleSubmit}
              className={`btn w-100 mt-3 ${editId ? "btn-warning" : "btn-primary"}`}
            >
              {editId ? "Update User" : "Add User"}
            </button>
          </div>

          <hr />

          {/* SEARCH */}
          <input
            type="text"
            className={`form-control mb-3 ${darkMode ? "bg-dark text-light border-light" : ""}`}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* TABLE */}
          <table className={`table ${darkMode ? "table-dark table-hover" : "table-striped"}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editUser(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default App;
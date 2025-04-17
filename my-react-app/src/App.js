import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming you have some CSS

function Sidebar({ onNavigate, activeTab, onLogout, notifications }) {
  const unreadCount = notifications.length;

  return (
    <div className="sidebar">
      <h2>Admin Menu</h2>
      <ul>
        <li>
          <button
            className={activeTab === 'books' ? 'active' : ''}
            onClick={() => onNavigate('books')}
          >
            Manage Books
          </button>
        </li>
        <li>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => onNavigate('users')}
          >
            Manage Users
          </button>
        </li>
        <li>
          <button onClick={() => onNavigate('notifications')}>
            Notifications ({unreadCount})
          </button>
        </li>
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}

function BookManagement({ onBookAdded }) {
  const [books, setBooks] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBooks = localStorage.getItem('books');
      return savedBooks ? JSON.parse(savedBooks) : [];
    }
    return [];
  });
  const [newBook, setNewBook] = useState({ title: '', author: '', filePath: null });
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', author: '', filePath: null });
  const [selectedBookFile, setSelectedBookFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedBookFile(file);
  };

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author) {
      setError('Please fill in all fields.');
      return;
    }
    const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    const newBookToAdd = {
      id: newId,
      title: newBook.title,
      author: newBook.author,
      filePath: selectedBookFile ? '/mock/' + selectedBookFile.name : '/mock/default.pdf',
    };
    setBooks([...books, newBookToAdd]);
    setNewBook({ title: '', author: '', filePath: null });
    setSelectedBookFile(null);
    setError(null);
    onBookAdded(newBookToAdd);
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setEditFormData({ title: book.title, author: book.author, filePath: book.filePath });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveEdit = (id) => {
    setLoading(true);
    setError(null);
    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return { ...book, title: editFormData.title, author: editFormData.author, filePath: editFormData.filePath };
      }
      return book;
    });
    setBooks(updatedBooks);
    setEditingBookId(null);
    setLoading(false);
  };

  const handleDeleteBook = (id) => {
    setLoading(true);
    setError(null);
    setBooks(books.filter((book) => book.id !== id));
    setLoading(false);
  };

  return (
    <div>
      <h2>Manage Books</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Add New Book</h3>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={newBook.title} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label htmlFor="author">Author:</label>
        <input type="text" id="author" name="author" value={newBook.author} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label htmlFor="bookFile">Book File:</label>
        <input type="file" id="bookFile" name="bookFile" onChange={handleFileChange} />
      </div>
      <button onClick={handleAddBook}>Add Book</button>
      <h3>Book List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>File Path</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>
                {editingBookId === book.id ? (
                  <input type="text" name="title" value={editFormData.title} onChange={handleEditInputChange} />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editingBookId === book.id ? (
                  <input type="text" name="author" value={editFormData.author} onChange={handleEditInputChange} />
                ) : (
                  book.author
                )}
              </td>
              <td>
                {editingBookId === book.id ? (
                  <input type="text" name="filePath" value={editFormData.filePath} onChange={handleEditInputChange} />
                ) : (
                  book.filePath
                )}
              </td>
              <td>
                {editingBookId === book.id ? (
                  <>
                    <button onClick={() => handleSaveEdit(book.id)}>Save</button>
                    <button onClick={() => setEditingBookId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="edit" onClick={() => handleEditBook(book)}>
                      Edit
                    </button>
                    <button className="delete" onClick={() => handleDeleteBook(book.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    }
    return [];
  });
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'member', password: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', email: '', role: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('Please fill in all fields.');
      return;
    }
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(newUser.email)) {
      setError('Invalid email address.');
      return;
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUserToAdd = {
      id: newId,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      password: newUser.password,
    };
    setUsers([...users, newUserToAdd]);
    setNewUser({ username: '', email: '', role: 'member', password: '' });
    setError(null);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ username: user.username, email: user.email, role: user.role, password: user.password });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveEdit = (id) => {
    setLoading(true);
    setError(null);
    const updatedUsers = users.map((u) => {
      if (u.id === id) {
        return { ...u, username: editFormData.username, email: editFormData.email, role: editFormData.role, password: editFormData.password };
      }
      return u;
    });
    setUsers(updatedUsers);
    setEditingUserId(null);
    setLoading(false);
  };

  const handleDeleteUser = (id) => {
    setLoading(true);
    setError(null);
    setUsers(users.filter((user) => user.id !== id));
    setLoading(false);
  };

  return (
    <div>
      <h2>Manage Users</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Add New User</h3>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={newUser.username} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" value={newUser.email} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role:</label>
        <select id="role" name="role" value={newUser.role} onChange={handleInputChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={newUser.password} onChange={handleInputChange} />
      </div>

      <button onClick={handleAddUser}>Add User</button>
      <h3>User List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button onClick={() => handleSaveEdit(user.id)}>Save</button>
                    <button onClick={() => setEditingUserId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="edit" onClick={() => handleEditUser(user)}>
                      Edit
                    </button>
                    <button className="delete" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      onLogin(role, user);
    } else {
      setError('Invalid username, password, or role');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-logo">

      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <h2>LCLMS Login</h2>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

function UserProfile({ userId, onUpdateProfile }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.id === userId);

    if (user) {
      setEmail(user.email || '');
      setUsername(user.username || '');
    }
  }, [userId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateProfile({ userId });
    alert('Profile updated!');
  };

  return (
    <div className="user-profile">
      <h2>Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} readOnly />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="text" value={email} readOnly />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

function BookListUserView({ userId, onReadBook, onReserveBook, books }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
    setSearchResults(filteredBooks);
  }, [searchTerm, books]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleReserve = (bookId) => {
    onReserveBook(bookId);
  };

  return (
    <div className="book-list-user">
      <h2>Available Books</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="book-grid">
        {searchResults.map(book => (
          <div key={book.id} className="book-item">
            {book.coverImage && <img src={book.coverImage} alt={`${book.title} Cover`} />}
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <div className="book-actions">
              <button onClick={() => onReadBook(book.id)}>Read</button>
              <button onClick={() => handleReserve(book.id)}>Reserve</button>
            </div>
          </div>
        ))}
        {searchResults.length === 0 && searchTerm && <p>No books found matching your search.</p>}
      </div>
    </div>
  );
}

function ReservationList({ reservations, books, onReadBook, onDeleteReservation }) {
  const reservedBooks = reservations.map(res => books.find(book => book.id === res.bookId)).filter(Boolean);

  return (
    <div className="reservation-list">
      <h2>Your Reservations</h2>
      {reservedBooks.length === 0 ? (
        <p>No books currently reserved.</p>
      ) : (
        <ul>
          {reservedBooks.map(book => (
            <li key={book.id}>
              {book.title} by {book.author} - Reserved on: {new Date(reservations.find(res => res.bookId === book.id).timestamp).toLocaleDateString()}
              <button onClick={() => onReadBook(book.id)}>Read</button>
              <button onClick={() => onDeleteReservation(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BookRequestForm({ onRequestBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title && author) {
      onRequestBook({ title, author });
      setTitle('');
      setAuthor('');
      alert('Request submitted to admin.');
    } else {
      alert('Please enter the title and author of the book you want to request.');
    }
  };

  return (
    <div className="book-request-form">
      <h2>Request a Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

function UserDashboard({ user, books, reservations, onReadBook, onRequestBook, onLogout, onReserveBook, notifications, onDeleteReservation }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleUpdateProfile = (profileData) => {
    alert('Profile updated!');
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <div className="notification-logout-container">
          <div className="notification-bell">
            <button onClick={() => setShowNotifications(!showNotifications)}>
              Notifications ({notifications.length})
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    {notification.message}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-section profile-section">
          <UserProfile userId={user.id} onUpdateProfile={handleUpdateProfile} />
        </div>
        <div className="dashboard-section book-list-section">
          <BookListUserView userId={user.id} onReadBook={onReadBook} onReserveBook={onReserveBook} books={books} />
        </div>
        <div className="dashboard-section reservation-section">
          <ReservationList reservations={reservations} books={books} onReadBook={onReadBook} onDeleteReservation={onDeleteReservation} />
        </div>
        <div className="dashboard-section request-form-section">
          <BookRequestForm onRequestBook={onRequestBook} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedBooks = localStorage.getItem('books');
      return storedBooks ? JSON.parse(storedBooks) : [
        { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", filePath: "/mock/hobbit.pdf" },
        { id: 2, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", filePath: "/mock/harrypotter.pdf" }
      ];
    }
    return [];
  });
  const [reservations, setReservations] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedReservations = localStorage.getItem('reservations');
      return storedReservations ? JSON.parse(storedReservations) : [];
    }
    return [];
  });
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedNotifications = localStorage.getItem('notifications');
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    }
    return [];
  });

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
      const storedUserData = JSON.parse(localStorage.getItem('userData'));
      if (storedUserData) {
        setUserData(storedUserData);
        setUserRole(storedUserData.role);
      }
    }
    // Set default users and admin if not already set.
    if (!localStorage.getItem('users')) {
      const defaultUsers = [
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', password: 'password' },
        { id: 2, username: 'user', email: 'user@example.com', role: 'member', password: 'password' }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('books')) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reservations', JSON.stringify(reservations));
    }
  }, [reservations]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const handleLogin = (role, user) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserData(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
    }
  };

  const handleNavigation = (tab) => {
    setActiveTab(tab);
  };

  const handleReadBook = (bookId) => {
    alert(`Simulating reading book with ID: ${bookId}`);
  };

  const handleRequestBook = (request) => {
    alert('Request submitted!');
    setNotifications([...notifications, { type: 'request', message: `User ${userData.username} requested book "${request.title}"` }]);
    console.log('Book requested:', request);
  };

  const handleBookAdded = (newBook) => {
    setBooks([...books, newBook]);
    setNotifications([...notifications, { type: 'book', message: `New book added: "${newBook.title}" by ${newBook.author}` }]);
  };

  const handleReserveBook = (bookId) => {
    const bookToReserve = books.find(book => book.id === bookId);
    if (bookToReserve) {
      if (!reservations.some(res => res.userId === userData.id && res.bookId === bookId)) {
        const newReservation = { userId: userData.id, bookId: bookId, timestamp: Date.now() };
        setReservations([...reservations, newReservation]);
        setNotifications([...notifications, { type: 'reservation', message: `User ${userData.username} reserved book "${bookToReserve.title}"` }]);
        alert(`Book "${bookToReserve.title}" reserved!`);
        console.log("Reservations after reserve:", [...reservations, newReservation]);
      } else {
        alert('You have already reserved this book.');
      }
    }
  };

  const handleClearNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };
  const handleDeleteReservation = (bookId) => {
    setReservations(reservations.filter(res => res.bookId !== bookId || res.userId !== userData.id));
    alert('Reservation deleted.');
  };

  return (
    <div className="app-container">
      {isLoggedIn && userData && userRole === 'admin' && (
        <div>
          <Sidebar onNavigate={handleNavigation} activeTab={activeTab} onLogout={handleLogout} notifications={notifications} />
          <div className="content">
            {activeTab === 'books' && <BookManagement onBookAdded={handleBookAdded} />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'notifications' && (
              <div>
                <h2>Admin Notifications</h2>
                {notifications.length === 0 ? (
                  <p>No new notifications.</p>
                ) : (
                  <ul>
                    {notifications.map((notification, index) => (
                      <li key={index}>
                        {notification.message}
                        <button onClick={() => handleClearNotification(index)}>Clear</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <p>Logged in as an admin</p>
          </div>
        </div>
      )}

      {isLoggedIn && userData && userRole === 'member' && (
        <UserDashboard
          user={userData}
          books={books}
          reservations={reservations.filter(res => res.userId === userData.id)}
          onReadBook={handleReadBook}
          onRequestBook={handleRequestBook}
          onLogout={handleLogout}
          onReserveBook={handleReserveBook}
          notifications={notifications}
          onDeleteReservation={handleDeleteReservation}
        />
      )}

      {!isLoggedIn && <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;
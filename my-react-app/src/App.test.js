import React, { useState, useEffect } from 'react';

// --- Data (Mock API - Replace with actual API calls) ---
const initialBooks = [
  { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', available: true },
  { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', available: false },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true },
  { id: 4, title: '1984', author: 'George Orwell', available: true },
];

const initialReservations = [];
const initialUsers = []; // In a real app, you'd handle authentication properly

// --- Components ---

// Book List Item
const BookItem = ({ book, onReserve, reservations, currentUser }) => {
  const isReserved = reservations.some(
    (res) => res.bookId === book.id && res.userId === currentUser?.id
  );
  const canReserve = book.available && !isReserved && currentUser;

  return (
    <div>
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Availability: {book.available ? 'Available' : 'Reserved'}</p>
      {canReserve ? (
        <button onClick={() => onReserve(book.id)}>Reserve</button>
      ) : isReserved ? (
        <p>Reserved</p>
      ) : !book.available ? (
        <p>Currently Unavailable</p>
      ) : (
        <p>Log in to reserve</p>
      )}
    </div>
  );
};

// Book Search
const BookSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

// Book List
const BookList = ({ books, onReserve, reservations, currentUser }) => {
  return (
    <div>
      <h2>Available Books</h2>
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          onReserve={onReserve}
          reservations={reservations}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

// Reservation List
const ReservationList = ({ reservations, books, currentUser, onCancelReservation }) => {
  const userReservations = reservations.filter((res) => res.userId === currentUser?.id);

  return (
    <div>
      <h2>My Reservations</h2>
      {userReservations.length === 0 ? (
        <p>No current reservations.</p>
      ) : (
        <ul>
          {userReservations.map((reservation) => {
            const book = books.find((b) => b.id === reservation.bookId);
            return (
              book && (
                <li key={reservation.id}>
                  {book.title} (Reserved on: {reservation.reservationDate})
                  <button onClick={() => onCancelReservation(reservation.id)}>
                    Cancel Reservation
                  </button>
                </li>
              )
            );
          })}
        </ul>
      )}
    </div>
  );
};

// User Profile
const UserProfile = ({ currentUser, reservations, books }) => {
  if (!currentUser) {
    return <p>Please log in to view your profile.</p>;
  }

  const borrowedBooks = []; // In a real app, track borrowed books

  return (
    <div>
      <h2>User Profile</h2>
      <p>User ID: {currentUser.id}</p>
      <p>Email: {currentUser.email || 'N/A'}</p>

      <h3>Borrowing History</h3>
      {borrowedBooks.length === 0 ? (
        <p>No borrowing history yet.</p>
      ) : (
        <ul>
          {borrowedBooks.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Admin Dashboard (Simplified)
const AdminDashboard = ({ books, reservations, users, onUpdateBook, onDeleteBook }) => {
  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Manage Books</h3>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author} - Available: {book.available ? 'Yes' : 'No'}
            {/* Implement update and delete functionality here */}
          </li>
        ))}
      </ul>

      <h3>Manage Reservations</h3>
      <ul>
        {reservations.map((res) => {
          const book = books.find((b) => b.id === res.bookId);
          const user = users.find((u) => u.id === res.userId);
          return (
            book && user && (
              <li key={res.id}>
                {book.title} reserved by User {user.id} on {res.reservationDate}
                {/* Implement management actions here */}
              </li>
            )
          );
        })}
      </ul>

      <h3>Manage Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>User ID: {user.id} {/* Display user details */}</li>
        ))}
      </ul>
    </div>
  );
};

// Main App Component
const LibraryApp = () => {
  const [books, setBooks] = useState(initialBooks);
  const [reservations, setReservations] = useState(initialReservations);
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState({ id: 1, email: 'user@example.com' }); // Mock user
  const [displayedBooks, setDisplayedBooks] = useState(initialBooks);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Simulate fetching reservations from an API
    // In a real app, this would be an API call
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);

  useEffect(() => {
    // Simulate saving reservations to local storage (replace with API)
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleSearch = (searchTerm) => {
    const filteredBooks = initialBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedBooks(filteredBooks);
  };

  const handleReserveBook = (bookId) => {
    if (!currentUser) {
      setNotification({ message: 'Please log in to reserve books.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const isAlreadyReserved = reservations.some(
      (res) => res.bookId === bookId && res.userId === currentUser.id
    );

    if (isAlreadyReserved) {
      setNotification({ message: 'You have already reserved this book.', type: 'warning' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const bookToReserve = books.find((book) => book.id === bookId);
    if (bookToReserve && bookToReserve.available) {
      const newReservation = {
        id: Date.now(), // Simple unique ID
        bookId: bookId,
        userId: currentUser.id,
        reservationDate: new Date().toLocaleDateString(),
      };
      setReservations([...reservations, newReservation]);
      setBooks(
        books.map((book) =>
          book.id === bookId ? { ...book, available: false } : book
        )
      );
      setDisplayedBooks(
        displayedBooks.map((book) =>
          book.id === bookId ? { ...book, available: false } : book
        )
      );
      setNotification({
        message: `"${bookToReserve.title}" has been reserved. You will be notified when it's available.`,
        type: 'success',
      });
      setTimeout(() => setNotification(null), 5000);
    } else {
      setNotification({ message: 'This book is currently unavailable.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCancelReservation = (reservationId) => {
    const reservationToRemove = reservations.find((res) => res.id === reservationId);
    if (reservationToRemove) {
      setReservations(reservations.filter((res) => res.id !== reservationId));
      setBooks(
        books.map((book) =>
          book.id === reservationToRemove.bookId ? { ...book, available: true } : book
        )
      );
      setDisplayedBooks(
        displayedBooks.map((book) =>
          book.id === reservationToRemove.bookId ? { ...book, available: true } : book
        )
      );
      setNotification({ message: 'Reservation cancelled.', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // --- Admin Dashboard Handlers (Simplified) ---
  const handleUpdateBook = (bookId, updatedBook) => {
    // In a real app, this would involve an API call
    setBooks(books.map((book) => (book.id === bookId ? updatedBook : book)));
    setDisplayedBooks(displayedBooks.map((book) => (book.id === bookId ? updatedBook : book)));
  };

  const handleDeleteBook = (bookId) => {
    // In a real app, this would involve an API call
    setBooks(books.filter((book) => book.id !== bookId));
    setDisplayedBooks(displayedBooks.filter((book) => book.id !== bookId));
    setReservations(reservations.filter((res) => res.bookId !== bookId));
  };

  return (
    <div>
      <h1>Library Management System</h1>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <BookSearch onSearch={handleSearch} />
      <BookList
        books={displayedBooks}
        onReserve={handleReserveBook}
        reservations={reservations}
        currentUser={currentUser}
      />

      {currentUser && (
        <>
          <ReservationList
            reservations={reservations}
            books={books}
            currentUser={currentUser}
            onCancelReservation={handleCancelReservation}
          />
          <UserProfile currentUser={currentUser} reservations={reservations} books={books} />
        </>
      )}

      {/* Basic Admin Dashboard Access (In a real app, implement proper authentication and routing) */}
      {currentUser && currentUser.id === 1 && ( // Assuming user ID 1 is the admin
        <AdminDashboard
          books={books}
          reservations={reservations}
          users={users}
          onUpdateBook={handleUpdateBook}
          onDeleteBook={handleDeleteBook}
        />
      )}
    </div>
  );
};

export default LibraryApp;

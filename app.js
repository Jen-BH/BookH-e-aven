// Global Variables
let bookSuggestions = [];
let highlightIdx = -1;
let selectedCoverUrl = '';

// Function to handle searching for books
async function searchBooks() {
  const query = document.getElementById('search-input').value.trim();

  if (query.length < 2) {
    hideSuggestions();
    return;
  }

  try {
    // Fetching books from Open Library API
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
    const data = await response.json();
    bookSuggestions = data.docs;
    renderSuggestions();
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Function to render book suggestions
function renderSuggestions() {
  const suggestionsBox = document.getElementById('book-suggestions');
  suggestionsBox.innerHTML = ''; // Clear existing suggestions

  if (bookSuggestions.length === 0) {
    suggestionsBox.style.display = 'none';
    return;
  }

  bookSuggestions.forEach((book, index) => {
    const suggestionHTML = `
      <div class="suggestion-item" data-index="${index}" onclick="selectSuggestion(${index})" onmouseover="highlightSuggestion(${index})">
        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="Book Cover">
        <div class="suggestion-details">
          <h4>${book.title}</h4>
          <p>${book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
        </div>
      </div>
    `;
    suggestionsBox.innerHTML += suggestionHTML;
  });

  suggestionsBox.style.display = 'block';
}

// Function to highlight a suggestion on hover
function highlightSuggestion(index) {
  const suggestions = document.querySelectorAll('.suggestion-item');
  suggestions.forEach(item => item.classList.remove('highlighted'));
  suggestions[index].classList.add('highlighted');
  highlightIdx = index;
}

// Function to select a book from suggestions
function selectSuggestion(index) {
  const selectedBook = bookSuggestions[index];
  document.getElementById('search-input').value = selectedBook.title;
  document.getElementById('author-input').value = selectedBook.author_name ? selectedBook.author_name.join(', ') : 'Unknown Author';
  document.getElementById('genre-input').value = selectedBook.subject ? selectedBook.subject.join(', ') : 'No genre available';

  const bookCover = document.getElementById('book-cover');
  selectedCoverUrl = `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`;
  bookCover.src = selectedCoverUrl;

  document.getElementById('book-suggestions').style.display = 'none'; // Hide suggestions after selection
}

// Function to clear suggestions when the input is empty or user stops typing
function hideSuggestions() {
  document.getElementById('book-suggestions').style.display = 'none';
}

// Function to open the modal for adding a book
function openAddBookModal() {
  document.getElementById('add-book-modal').style.display = 'block';
}

// Function to close the modal
function closeAddBookModal() {
  document.getElementById('add-book-modal').style.display = 'none';
}

// Function to handle book form submission
function addBook() {
  const title = document.getElementById('title-input').value;
  const author = document.getElementById('author-input').value;
  const genre = document.getElementById('genre-input').value;
  const synopsis = document.getElementById('synopsis-input').value;

  const newBook = {
    title,
    author,
    genre,
    synopsis,
    cover: selectedCoverUrl || 'default-cover.jpg',
  };

  // Save the new book in localStorage (or handle it however you like)
  let books = JSON.parse(localStorage.getItem('books')) || [];
  books.push(newBook);
  localStorage.setItem('books', JSON.stringify(books));

  closeAddBookModal();
  renderLibrary(); // Re-render the library
}

// Function to render the library from localStorage
function renderLibrary() {
  const library = document.getElementById('library');
  library.innerHTML = ''; // Clear existing library

  const books = JSON.parse(localStorage.getItem('books')) || [];

  books.forEach(book => {
    const bookHTML = `
      <div class="book-card">
        <img src="${book.cover}" alt="Book Cover">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Synopsis:</strong> ${book.synopsis}</p>
      </div>
    `;
    library.innerHTML += bookHTML;
  });
}

// Initialize library on page load
window.onload = () => {
  renderLibrary();
};
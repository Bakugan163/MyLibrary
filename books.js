    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const genre = document.getElementById("genre");
    const year = document.getElementById("year");
    const status = document.getElementById("status");

    const addButton = document.getElementById("addButton");
    const bookList = document.getElementById("bookList");

    const btnSearch = document.getElementById("btnSearch");
    const search = document.getElementById("search");
    const finded = document.getElementById("finded");

    const modal = document.getElementById("modal");
    const modalBookTitle = document.getElementById("modalBookTitle");
    const modalConfirmBtn = document.getElementById("modalConfirmBtn");
    const modalCancelBtn = document.getElementById("modalCancelBtn");
    const bookHeaders = document.getElementById("bookHeaders");
    let pendingDeleteId = null;

    let books = [];

    function saveToLocalStorage() {
    const booksJson = JSON.stringify(books);
    localStorage.setItem("books", booksJson);
}

    function loadFromLocalStorage() {
    let booksJson = localStorage.getItem("books");
    if (booksJson == null || booksJson == '') {
        return;
    }
    books = JSON.parse(booksJson);
 
    
}

function renderLibrary() {
    bookList.innerHTML = '';

    if (books.length > 0) {
        bookHeaders.style.display = 'flex';  
    } else {
        bookHeaders.style.display = 'none';
        }

    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        
        const statusIcon = book.status ? '✅' : '⬜';
        let li = document.createElement('li');
        
        
        let statusCheckbox = document.createElement('input');
        statusCheckbox.type = 'checkbox';
        statusCheckbox.checked = book.status;
        statusCheckbox.onchange = function() {
            toggleBookStatus(book.id);
        };
        li.appendChild(statusCheckbox);
        
        
        let bookInfo = document.createElement('div');
        bookInfo.className = 'book-info';
        
        let titleSpan = document.createElement('span');
        titleSpan.className = 'book-title';
        titleSpan.textContent = book.title;
        bookInfo.appendChild(titleSpan);
        
        let authorSpan = document.createElement('span');
        authorSpan.className = 'book-author';
        authorSpan.textContent = book.author;
        bookInfo.appendChild(authorSpan);
        
        let genreSpan = document.createElement('span');
        genreSpan.className = 'book-genre';
        genreSpan.textContent = book.genre;
        bookInfo.appendChild(genreSpan);
        
        let yearSpan = document.createElement('span');
        yearSpan.className = 'book-year';
        yearSpan.textContent = book.year || '—';
        bookInfo.appendChild(yearSpan);
        
        li.appendChild(bookInfo);
        
       
        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.classList.add('delete-btn-outline');
        deleteBtn.onclick = function() {
            openModal(book.id, book.title);
        };
        li.appendChild(deleteBtn);
        
        bookList.appendChild(li);
    }
}

    function addBook() {
    const titleValue = title.value.trim();
    const authorValue = author.value.trim();
    const genreValue = genre.value.trim();
    const yearValue = parseInt(year.value.trim());
    const statusValue = status.checked;

    if (titleValue === "" || authorValue === "") {
        alert("Заполните обязательные поля");
        return;
    }

    books.push({
        title: titleValue,
        author: authorValue,
        genre: genreValue,
        year: yearValue,
        id: Date.now(),
        status: statusValue
    });

    saveToLocalStorage();
    renderLibrary();
    title.value = '';
    author.value = '';
    genre.value = '';
    year.value = '';
    status.checked = false;
    title.focus();
}

    addButton.onclick = addBook;

        function toggleBookStatus(id) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            books[i].status = !books[i].status;
            break;
    }
    }
    saveToLocalStorage();
    renderLibrary();
}

        function searchBook() {
    const text = search.value.trim().toLowerCase();
    finded.innerHTML = '';
    if (text == '') {
        return;
    }


    for (let i = 0; i < books.length; i++) {
        if (books[i].title.toLowerCase().includes(text) ||
            books[i].author.toLowerCase().includes(text) ||
            books[i].year.toString().includes(text) ||
            books[i].genre.toString().toLowerCase().includes(text)) {

            const statusIcon = books[i].status ? '✅' : '⬜';
            const item = document.createElement('li');
            
            let statusCheckbox = document.createElement('input');
            statusCheckbox.type = 'checkbox';
            statusCheckbox.checked = books[i].status;
            statusCheckbox.onchange = function() {
                toggleBookStatus(books[i].id);
            };
            item.appendChild(statusCheckbox);
            
            let bookInfo = document.createElement('div');
            bookInfo.className = 'book-info';
            
            let titleSpan = document.createElement('span');
            titleSpan.className = 'book-title';
            titleSpan.textContent = books[i].title;
            bookInfo.appendChild(titleSpan);
            
            let authorSpan = document.createElement('span');
            authorSpan.className = 'book-author';
            authorSpan.textContent = books[i].author;
            bookInfo.appendChild(authorSpan);
            
            let genreSpan = document.createElement('span');
            genreSpan.className = 'book-genre';
            genreSpan.textContent = books[i].genre;
            bookInfo.appendChild(genreSpan);
            
            let yearSpan = document.createElement('span');
            yearSpan.className = 'book-year';
            yearSpan.textContent = books[i].year || '—';
            bookInfo.appendChild(yearSpan);
            
            item.appendChild(bookInfo);
            
            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Удалить';
            deleteBtn.classList.add('delete-btn-outline');
            deleteBtn.onclick = function() {
                openModal(books[i].id, books[i].title);
            
            
            };

            item.appendChild(deleteBtn);

            finded.append(item);
    }
    
}
}

    btnSearch.addEventListener('click', searchBook);
    search.addEventListener('input', searchBook);

     function openModal(id, title) {
    pendingDeleteId = id;
    modalBookTitle.textContent = title;
    modal.style.display = 'flex';


}

function closeModal() {
    modal.style.display = 'none';
    pendingDeleteId = null;
}

function deleteBookById(id) {
    let newBooks = [];
    for (let i = 0; i < books.length; i++) {
        if (books[i].id !== id) {
            newBooks.push(books[i]);
        }
    }
    books = newBooks;
    renderLibrary();
    saveToLocalStorage();
}

    const inputs = [title, author, genre, year];
    inputs.forEach(input => {
        input.onkeypress = function(event) {
            if (event.key === 'Enter') {
                addBook();
            }
        };
    });

  modalConfirmBtn.onclick = function() {
    if (pendingDeleteId !== null) {
        deleteBookById(pendingDeleteId);
        closeModal();
    }
  
};


        modalCancelBtn.onclick = closeModal;

        modal.onclick = function(event) {
            if (event.target === modal) closeModal();
       
        };



        loadFromLocalStorage();
        renderLibrary();

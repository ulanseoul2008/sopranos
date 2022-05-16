// Сохраняем API (базу данных) в переменную API
const API = "http://localhost:8000/books";

// Сохраняем элементы из html в переменные
let inpName = document.getElementById("inpName");
let inpAuthor = document.getElementById("inpAuthor");
let inpImage = document.getElementById("inpImage");
let inpPrice = document.getElementById("inpPrice");
let btnAdd = document.getElementById("btnAdd");
let sectionBooks = document.getElementById("sectionBooks");
let btnOpenForm = document.getElementById("flush-collapseOne");
let searchValue = ""; // peremennya dlya nashego poiska
let currentPage = 1; // pagination peremennaya
let countPage = 1; // number of all pages
// Навешиваем событие на кнопку Добавить
btnAdd.addEventListener("click", () => {
  if (
    // проверка на заполненность полей
    !inpName.value.trim() ||
    !inpAuthor.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Enter info!");
    return;
  }
  let newBook = {
    // создаём новый объект, куда добавляем значения наших инпутов
    bookName: inpName.value,
    bookAuthor: inpAuthor.value,
    bookImage: inpImage.value,
    bookPrice: inpPrice.value,
  };
  createBooks(newBook); // вызываем фунцию для добавления новой книги в базу данных и передаём в качестве аргумента объект, созданный выше
  readBooks(); // вызываем функцию для отображения данных
});

// ! ================= CREATE =====================
// Функция для добавления новых книг в базу данных (db.json)
function createBooks(book) {
  fetch(API, {
    // отправляем запрос с помощью метода POST, для отправки данных
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(book),
  }).then(() => readBooks());
  // Совершаем очистку инпутов
  inpName.value = "";
  inpImage.value = "";
  inpAuthor.value = "";
  inpPrice.value = "";
  // Меняем класс с помощью toggle у аккордиона, для того чтобы закрывался аккордион при клике на кнопку добавить
  btnOpenForm.classList.toggle("show");
}

// !=============== READ ====================
// Создаём функцию для отображения
function readBooks() {
  // we sent request to db.json with the setup of searching and pagination. Symbol q - for seaching an element in all database. & - we add new nastroiki into old ones. _page - for opening exact page. _limit - displaying several elements on website
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`) // получение данных из db.json
    .then((res) => res.json())
    .then((data) => {
      sectionBooks.innerHTML = ""; // очищаем тег section, чтобы не было дубликатов
      data.forEach((item) => {
        // console.log(item.id);
        // перебираем наш полученный массив с объектами
        // добавляем в наш тег section вёрстку карточек с данными из массива, при каждом цикле
        sectionBooks.innerHTML += `
        <div class="card mt-3" style="width: 20rem;">
        <img src="${item.bookImage}" class="card-img-top" style="height:280px" alt="${item.bookName}">
         <div class="card-body">
        <h5 class="card-title">${item.bookName}</h5>
        <p class="card-text">${item.bookAuthor}</p>
        <p class="card-text">${item.bookPrice}</p>
        <button class="btn btn-outline-secondary btnDelete" id="${item.id}">
        Delete
        </button>
        <button class="btn btn-outline-info btnEdit" id="${item.id}" data-bs-toggle="modal"
        data-bs-target="#exampleModal">
        Change
        </button>
        </div>
        </div>
        `;
      });
      sumPage(); // calling function for defining the amount of the pages
    });
}
readBooks(); // один раз вызываем функцию отображения данных для того, чтобы при первом посещении сайта данные отобразились

// ! ============= DELETE =============
// Событие на кнопку удалить
document.addEventListener("click", (event) => {
  // с помощью объекта event ищем класс нашего элемента
  let del_class = [...event.target.classList]; // Сохраняем массив с классами в переменную, используя spread оператор
  if (del_class.includes("btnDelete")) {
    // проверяем, есть ли в нашем поиске класс btnDelete
    let del_id = event.target.id; // сохраняем в переменную id нашего элемента по которому кликнули
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readBooks()); // для того, чтобы вызов функции отображения данных, подождал пока запрос DELETE выполнился, а затем сработал
  }
});

// ! =============== EDIT ==============
// Сохраняем в переменные названия инпутов и кнопки
let editInpName = document.getElementById("editInpName");
let editInpAuthor = document.getElementById("editInpAuthor");
let editInpImage = document.getElementById("editInpImage");
let editInpPrice = document.getElementById("editInpPrice");
let editBtnSave = document.getElementById("editBtnSave");

// sobytiya na knopku izmenit
document.addEventListener("click", (event) => {
  //dfdf+++++++++++++++++
  let editArr = [...event.target.classList];

  if (editArr.includes("btnEdit")) {
    // proveryaem est' li v massive s klassami nash class btnEdit
    let id = event.target.id; //we save into perem id, id of our element
    fetch(`${API}/${id}`) //  via request get we call to konkretnomu object
      .then((res) => res.json())
      .then((data) => {
        // we save in the input of the modal window data from db.json
        editInpName.value = data.bookName;
        editInpAuthor.value = data.bookAuthor;
        editInpImage.value = data.bookImage;
        editInpPrice.value = data.bookPrice;
        // we add via setAttribute method id into our button "save" in order to pass(peredat') it later into the arguments editBook
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

// events on the button "save"
editBtnSave.addEventListener("click", () => {
  // we create an obj with edited data to send them to db.json
  let editedBook = {
    bookName: editInpName.value,
    bookAuthor: editInpAuthor.value,
    bookImage: editInpImage.value,
    bookPrice: editInpPrice.value,
  };
  // console.log(editBtnSave.id);
  editBook(editedBook, editBtnSave.id); //call function for sending changed data into db.json v kachestve argementa peredaem the created obj and value of the  "attribute id" from the button "save"
});

// function for sending the changed data to db.json
function editBook(objEditBook, id) {
  // we recieve into parametres: changed object and id we will call
  fetch(`${API}/${id}`, {
    method: "PATCH", // we use PATCH method for requesting about changing data in db.json
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditBook),
  }).then(() => readBooks()); //call func for displaying data right after clicking on the "save" btn
}

// ! =============== SEARCH ==============
//we save into peremenn of search from index.html
let inpSearch = document.getElementById("inpSearch");
inpSearch.addEventListener("input", (event) => {
  searchValue = event.target.value; // we save into pere the value of input
  readBooks(); // we call display funct right after changing the input "search"
});

// ! =============== PAGINATION ==============
// we save into peremennye buttons "next" and "prev" from ixdex.html for pagination
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

// events on the btn prev
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return; //proper condition
  currentPage = currentPage - 1;
  readBooks();
});
//events on the btn next
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return; // proper condition
  currentPage = currentPage + 1; // diminishing of the current page if return condition doesn't work
  readBooks(); // calling function for displaying data after clicking btn next
});
// funct for defining the number of pages
function sumPage() {
  fetch(API) // request to db.json for getting all the array with books
    .then((res) => res.json()) // reformatting into usual format
    .then((data) => {
      // we save into set var the whole number of the pages, via length method we can learn the length  of the array.
      countPage = Math.ceil(data.length / 6); // округлять the result
    });
}

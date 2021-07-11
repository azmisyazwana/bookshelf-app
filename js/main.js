const INCOMPLETE_BOOK_SHELF_ID = "incompleteBookshelfList"
const COMPLETE_BOOK_SHELF_ID = "completeBookshelfList"
const BOOK_ITEMID = "bookId"
const submitForm = document.getElementById("inputBook")
const checkBox = document.getElementById("inputBookIsComplete")
const searchBookInput = document.forms["searchBook"]

searchBookInput.addEventListener("keyup", searchBook)

let clicked = 0

function completeCheckBox(click){
    if (click === 1){
        return true
    }else{
        return false
    }
}
checkBox.addEventListener("change", function(){
    if(this.checked){
        clicked = 1
    }else{
        clicked = 0
    }
    return clicked
})

document.addEventListener("DOMContentLoaded", function(){
    submitForm.addEventListener("submit", function(event){
        addToBookShelf()
        event.preventDefault();
    })

    if(isStorageExist()){
        loadDataFromStorage()
    }
})

document.addEventListener("ondatasaved", ()=>{
    console.log("Data disimpan")
})

document.addEventListener("ondataloaded", ()=>{
    refreshDataFromBookShelf()
})

function containerBookShelf(inputBookTitle, inputBookAuthor, inputBookYear, isCompleted){

    const containerImg = document.createElement("div")
    containerImg.classList.add("col-left-bookshelf")

    const imgCompleted = document.createElement("img")
    imgCompleted.setAttribute("src", "assets/closed.png")

    const imgIncompleted = document.createElement("img")
    imgIncompleted.setAttribute("src", "assets/open.png")

    const containerBookElement = document.createElement("div")
    containerBookElement.classList.add("col-right-bookshelf")

    const bookTitle = document.createElement("h3")
    bookTitle.innerText = inputBookTitle

    const bookAuthor = document.createElement("p")
    bookAuthor.innerText = "Penulis: "
    const isiBookAuthor = document.createElement("span")
    isiBookAuthor.innerText = inputBookAuthor
    bookAuthor.append(isiBookAuthor)

    const bookYear = document.createElement("p")
    bookYear.classList.add("book_year")
    bookYear.innerText = "Tahun: "
    const isiBookYear = document.createElement("span")
    isiBookYear.innerText = inputBookYear
    bookYear.append(isiBookYear)

    const containerBook = document.createElement("article")
    containerBook.classList.add("book_item")

    containerBookElement.append(bookTitle, bookAuthor, bookYear)

    const containerButton = document.createElement("div")
    containerButton.classList.add("action")


    if(isCompleted){
        containerImg.append(imgCompleted)
        containerBook.append(containerImg, containerBookElement)
        containerButton.append(createIncompleteButton(), createDeleteButton(), createEditButton())
        containerBook.append(containerButton)
    }else{
        containerImg.append(imgIncompleted)
        containerBook.append(containerImg, containerBookElement)
        containerButton.append(createCompleteButton(), createDeleteButton(), createEditButton())
        containerBook.append(containerButton)
    }
    
    return containerBook
}

function addToBookShelf(){
    const incompleteBookShelf = document.getElementById(INCOMPLETE_BOOK_SHELF_ID)
    const completeBookShelf = document.getElementById(COMPLETE_BOOK_SHELF_ID)

    const inputBookTitle = document.getElementById("inputBookTitle").value
    const inputBookAuthor = document.getElementById("inputBookAuthor").value
    const inputBookYear = document.getElementById("inputBookYear").value

    if (completeCheckBox(clicked)){
        const bookShelf = containerBookShelf(inputBookTitle, inputBookAuthor, inputBookYear, true)
        const bookShelfObject = bookShelfToObject(inputBookTitle, inputBookAuthor, inputBookYear, true)
        bookShelf[BOOK_ITEMID] = bookShelfObject.id
        arrayBookShelf.push(bookShelfObject)
        
        completeBookShelf.append(bookShelf)
    }else{
        const bookShelf = containerBookShelf(inputBookTitle, inputBookAuthor, inputBookYear, false)
        const bookShelfObject = bookShelfToObject(inputBookTitle, inputBookAuthor, inputBookYear, false)
        bookShelf[BOOK_ITEMID] = bookShelfObject.id
        arrayBookShelf.push(bookShelfObject)

        incompleteBookShelf.append(bookShelf)
    }
    updateDataToStorage()
}



function createButton(classType, eventListener, buttonText){
    const button = document.createElement("button")
    button.classList.add(classType)
    button.innerText = buttonText
    button.addEventListener("click", function(event){
        eventListener(event)
    })
    return button;
}

function deleteBook(element){
    const bookPosition = findBookIndex(element[BOOK_ITEMID])
    arrayBookShelf.splice(bookPosition, 1)

    element.remove();

    updateDataToStorage()
}

function createCompleteButton(){
    return createButton("green", function(event){
        addToCompleteShelf(event.target.parentElement.parentElement)
    }, "Finished")
}

function createDeleteButton(){
    return createButton("red", function(event){
        deleteBook(event.target.parentElement.parentElement)
    }, "Delete book")
}

function createIncompleteButton(){
    return createButton("green", function(event){
        addToIncompleteShelf(event.target.parentElement.parentElement)
    }, "Unfinished")
}

function addToCompleteShelf(element){
    const completeBookShelf = document.getElementById(COMPLETE_BOOK_SHELF_ID)

    const bookTitle = element.querySelector(".col-right-bookshelf > h3").innerText
    const bookAuthor = element.querySelector("p > span").innerText 
    const bookYear= element.querySelector(".book_year > span").innerText

    const bookShelf = containerBookShelf(bookTitle, bookAuthor, bookYear, true)
    const book = findBook(element[BOOK_ITEMID])
    book.isCompleted = true
    bookShelf[BOOK_ITEMID] = book.id

    completeBookShelf.append(bookShelf)
    element.remove()

    updateDataToStorage()
}

function addToIncompleteShelf(element){
    const incompleteBookShelf = document.getElementById(INCOMPLETE_BOOK_SHELF_ID)

    const bookTitle = element.querySelector(".col-right-bookshelf > h3").innerText
    const bookAuthor = element.querySelector("p > span").innerText 
    const bookYear= element.querySelector(".book_year > span").innerText

    const bookShelf = containerBookShelf(bookTitle, bookAuthor, bookYear, false)
    const book = findBook(element[BOOK_ITEMID])
    book.isCompleted = false
    bookShelf[BOOK_ITEMID] = book.id

    incompleteBookShelf.append(bookShelf)
    element.remove()

    updateDataToStorage()
}

function refreshDataFromBookShelf(){
    const incompleteBookShelf = document.getElementById(INCOMPLETE_BOOK_SHELF_ID)
    const completeBookShelf = document.getElementById(COMPLETE_BOOK_SHELF_ID)

    for (item of arrayBookShelf){
        const book = containerBookShelf(item.title, item.author, item.year, item.isCompleted) 
        book[BOOK_ITEMID] = item.id

        if(item.isCompleted){
            completeBookShelf.append(book)
        }else{
            incompleteBookShelf.append(book)
        }
    }
}

function toEditBookForm(element){
    const bookTitle = element.querySelector(".col-right-bookshelf > h3").innerText
    const bookAuthor = element.querySelector("p > span").innerText 
    const bookYear= element.querySelector(".book_year > span").innerText
    const bookPosition = findBookIndex(element[BOOK_ITEMID])
    arrayBookShelf.splice(bookPosition, 1)

    element.innerHTML = `
<section class="input_edit book_item">
    <h3>Edit Buku</h3>
    <form id="formEditBook">
        <div class="input_edit_book">
            <label for="editBookTitle" class ="title">Judul</label>
            <input id="editBookTitle" type="text" value=${bookTitle} required>
        </div>
        <div class="input_edit_book">
            <label for="editBookAuthor" class="author">Penulis</label>
            <input id="editBookAuthor" type="text" value=${bookAuthor} required>
        </div>
        <div class="input_edit_book">
            <label for="editBookYear" class="year">Tahun</label>
            <input id="editBookYear" type="number" value=${bookYear} required>
        </div>
        <div class="button_edit">
            <button class = "blue-edit" id="submitEdit" type="submit">Save</button>
            <button class = "white-edit" id="cancelEdit" type=>Cancel</button>
        </div>
    </form>
</section>`

    const form = element.querySelector("#formEditBook")
    const cancel = element.querySelector("#cancelEdit")

    cancel.addEventListener("click", function(){
        cancelFormEdit(element, bookTitle, bookAuthor, bookYear)
        element.remove()
    })

    form.addEventListener("submit", function(){
        addEditedToBookShelf(element)
        element.remove()
    })
}

function createEditButton(){
    return createButton("white", function(event){
        toEditBookForm(event.target.parentElement.parentElement)
    },"Edit Book")
}

function addEditedToBookShelf(element){
    const incompleteBookShelf = document.getElementById(INCOMPLETE_BOOK_SHELF_ID)
    const completeBookShelf = document.getElementById(COMPLETE_BOOK_SHELF_ID)

    const editBookTitleValue = element.querySelector(".input_edit_book > #editBookTitle").value
    const editBookAuthorValue = element.querySelector(".input_edit_book > #editBookAuthor").value
    const editBookYearValue = element.querySelector(".input_edit_book > #editBookYear").value

    if (addEditedToCompleteBookShelf(element)){
        const bookShelf = containerBookShelf(editBookTitleValue, editBookAuthorValue, editBookYearValue, true)
        const bookShelfObject = bookShelfToObject(editBookTitleValue, editBookAuthorValue, editBookYearValue, true)
        bookShelf[BOOK_ITEMID] = bookShelfObject.id
        arrayBookShelf.push(bookShelfObject)
        
        completeBookShelf.append(bookShelf)
    }else{
        const bookShelf = containerBookShelf(editBookTitleValue, editBookAuthorValue, editBookYearValue, false)
        const bookShelfObject = bookShelfToObject(editBookTitleValue, editBookAuthorValue, editBookYearValue, false)
        bookShelf[BOOK_ITEMID] = bookShelfObject.id
        arrayBookShelf.push(bookShelfObject)

        incompleteBookShelf.append(bookShelf)
    }
    updateDataToStorage()
}

function addEditedToCompleteBookShelf(element){
    if (element.parentElement.id === "completeBookshelfList"){
        return true
    }else{
        return false
    }
}

function cancelFormEdit(element, bookTitle, bookAuthor, bookYear){
    
    const incompleteBookShelf = document.getElementById(INCOMPLETE_BOOK_SHELF_ID)
    const completeBookShelf = document.getElementById(COMPLETE_BOOK_SHELF_ID)
    if (addEditedToCompleteBookShelf(element)){
        const bookShelf = containerBookShelf(bookTitle, bookAuthor, bookYear, true)
        const bookShelfObject = bookShelfToObject(bookTitle, bookAuthor, bookYear, true)
        bookShelf[BOOK_ITEMID] = bookShelfObject.id
        arrayBookShelf.push(bookShelfObject)
        
        completeBookShelf.append(bookShelf)
    }else{
        const bookShelf = containerBookShelf(bookTitle, bookAuthor, bookYear, false)
        const bookShelfObject = bookShelfToObject(bookTitle, bookAuthor, bookYear, false)
        bookShelf[BOOK_ITEMID] = bookShelfObject.id
        arrayBookShelf.push(bookShelfObject)

        incompleteBookShelf.append(bookShelf)
    }
}



function searchBook(event){
    const inputSearchBookToLowerCase = event.target.value.toLowerCase()
    let itemList = document.querySelectorAll(".book_item")
    itemList.forEach((item)=>{
        const bookTitle = item.children[1].children[0].innerText.toLowerCase()

        if(bookTitle.indexOf(inputSearchBookToLowerCase) == -1){
            item.style.display = "none"
        }else{
            item.style.display = "block"
        }
    })
}

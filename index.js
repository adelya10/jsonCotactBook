const PI = " http://localhost:8000/contact";

let inpName = document.querySelector("#name");
let inpLastName = document.querySelector("#lastName");
let inpNum = document.querySelector("#number");
let inpImage = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");
let emaxpleModel = document.querySelector("#exampleModal");

let list = document.querySelector("#content_list");
btnAdd.addEventListener("click", async function () {
  let obj = {
    inpName: inpName.value,
    inpLastName: inpLastName.value,
    inpNum: inpNum.value,
    inpImage: inpImage.value,
  }; //проверкка на заполненость
  //   render();
  if (
    !obj.inpName.trim() ||
    !obj.inpLastName.trim() ||
    !obj.inpNum.trim() ||
    !obj.inpImage.trim()
  ) {
    alert("fiil in the blanks");
    return;
  }
  await fetch(PI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }, //кодировка
    body: JSON.stringify(obj),
  });

  //очишение после нажатия на enter
  inpName.value = "";
  inpLastName.value = "";
  inpNum.value = "";
  inpImage.value = "";
  render();
});
async function render() {
  let contacts = await fetch(PI) //Отправка get запроса
    .then((res) => res.json()) //переводим всё в json формат
    .catch((err) => console.log(err)); //в случае ошибки
  //   console.log(products);
  list.innerHTML = "";
  contacts.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card m-3 " style="max-width: 310px;">
<div class="row g-0">
  <div class="col-md-4">
    <img src="${element.inpImage}" class="img-fluid rounded-start" alt="...">
  </div>
  <div class="col-md-8">
    <div class="card-body">
      <h5 class="card-title">${element.inpName}</h5>
      <p class="card-text">${element.inpLastName}</p>
      <p class="card-text">${element.inpNum}</p>
      <a href="#" id='${element.id}' 
      class="btn btn-delete">Delete</a>
      <a href="#" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn  btn-edit">Edit</a>
    </div>
  </div>
</div>
</div>`;
    list.append(newElem);
  });
}
render();

// delete start
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${PI}/${id}`, {
      method: "DELETE",
    }).then(() => render());
  }
});

//eedit
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${PI}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        inpImage.value = data.inpImage;
        inpName.value = data.inpName;
        inpLastName.value = data.inpLastName;
        inpNum.value = data.inpNum;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});
editSaveBtn.addEventListener("click", function () {
  let id = this.id; /// вытаскиваем из кнопки id и ложим его в переменную

  let image = inpImage.value;
  let name = inpName.value;
  let lastName = inpLastName.value;
  let num = inpNum.value;

  if (!image || !name || !lastName || !num) return; //проверка на заполненость полей модального окна

  let editContact = {
    inpImage: inpImage.value,
    inpName: inpName.value,
    inpLastName: inpLastName.value,
    inpNum: inpNum.value,
  };
  saveEdit(editContact, id);
});
function saveEdit(edittedContact, id) {
  fetch(`${PI}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(edittedContact),
  }).then(() => {
    render();
  });
  let modal = bootstrap.Modal.getInstance(emaxpleModel);
  modal.hide();
}

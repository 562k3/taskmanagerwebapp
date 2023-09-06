let editingTask = null;

const everydayCheckbox = document.getElementById("everyday");
everydayCheckbox.addEventListener("change", updateDueDate);

function updateDueDate() {
  const dateInput = document.getElementById("date");
  const originalDueDate = new Date(dateInput.value);

  if (everydayCheckbox.checked) {
    if (!isNaN(originalDueDate.getTime())) {
      originalDueDate.setDate(originalDueDate.getDate() + 1);

      const year = originalDueDate.getFullYear();
      const month = String(originalDueDate.getMonth() + 1).padStart(2, "0");
      const day = String(originalDueDate.getDate()).padStart(2, "0");

      dateInput.value = `${year}-${month}-${day}`;
    }
  }
}

function signUp() {
  const username = document.getElementById("signupusername").value;
  const password = document.getElementById("signuppwd").value;

  if(!username || !password) {
    alert("Kindly sign up first!");
  }else{
    alert("You have successfully signed up;")
    showTaskManager();
  }

  const user = {
      username: username,
      password: password,
  };

  localStorage.setItem(username, JSON.stringify(user));
  username.value = "";
  password.value = "";
}

function logIn() {
  const username = document.getElementById("loginusername").value;
  const password = document.getElementById("loginpwd").value;

  const storedUser = localStorage.getItem(username);

  if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.password === password) {
          alert("Login successful!");
          showTaskManager();
      } else {
          alert("Incorrect password. Please try again.");
      }
  } else {
      alert("User not found. Please sign up first.");
  }
  username.value = "";
  password.value = "";
}

function showTaskManager() {
  const signUpDiv = document.querySelector(".first-page");
  const taskManagerDiv = document.querySelector(".task-manager");

  signUpDiv.style.display = "none";

  taskManagerDiv.style.display = "block";
}
function addTask() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  if (!title || !date || !description || !category) {
    alert("Please fill in all fields.");
    return;
  }

  const newRow = document.createElement("tr");
  newRow.classList.add("task-row");
  newRow.innerHTML = `
        <td><input type="checkbox" class="complete-checkbox" onchange="updateTaskStatus(this)"></td>
        <td>${title}</td>
        <td>${date}</td>
        <td>${description}</td>
        <td>${category}</td>
        <td class="status">Pending</td>
        <td class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></td>
        <td class="delete-btn"><i class="fa-solid fa-trash-arrow-up"></i></td>
    `;

  const taskListContainer = document.getElementById("task-list-container");
  taskListContainer.appendChild(newRow);

  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";

  const completeCheckbox = newRow.querySelector(".complete-checkbox");
  completeCheckbox.addEventListener("change", () =>
    updateTaskStatus(completeCheckbox)
  );

  const editButton = newRow.querySelector(".edit-btn");
  editButton.addEventListener("click", () => editTask(newRow));

  const deleteButton = newRow.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () => deleteTask(newRow));

  saveTasksToLocalStorage();
}

function updateTaskStatus(checkbox) {
  const row = checkbox.parentNode.parentNode;
  const statusCell = row.querySelector(".status");
  statusCell.textContent = checkbox.checked ? "Complete" : "Pending";

  saveTasksToLocalStorage();
}

function deleteTask(row) {
  row.remove();

  saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
  const taskListContainer = document.getElementById("task-list-container");
  const rows = taskListContainer.querySelectorAll(".task-row");

  const tasks = [];
  rows.forEach((row) => {
    const title = row.cells[1].textContent;
    const date = row.cells[2].textContent;
    const description = row.cells[3].textContent;
    const category = row.cells[4].textContent;
    const status = row.cells[5].textContent === "Complete";

    tasks.push({ title, date, description, category, status });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const taskListContainer = document.getElementById("task-list-container");
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (savedTasks) {
    savedTasks.forEach((task) => {
      const newRow = document.createElement("tr");
      newRow.classList.add("task-row");
      newRow.innerHTML = `
                <td><input type="checkbox" class="complete-checkbox" onchange="updateTaskStatus(this)" ${
                  task.status ? "checked" : ""
                }></td>
                <td>${task.title}</td>
                <td>${task.date}</td>
                <td>${task.description}</td>
                <td>${task.category}</td>
                <td class="status">${task.status ? "Complete" : "Pending"}</td>
                <td class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></td>
                <td class="delete-btn"><i class="fa-solid fa-trash-arrow-up"></i></td>
            `;

      taskListContainer.appendChild(newRow);

      const completeCheckbox = newRow.querySelector(".complete-checkbox");
      completeCheckbox.addEventListener("change", () =>
        updateTaskStatus(completeCheckbox)
      );

      const editButton = newRow.querySelector(".edit-btn");
      editButton.addEventListener("click", () => editTask(newRow));

      const deleteButton = newRow.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () => deleteTask(newRow));
    });
  }
}

window.onload = function () {
  loadTasksFromLocalStorage();
  var today = new Date().toISOString().split("T")[0];
  document.getElementsByName("setTodaysDate")[0].setAttribute("min", today);
};

document.getElementById("searchButton").addEventListener("click", searchTasks);
document.getElementById("clearButton").addEventListener("click", clearButton);

document.getElementById("sort").addEventListener("change", sortTasks);
function clearButton() {
  document.querySelector(".searchBox").value = "";
  searchTasks();
}
function searchTasks() {
  const searchBox = document.querySelector(".searchBox");
  const searchTerm = searchBox.value.toLowerCase();
  const taskRows = document.querySelectorAll(".task-row");

  taskRows.forEach((row) => {
    const title = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    const description = row
      .querySelector("td:nth-child(4)")
      .textContent.toLowerCase();
    const category = row
      .querySelector("td:nth-child(5)")
      .textContent.toLowerCase();

    if (
      title.includes(searchTerm) ||
      description.includes(searchTerm) ||
      category.includes(searchTerm)
    ) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
}
function sortTasks() {
  const sortCriteria = document.getElementById("sort").value;
  const taskListContainer = document.getElementById("task-list-container");
  const rows = Array.from(taskListContainer.querySelectorAll(".task-row"));
  rows.sort((a, b) => {
    let aValue, bValue;

    if (sortCriteria === "status") {
      aValue = a.querySelector(".status").textContent.toLowerCase();
      bValue = b.querySelector(".status").textContent.toLowerCase();
    } else if (sortCriteria === "due date") {
      aValue = a.cells[2].textContent.toLowerCase();
      bValue = b.cells[2].textContent.toLowerCase();
    } else if (sortCriteria === "title") {
      aValue = a.cells[1].textContent.toLowerCase();
      bValue = b.cells[1].textContent.toLowerCase();
    } else if (sortCriteria === "category") {
      aValue = a.cells[4].textContent.toLowerCase();
      bValue = b.cells[4].textContent.toLowerCase();
    }

    return aValue.localeCompare(bValue);
  });
  taskListContainer.innerHTML = "";

  rows.forEach((row) => {
    taskListContainer.appendChild(row);
  });
}

function editTask(button) {
  const row = button.closest(".tbody");
  const title = row.cells[1].textContent;
  const date = row.cells[2].textContent;
  const description = row.cells[3].textContent;
  const category = row.cells[4].textContent;
  document.getElementById("title").value = title;
  document.getElementById("date").value = date;
  document.getElementById("description").value = description;
  document.getElementById("category").value = category;
  editingTask = row;
}

document.getElementById("searchButton").addEventListener("click", searchTasks);
document
  .querySelector(".searchBox")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchTasks();
    }
  });

function modaltoggle() {}
function editTask(row) {
  const modal = document.querySelector(".modal");
  modal.classList.add("modal-show");
  const title = row.cells[1].textContent;
  const date = row.cells[2].textContent;
  const description = row.cells[3].textContent;
  document.getElementById("edit-title").value = title;
  document.getElementById("edit-date").value = date;
  document.getElementById("edit-description").value = description;
  editingTask = row;
}

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.classList.remove("modal-show");
}

function saveModal() {
  if (editingTask) {
    editingTask.cells[1].textContent =
      document.getElementById("edit-title").value;
    editingTask.cells[2].textContent =
      document.getElementById("edit-date").value;
    editingTask.cells[3].textContent =
      document.getElementById("edit-description").value;
    editingTask = null;
    closeModal();
    saveTasksToLocalStorage();
  }
}

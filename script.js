console.log("Student Dashboard Loaded");

const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }
});

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");



/* CREATE TASK ELEMENT */

function createTask(taskText) {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = taskText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}



/* SAVE TASKS TO LOCAL STORAGE */

function saveTasks() {

    const tasks = [];

    document.querySelectorAll("#taskList li span").forEach(task => {
        tasks.push(task.textContent);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}



/* LOAD TASKS WHEN PAGE OPENS */

function loadTasks() {

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    storedTasks.forEach(task => {
        createTask(task);
    });

}

loadTasks();



/* ADD TASK BUTTON */

addTaskBtn.addEventListener("click", () => {

    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    createTask(taskText);

    saveTasks();

    taskInput.value = "";
    taskInput.focus();

});



/* ENTER KEY SUPPORT */

taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTaskBtn.click();
    }
});
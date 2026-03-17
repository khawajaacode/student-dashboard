// script.js
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
const emptyMsg   = document.getElementById("emptyMsg");
const filterBtns = document.querySelectorAll(".filter-btn");

let activeFilter = "all";


/* CREATE TASK ELEMENT (now supports completed state) */
function createTask(taskText, completed = false) {

    const li = document.createElement("li");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = completed;

    // text
    const span = document.createElement("span");
    span.textContent = taskText;

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // events
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            li.classList.add("completed");
            // move completed tasks to the end
            taskList.appendChild(li);
        } else {
            li.classList.remove("completed");
            // move unchecked task to top
            taskList.insertBefore(li, taskList.firstChild);
        }
        saveTasks();
        applyFilter(activeFilter);
    });

    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    // structure: [checkbox] [text span] [delete]
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // apply completed class if needed
    if (completed) li.classList.add("completed");

    taskList.appendChild(li);

}


/* SAVE TASKS TO LOCAL STORAGE (store objects with completed flag) */
function saveTasks() {
    const tasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {
        const text = li.querySelector("span").textContent;
        const checked = li.querySelector("input[type='checkbox']").checked;
        tasks.push({ text, completed: checked });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* LOAD TASKS WHEN PAGE OPENS */
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // load incomplete tasks first, then completed so order is sensible
    storedTasks
        .filter(t => !t.completed)
        .forEach(t => createTask(t.text, false));
    storedTasks
        .filter(t => t.completed)
        .forEach(t => createTask(t.text, true));

        applyFilter(activeFilter);
}

loadTasks();


/* ADD TASK BUTTON */
addTaskBtn.addEventListener("click", () => {

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTask(taskText, false);
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

function updateEmptyMessage() {
    const visibleTasks = taskList.querySelectorAll("li:not(.hidden)");
    emptyMsg.style.display = visibleTasks.length === 0 ? "block" : "none";
}

function applyFilter(filter) {
    taskList.querySelectorAll("li").forEach(li => {
        const isCompleted = li.classList.contains("completed");
        if (filter === "all") {
            li.classList.remove("hidden");
        } else if (filter === "completed") {
            isCompleted ? li.classList.remove("hidden") : li.classList.add("hidden");
        } else if (filter === "pending") {
            !isCompleted ? li.classList.remove("hidden") : li.classList.add("hidden");
        }
    });
    updateEmptyMessage();
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        applyFilter(activeFilter);
    });
});
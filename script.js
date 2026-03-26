
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



const timerDisplay = document.getElementById("timerDisplay");
const startBtn     = document.getElementById("startBtn");
const pauseBtn     = document.getElementById("pauseBtn");
const resetBtn     = document.getElementById("resetBtn");

const DEFAULT_TIME = 1500;
const modeBtns = document.querySelectorAll(".mode-btn");

modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        modeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;

        totalSeconds = parseInt(btn.dataset.time);
        updateDisplay();
    });
});
let totalSeconds   = DEFAULT_TIME;
let timerInterval  = null;
let isRunning      = false;

function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
}

startBtn.addEventListener("click", () => {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            playAlertSound();
            timerDisplay.textContent = "00:00";
            return;
        }
        totalSeconds--;
        updateDisplay();
    }, 1000);
});

pauseBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    isRunning = false;
    totalSeconds = DEFAULT_TIME;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    updateDisplay();
});

updateDisplay();


function playAlertSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.5);
}
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
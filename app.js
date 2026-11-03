
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const totalCount = document.getElementById("total-count");
const clearButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = [];
let currentFilter = "all";

// Load saved tasks
function load() {
    try {
        const saved = localStorage.getItem("tasks");
        const data = saved ? JSON.parse(saved) : [];

        tasks = Array.isArray(data) ? data.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.done === "boolean"
        ) : [];

    } catch (error) {
        console.error("Unable to load tasks:", error);
        tasks = [];
    }
}

// Save tasks
function save() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Unable to save tasks:", error);
    }
}

// Render tasks
function render() {
    list.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "done") return task.done;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.id = task.id;

        if (task.done) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.className = "complete-btn";
        checkbox.setAttribute("aria-label", "Complete task");

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        li.append(checkbox, span, deleteButton);
        list.appendChild(li);
    });

    const remaining = tasks.filter(task => !task.done).length;

    counter.textContent = `${remaining} tasks left`;
    totalCount.textContent = `${tasks.length} total tasks`;
}

// Add task
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    tasks.push({
        id: crypto.randomUUID(),
        text: text,
        done: false
    });

    save();
    render();

    input.value = "";
    input.focus();
});

// Event delegation: complete and delete
list.addEventListener("click", function(event) {
    const li = event.target.closest(".task-item");

    if (!li) return;

    const id = li.dataset.id;

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);
    }

    if (event.target.classList.contains("complete-btn")) {
        const task = tasks.find(task => task.id === id);

        if (task) {
            task.done = event.target.checked;
        }
    }

    save();
    render();
});

// Filters
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        render();
    });
});

// Clear completed tasks
clearButton.addEventListener("click", function() {
    tasks = tasks.filter(task => !task.done);

    save();
    render();
});

// Initialize app
load();
render();

/* ==========================================
   TASKFLOW - USER MODULE
   ========================================== */

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}


/* ==========================================
   ADD TASK
   ========================================== */

function addTask(event) {
    event.preventDefault();

    const user = getLoggedInUser();

    if (!user) {
        alert("Please login first.");
        window.location.href = "../login.html";
        return;
    }

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const project = document.getElementById("project").value.trim();
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;

    if (!title || !project || !deadline || !priority) {
        alert("Please fill all required fields.");
        return;
    }

    let tasks = getTasks();

    const newTask = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        title: title,
        description: description,
        project: project,
        deadline: deadline,
        priority: priority,
        status: status || "pending",
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks(tasks);

    alert("Task created successfully!");
    window.location.href = "user-dashboard.html";
}


/* ==========================================
   DISPLAY USER DASHBOARD
   ========================================== */

function loadUserDashboard() {
    const user = getLoggedInUser();

    if (!user) {
        window.location.href = "../login.html";
        return;
    }

    const welcomeName = document.getElementById("welcomeName");

    if (welcomeName) {
        welcomeName.textContent = user.name;
    }

    const userTasks = getTasks().filter(
        task => task.userId === user.id
    );

    const completedTasks = userTasks.filter(
        task => task.status === "completed"
    );

    const pendingTasks = userTasks.filter(
        task => task.status !== "completed"
    );

    const highTasks = userTasks.filter(
        task => task.priority === "High" && task.status !== "completed"
    );

    updateElement("totalTasks", userTasks.length);
    updateElement("completedTasks", completedTasks.length);
    updateElement("pendingTasks", pendingTasks.length);
    updateElement("highTasks", highTasks.length);

    const progress =
        userTasks.length === 0 ?
        0 :
        Math.round(
            (completedTasks.length / userTasks.length) * 100
        );

    updateElement("progressPercent", progress + "%");

    const progressFill = document.getElementById("progressFill");

    if (progressFill) {
        progressFill.style.width = progress + "%";
    }

    displayTasks(userTasks);
    updateNotification(pendingTasks);
}


/* ==========================================
   DISPLAY TASKS
   ========================================== */

function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");

    if (!taskList) return;

    if (taskCount) {
        taskCount.textContent = tasks.length + " task(s)";
    }

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No tasks found</h3>
                <p>Create your first task to get started.</p>
                <a href="add-task.html" class="btn btn-primary">
                    + Add Task
                </a>
            </div>
        `;
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-card ${task.status === "completed" ? "completed" : ""}">

            <div class="task-main">

                <div class="task-title-row">
                    <h3>${escapeHTML(task.title)}</h3>

                    <span class="priority ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>
                </div>

                <p class="task-description">
                    ${escapeHTML(task.description || "No description")}
                </p>

                <div class="task-info">
                    <span>📁 ${escapeHTML(task.project)}</span>
                    <span>📅 ${task.deadline}</span>
                    <span>
                        ${task.status === "completed"
                            ? "✅ Completed"
                            : "⏳ Pending"}
                    </span>
                </div>

            </div>

            <div class="task-actions">

                ${
                    task.status !== "completed"
                    ? `
                        <button
                            class="btn btn-success"
                            onclick="completeTask('${task.id}')">
                            ✓ Complete
                        </button>
                    `
                    : `
                        <button
                            class="btn btn-warning"
                            onclick="markPending('${task.id}')">
                            ↩ Pending
                        </button>
                    `
                }

                <button
                    class="btn btn-danger"
                    onclick="deleteTask('${task.id}')">
                    🗑 Delete
                </button>

            </div>

        </div>
    `).join("");
}


/* ==========================================
   COMPLETE TASK
   ========================================== */

function completeTask(taskId) {

    let tasks = getTasks();

    tasks = tasks.map(task => {

        if (task.id === taskId) {
            return {
                ...task,
                status: "completed"
            };
        }

        return task;
    });

    saveTasks(tasks);

    alert("Task marked as completed!");

    loadUserDashboard();
}


/* ==========================================
   MARK TASK AS PENDING
   ========================================== */

function markPending(taskId) {

    let tasks = getTasks();

    tasks = tasks.map(task => {

        if (task.id === taskId) {
            return {
                ...task,
                status: "pending"
            };
        }

        return task;
    });

    saveTasks(tasks);

    loadUserDashboard();
}


/* ==========================================
   DELETE TASK
   ========================================== */

function deleteTask(taskId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    let tasks = getTasks();

    tasks = tasks.filter(
        task => task.id !== taskId
    );

    saveTasks(tasks);

    alert("Task deleted successfully!");

    loadUserDashboard();
}


/* ==========================================
   FILTER TASKS
   ========================================== */

function filterTasks(type) {

    const user = getLoggedInUser();

    if (!user) return;

    const allTasks = getTasks().filter(
        task => task.userId === user.id
    );

    let filteredTasks = allTasks;

    if (type === "completed") {
        filteredTasks = allTasks.filter(
            task => task.status === "completed"
        );
    }

    if (type === "pending") {
        filteredTasks = allTasks.filter(
            task => task.status !== "completed"
        );
    }

    displayTasks(filteredTasks);
}


/* ==========================================
   NOTIFICATION
   ========================================== */

function updateNotification(pendingTasks) {

    const notification = document.getElementById("notification");

    if (!notification) return;

    if (pendingTasks.length === 0) {

        notification.innerHTML = `
            <div class="notification success">
                🎉 Great job! You have no pending tasks.
            </div>
        `;

        return;
    }

    notification.innerHTML = `
        <div class="notification">
            🔔 You have ${pendingTasks.length}
            pending task(s).
        </div>
    `;
}


/* ==========================================
   HELPER FUNCTIONS
   ========================================== */

function updateElement(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* ==========================================
   AUTO LOAD DASHBOARD
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("taskList")) {
        loadUserDashboard();
    }

});
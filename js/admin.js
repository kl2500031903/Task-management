/* ==========================================
   TASKFLOW - ADMIN MODULE
   ========================================== */


/* ==========================================
   GET DATA FROM LOCAL STORAGE
   ========================================== */

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}


/* ==========================================
   CHECK ADMIN LOGIN
   ========================================== */

function checkAdmin() {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {

        alert("Access denied. Admin login required.");

        window.location.href = "../login.html";

        return false;
    }

    return true;
}


/* ==========================================
   LOAD ADMIN DASHBOARD
   ========================================== */

function loadAdminDashboard() {

    if (!checkAdmin()) {
        return;
    }

    const users = getUsers();
    const tasks = getTasks();

    const normalUsers = users.filter(
        user => user.role === "user"
    );

    const completedTasks = tasks.filter(
        task => task.status === "completed"
    );

    const pendingTasks = tasks.filter(
        task => task.status !== "completed"
    );


    /* ---------- Statistics ---------- */

    updateElement(
        "totalUsers",
        normalUsers.length
    );

    updateElement(
        "totalTasks",
        tasks.length
    );

    updateElement(
        "completedTasks",
        completedTasks.length
    );

    updateElement(
        "pendingTasks",
        pendingTasks.length
    );


    /* ---------- Tables ---------- */

    displayUsers(users);

    displayTasks(tasks);
}


/* ==========================================
   DISPLAY USERS
   ========================================== */

function displayUsers(users) {

    const usersTable =
        document.getElementById("usersTable");

    if (!usersTable) {
        return;
    }


    if (users.length === 0) {

        usersTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }


    usersTable.innerHTML = users.map(user => `

        <tr>

            <td>
                ${escapeHTML(user.id)}
            </td>

            <td>
                ${escapeHTML(user.name)}
            </td>

            <td>
                ${escapeHTML(user.email)}
            </td>

            <td>

                <span class="badge ${
                    user.role === "admin"
                    ? "badge-admin"
                    : "badge-user"
                }">

                    ${user.role}

                </span>

            </td>

            <td>

                ${
                    user.role === "admin"

                    ? `<span>Protected</span>`

                    : `
                        <button
                            class="delete-btn"
                            onclick="deleteUser('${user.id}')">

                            🗑 Delete

                        </button>
                    `
                }

            </td>

        </tr>

    `).join("");
}


/* ==========================================
   DISPLAY TASKS
   ========================================== */

function displayTasks(tasks) {

    const tasksTable =
        document.getElementById("tasksTable");

    if (!tasksTable) {
        return;
    }


    if (tasks.length === 0) {

        tasksTable.innerHTML = `
            <tr>
                <td colspan="7">
                    No tasks found.
                </td>
            </tr>
        `;

        return;
    }


    tasksTable.innerHTML = tasks.map(task => `

        <tr>

            <td>
                <strong>
                    ${escapeHTML(task.title)}
                </strong>
            </td>

            <td>
                ${escapeHTML(task.userName || "Unknown")}
            </td>

            <td>
                ${escapeHTML(task.project || "-")}
            </td>

            <td>

                <span class="badge">

                    ${escapeHTML(task.priority || "-")}

                </span>

            </td>

            <td>

                <span class="badge ${
                    task.status === "completed"
                    ? "badge-completed"
                    : "badge-pending"
                }">

                    ${
                        task.status === "completed"
                        ? "Completed"
                        : "Pending"
                    }

                </span>

            </td>

            <td>
                ${escapeHTML(task.deadline || "-")}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteAdminTask('${task.id}')">

                    🗑 Delete

                </button>

            </td>

        </tr>

    `).join("");
}


/* ==========================================
   DELETE USER
   ========================================== */

function deleteUser(userId) {

    const users = getUsers();

    const user = users.find(
        user => user.id === userId
    );

    if (!user) {
        alert("User not found.");
        return;
    }


    if (user.role === "admin") {

        alert("Admin account cannot be deleted.");

        return;
    }


    const confirmDelete = confirm(
        `Delete user "${user.name}" and all their tasks?`
    );

    if (!confirmDelete) {
        return;
    }


    /* Remove user */

    const updatedUsers = users.filter(
        user => user.id !== userId
    );

    localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
    );


    /* Remove user's tasks */

    const tasks = getTasks();

    const updatedTasks = tasks.filter(
        task => task.userId !== userId
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(updatedTasks)
    );


    alert("User deleted successfully.");

    loadAdminDashboard();
}


/* ==========================================
   DELETE TASK
   ========================================== */

function deleteAdminTask(taskId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }


    const tasks = getTasks();

    const updatedTasks = tasks.filter(
        task => task.id !== taskId
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(updatedTasks)
    );


    alert("Task deleted successfully.");

    loadAdminDashboard();
}


/* ==========================================
   HELPER FUNCTION
   ========================================== */

function updateElement(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


/* ==========================================
   SECURITY HELPER
   ========================================== */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


/* ==========================================
   LOAD WHEN PAGE OPENS
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdminDashboard();

    }
);
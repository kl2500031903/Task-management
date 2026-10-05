/* ==========================================
   TASKFLOW - AUTHENTICATION
   ========================================== */


/* ==========================================
   CREATE DEFAULT ADMIN
   ========================================== */

function createDefaultAdmin() {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.some(
        user => user.email === "admin@task.com"
    );

    if (!adminExists) {

        users.push({

            id: "admin",
            name: "Administrator",
            email: "admin@task.com",
            password: "admin123",
            role: "admin"

        });

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );
    }
}


/* ==========================================
   SIGNUP
   ========================================== */

function signup(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    if (!name || !email || !password) {

        alert("Please fill in all fields.");

        return;
    }


    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;
    }


    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    const existingUser = users.find(
        user =>
        user.email.toLowerCase() ===
        email.toLowerCase()
    );


    if (existingUser) {

        alert("An account with this email already exists.");

        return;
    }


    const newUser = {

        id: Date.now().toString(),

        name: name,

        email: email,

        password: password,

        role: "user"

    };


    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert("Account created successfully!");


    window.location.href = "login.html";
}


/* ==========================================
   LOGIN
   ========================================== */

function login(event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    const user = users.find(

        user =>

        user.email.toLowerCase() ===
        email.toLowerCase()

        &&

        user.password === password

    );


    if (!user) {

        alert("Invalid email or password.");

        return;
    }


    /* Save logged-in user */

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    /* ==========================================
       REDIRECT AFTER LOGIN
       ========================================== */

    if (user.role === "admin") {

        // Admin → Admin Dashboard

        window.location.href =
            "admin/admin-dashboard.html";

    } else {

        // Normal User → User Dashboard

        window.location.href =
            "user/user-dashboard.html";
    }
}


/* ==========================================
   LOGOUT
   ========================================== */

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href =
        "../login.html";
}


/* ==========================================
   GET CURRENT USER
   ========================================== */

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );
}


/* ==========================================
   CREATE ADMIN WHEN PAGE LOADS
   ========================================== */

createDefaultAdmin();
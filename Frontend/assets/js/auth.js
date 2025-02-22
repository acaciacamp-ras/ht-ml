document.addEventListener("DOMContentLoaded", () => {
    // Switch between registration and login forms
    document.getElementById("auth-goToLogin").addEventListener("click", () => switchForms(false));
    document.getElementById("auth-goToRegister").addEventListener("click", () => switchForms(true));

    // Handle registration
    document.getElementById("auth-registerButton").addEventListener("click", registerUser);

    // Handle login
    document.getElementById("auth-loginButton").addEventListener("click", loginUser);

    // Handle protected route
    document.getElementById("auth-protectedButton").addEventListener("click", accessProtected);
});

function switchForms(showRegister) {
    document.querySelector(".auth-container").style.display = showRegister ? "block" : "none";
    document.getElementById("auth-loginContainer").style.display = showRegister ? "none" : "block";
}

async function registerUser() {
    const username = document.getElementById("auth-username").value.trim();
    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value.trim();

    if (!username || !email || !password) {
        showMessage(document.getElementById("auth-registerMessage"), "All fields are required", "error");
        return;
    }

    if (!validateEmail(email)) {
        showMessage(document.getElementById("auth-registerMessage"), "Invalid email format", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            showMessage(document.getElementById("auth-registerMessage"), "Registration successful!", "success");
            setTimeout(() => switchForms(false), 1500);
        } else {
            showMessage(document.getElementById("auth-registerMessage"), data.message || "Registration failed", "error");
        }
    } catch (err) {
        showMessage(document.getElementById("auth-registerMessage"), "An error occurred", "error");
    }
}

async function loginUser() {
    const email = document.getElementById("auth-loginEmail").value.trim();
    const password = document.getElementById("auth-loginPassword").value.trim();

    if (!email || !password) {
        showMessage(document.getElementById("auth-loginMessage"), "Email and password are required", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            showMessage(document.getElementById("auth-loginMessage"), "Login successful!", "success");
            setTimeout(() => {
                document.getElementById("auth-loginContainer").style.display = "none";
                document.getElementById("auth-protectedContainer").style.display = "block";
            }, 1500);
        } else {
            showMessage(document.getElementById("auth-loginMessage"), data.message || "Invalid credentials", "error");
        }
    } catch (err) {
        showMessage(document.getElementById("auth-loginMessage"), "An error occurred", "error");
    }
}

async function accessProtected() {
    const token = localStorage.getItem("token");
    if (!token) {
        showMessage(document.getElementById("auth-protectedMessage"), "Please login first", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/protected", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.text();
        if (response.ok) {
            showMessage(document.getElementById("auth-protectedMessage"), data, "success");
        } else {
            showMessage(document.getElementById("auth-protectedMessage"), "Access denied", "error");
        }
    } catch (err) {
        showMessage(document.getElementById("auth-protectedMessage"), "An error occurred", "error");
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = type;
    setTimeout(() => {
        element.textContent = "";
    }, 3000);
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
}
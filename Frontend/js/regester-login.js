document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const authRegisterContainer = document.querySelector(".auth-container");
    const authLoginContainer = document.getElementById("auth-loginContainer");
    const authProtectedContainer = document.getElementById("auth-protectedContainer");

    // Messages
    const authRegisterMessage = document.getElementById("auth-registerMessage");
    const authLoginMessage = document.getElementById("auth-loginMessage");
    const authProtectedMessage = document.getElementById("auth-protectedMessage");

    // Buttons
    document.getElementById("auth-goToLogin").addEventListener("click", () => switchForms(false));
    document.getElementById("auth-goToRegister").addEventListener("click", () => switchForms(true));
    document.getElementById("auth-registerButton").addEventListener("click", registerUser);
    document.getElementById("auth-loginButton").addEventListener("click", loginUser);
    document.getElementById("auth-protectedButton").addEventListener("click", accessProtected);

    function switchForms(showRegister) {
      authRegisterContainer.style.display = showRegister ? "block" : "none";
      authLoginContainer.style.display = showRegister ? "none" : "block";
    }

    async function registerUser() {
      const username = document.getElementById("auth-username").value.trim();
      const email = document.getElementById("auth-email").value.trim();
      const password = document.getElementById("auth-password").value.trim();

      if (!username || !email || !password) {
        showMessage(authRegisterMessage, "All fields are required", "error");
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
          showMessage(authRegisterMessage, "Registration successful!", "success");
          setTimeout(() => switchForms(false), 1500);
        } else {
          showMessage(authRegisterMessage, data.message || "Registration failed", "error");
        }
      } catch (err) {
        showMessage(authRegisterMessage, "An error occurred", "error");
      }
    }

    async function loginUser() {
      const email = document.getElementById("auth-loginEmail").value.trim();
      const password = document.getElementById("auth-loginPassword").value.trim();

      if (!email || !password) {
        showMessage(authLoginMessage, "Email and password are required", "error");
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
          showMessage(authLoginMessage, "Login successful!", "success");

          setTimeout(() => {
            authLoginContainer.style.display = "none";
            authProtectedContainer.style.display = "block";
          }, 1500);
        } else {
          showMessage(authLoginMessage, data.message || "Invalid credentials", "error");
        }
      } catch (err) {
        showMessage(authLoginMessage, "An error occurred", "error");
      }
    }

    async function accessProtected() {
      const token = localStorage.getItem("token");
      if (!token) {
        showMessage(authProtectedMessage, "Please login first", "error");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/protected", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.text();
        if (response.ok) {
          showMessage(authProtectedMessage, data, "success");
        } else {
          showMessage(authProtectedMessage, "Access denied", "error");
        }
      } catch (err) {
        showMessage(authProtectedMessage, "An error occurred", "error");
      }
    }

    function showMessage(element, message, type) {
      element.textContent = message;
      element.className = type;
      setTimeout(() => {
        element.textContent = "";
      }, 3000);
    }
  });

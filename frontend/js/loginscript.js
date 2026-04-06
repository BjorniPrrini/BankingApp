
function showAlert(message, type) {
    const box = document.getElementById("alert-box");
    box.textContent = message;
    box.className = "alert " + type + " show";

    setTimeout(() => {
        box.className = "alert";
    }, 5000);
}


function openModal(id) {
    document.getElementById(id).classList.add("open");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("open");
}


function showForgotPassword(e) {
    e.preventDefault();
    openModal("forgot-modal");
}


let selectedRole = "client";
function selectRole(role, btn) {
    selectedRole = role;

    document.querySelectorAll(".role-btn").forEach(function(b) {
        b.classList.remove("active");
    });
    btn.classList.add("active");

    const empGroup = document.getElementById("empid-group");
    if (role === "banker" || role === "admin") {
        empGroup.style.display = "flex";
    } else {
        empGroup.style.display = "none";
    }
}


function handleLogin(e) {
    e.preventDefault();

    const email= document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const empid= document.getElementById("empid").value.trim().toUpperCase();

    if (!email || !password) {
        showAlert("Please fill in all required fields.", "danger");
        return;
    }

    const users = getUsers();

    const user = users.find(function(u) {
        return u.email === email
            && u.password === password
            && u.role === selectedRole;
    });

    if (!user) {
        showAlert("❌ Invalid email, password, or role. Please try again.", "danger");
        return;
    }

    if (selectedRole === "banker" || selectedRole === "admin") {
        if (!empid) {
            showAlert("❌ Employee ID is required for this role.", "danger");
            return;
        }
        if (selectedRole !== "client" && user.empid !== empid) {
            showAlert("❌ Employee ID does not match our records.", "danger");
            return;
        }
    }

    showAlert("✅ Login successful! Opening your dashboard...", "success");

    setTimeout(function() {
    }, 1000);
}


function handleForgot(e) {
    e.preventDefault();

    const email = document.getElementById("forgot-email").value.trim().toLowerCase();
    const users = getUsers();
    const user  = users.find(function(u){
        return u.email === email;
    });

    if (!user) {
        showAlert("No account found with that email address.","danger");
        return;
    }

    closeModal("forgot-modal");
    showAlert(
        "📧 Password reset link sent to " + email + ". Check your inbox!",
        "info"
    );
}


function togglePassword() {
    const input  = document.getElementById("password");
    const button = document.querySelector(".eye-btn");

    if (input.type === "password") {
        input.type   = "text";
        button.textContent = "🙈";
    } else {
        input.type   = "password";
        button.textContent = "👁";
    }
}

function getUsers() {
    const data = localStorage.getItem("bank_users");
    return data ? JSON.parse(data) : [];
}

$(document).ready(() => {
    $(".role-btn").click(function (){
        $(".role-btn").removeClass("active");
        $(this).addClass("active");

        const role = $(this).data("role");
        if(role === "banker" || role === "admin"){
            $("#empid-group").show();
        }else{
            $("#empid-group").hide();
        }

        hideAlert();
    });

    $(".eye-btn").click(function (){
        const pwdInput = $("#password");

        if(pwdInput.attr("type") === "password"){
            pwdInput.attr("type", "text");

            $(this).text("🙈");
        }else{
            pwdInput.attr("type", "password");

            $(this).text("👁");
        }
    });

    $(".forgot-link").click(function (e){
        e.preventDefault();

        $("#forgot-modal").addClass("open");
    });

    $(".modal-overlay").click(function (e){
        if(e.target === this){
            $("#forgot-modal").removeClass("open");
            $("#forgot-email").val("");
        }
    });

    $(".modal-close").click(function (){
        $("#forgot-modal").removeClass("open");
        $("#forgot-email").val("");
    });

    $(".modal").click(function (e){
        e.stopPropagation();
    });

    $("#forgot-modal form").on("submit", function (e){
        e.preventDefault();

        const email = $("#forgot-email").val().trim();

        if(!email){
            showAlert("Please enter your registered email.", "danger");

            return;
        }

        showAlert("Reset link sent! Check your inbox.", "success");

        setTimeout(() => {
            $("#forgot-modal").removeClass("open");
            $("#forgot-email").val("");
        }, 2000);
    });

    $("#login-form").on("submit", function (e){
        e.preventDefault();

        handleLogin();
    });

    $("#login-btn").on("click", function (e){
        e.preventDefault();

        handleLogin();
    });

    function handleLogin(){
        const role = $(".role-btn.active").data("role");
        const email = $("#email").val().trim();
        const password = $("#password").val();
        const empid = $("#empid").val().trim();

        if(!email || !password){
            showAlert("Please fill in all required fields.", "danger");

            return;
        }

        if((role === "banker" || role === "admin") && !empid){
            showAlert("Employee ID is required for Banker and Admin roles.", "danger");

            return;
        }

        if(role === "client"){
            const clientList = JSON.parse(localStorage.getItem("clientList") || "[]");

            const client = clientList.find(c => c.email === email && c.password === password);

            if(!client){
                showAlert("Invalid email or password.", "danger");

                return;
            }

            localStorage.setItem("loggedInClient", JSON.stringify(client));
            showAlert("Login successful! Redirecting…", "success");

            setTimeout(() => {
                window.location.href = "pages/client/clientHome.html";
            }, 800);

            return;
        }

        if(role === "banker"){
            const employeeList = JSON.parse(localStorage.getItem("employeeList") || "[]");

            const banker = employeeList.find(emp => emp.email === email && emp.password === password && String(emp.ID) === empid);

            if(!banker){
                showAlert("Invalid email, password, or Employee ID.", "danger");

                return;
            }

            localStorage.setItem("loggedInBanker", JSON.stringify(banker));
            showAlert("Login successful! Redirecting…", "success");

            setTimeout(() => {
                window.location.href = "pages/banker/bankerHome.html";
            }, 800);

            return;
        }

        if(role === "admin"){
            const ADMIN_EMAIL = "admin@goldstonebank.com";
            const ADMIN_PASSWORD = "admin123";
            const ADMIN_EMPID = "000000";

            const employeeList = JSON.parse(localStorage.getItem("employeeList") || "[]");

            const adminEmployee = employeeList.find(emp => emp.email === email && emp.password === password && String(emp.ID) === empid);

            const isSuperAdmin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD && empid === ADMIN_EMPID;

            if(!isSuperAdmin && !adminEmployee){
                showAlert("Invalid credentials for Admin role.", "danger");

                return;
            }

            const adminData = isSuperAdmin ? { name: "Super", surname: "Admin", ID: 0, email: ADMIN_EMAIL } : adminEmployee;

            localStorage.setItem("loggedInAdmin", JSON.stringify(adminData));

            showAlert("Login successful! Redirecting…", "success");

            setTimeout(() => {
                window.location.href = "pages/admin/adminHome.html";
            }, 800);

            return;
        }
    }

    function showAlert(message, type){
        $("#alert-box").removeClass("danger success info").addClass("show " + type).text(message);

        if(type !== "success"){
            setTimeout(hideAlert, 3500);
        }
    }

    function hideAlert(){
        $("#alert-box").removeClass("show danger success info");
    }
});
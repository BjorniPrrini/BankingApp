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

        const selectedRole =
            $(".role-btn.active").data("role");

        const email =
            $("#email").val().trim();

        const password =
            $("#password").val();

        const empid =
            $("#empid").val().trim();

        if(!email || !password){

            showAlert(
                "Please fill in all required fields.",
                "danger"
            );
            return;
        }

        if(
            (selectedRole === "banker" ||
                selectedRole === "admin") &&
            !empid
        ){
            showAlert(
                "Employee ID is required.",
                "danger"
            );
            return;
        }

        $.ajax({
            url: "http://localhost:5104/api/auth/login",

            type: "POST",

            contentType: "application/json",

            data: JSON.stringify({
                email: email,
                password: password
            }),

            success: function(data){

                console.log(data);

                const backendRole =
                    data.role.toLowerCase();

                if(backendRole !== selectedRole){

                    showAlert(
                        "Incorrect role selected.",
                        "danger"
                    );
                    return;
                }

                localStorage.removeItem(
                    "loggedInAdmin"
                );

                localStorage.removeItem(
                    "loggedInBanker"
                );

                localStorage.removeItem(
                    "loggedInClient"
                );

                if(backendRole === "admin"){

                    localStorage.setItem(
                        "loggedInAdmin",
                        JSON.stringify(data)
                    );

                    showAlert(
                        "Login successful!",
                        "success"
                    );

                    setTimeout(() => {

                        window.location.href =
                            "pages/admin/adminHome.html";

                    }, 800);

                    return;
                }

                if(backendRole === "banker"){

                    localStorage.setItem(
                        "loggedInBanker",
                        JSON.stringify(data)
                    );

                    showAlert(
                        "Login successful!",
                        "success"
                    );

                    setTimeout(() => {

                        window.location.href =
                            "pages/banker/bankerHome.html";

                    }, 800);

                    return;
                }

                if(backendRole === "client"){

                    localStorage.setItem(
                        "loggedInClient",
                        JSON.stringify(data)
                    );

                    showAlert(
                        "Login successful!",
                        "success"
                    );

                    setTimeout(() => {

                        window.location.href =
                            "pages/client/clientHome.html";

                    }, 800);

                    return;
                }
            },

            error: function(xhr){

                let message =
                    "Invalid email or password.";

                if(
                    xhr.responseJSON &&
                    xhr.responseJSON.message
                ){
                    message =
                        xhr.responseJSON.message;
                }

                showAlert(
                    message,
                    "danger"
                );
            }
        });
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
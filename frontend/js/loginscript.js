$(document).ready(() => {
    $(".role-btn").click(function(){
        $(".role-btn").removeClass("active");
        $(this).addClass("active");

        const role = $(this).data("role");

        if(role === "banker" || role === "admin"){
            $("#empid-group").show();
        }else{
            $("#empid-group").hide();
        }
    });

    $("#login-btn").click(function(event){
        event.preventDefault();

        const activeRole = $(".role-btn.active").data("role");

        window.location.href = "pages/" + activeRole + "Home.html";
    });
});
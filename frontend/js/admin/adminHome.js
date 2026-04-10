$(document).ready(() => {
    $('.logout-btn').on('click', function(){
        window.location.href = '/frontend/login.html';
    });

    $('.add-btn').on('click', function(){
        window.location.href = '/frontend/pages/admin/adminAdd.html';
    });
});
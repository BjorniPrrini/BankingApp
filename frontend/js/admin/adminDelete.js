$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    $.ajax({
        url: `http://localhost:5104/api/admin/home/employee/${id}`,
        type: "GET",
        success: function (emp) {

            if (!emp) {
                window.location.href = '/frontend/pages/admin/adminHome.html';
                return;
            }

            $('#empID').val(emp.employeeID);
            $('#empName').val(emp.name + ' ' + emp.surname);
            $('#empPaycheck').val(emp.payCheck);
            $('#empEmail').val(emp.email);
        },
        error: function () {
            window.location.href = '/frontend/pages/admin/adminHome.html';
        }
    });

    $('#confirmDelete').on('click', function () {

        $.ajax({
            url: `http://localhost:5104/api/admin/home/employee/${id}`,
            type: "DELETE",
            success: function () {
                window.location.href = '/frontend/pages/admin/adminHome.html';
            }
        });

    });

    $('#cancelDelete').on('click', function () {
        window.location.href = '/frontend/pages/admin/adminHome.html';
    });

});
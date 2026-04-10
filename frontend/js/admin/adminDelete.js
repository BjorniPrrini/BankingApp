$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    const employees = JSON.parse(localStorage.getItem('employeeList') || '[]');
    const emp = employees.find(e => e.ID === id);

    if (!emp) {
        window.location.href = '/frontend/pages/admin/adminHome.html';
        return;
    }

    $('#empID').val('#' + emp.ID);
    $('#empName').val(emp.name + ' ' + emp.surname);
    $('#empPaycheck').val('$' + emp.payCheck);
    $('#empEmail').val(emp.email);

    $('#confirmDelete').on('click', function () {
        let updated = employees.filter(e => e.ID !== id);
        localStorage.setItem('employeeList', JSON.stringify(updated));
        window.location.href = '/frontend/pages/admin/adminHome.html';
    });

    $('#cancelDelete').on('click', function () {
        window.location.href = '/frontend/pages/admin/adminHome.html';
    });

});
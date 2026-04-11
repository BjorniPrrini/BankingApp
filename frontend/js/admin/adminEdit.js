$(document).ready(() => {
    const urlID = new URLSearchParams(window.location.search);
    const id = parseInt(urlID.get('id'));
    const employees = JSON.parse(localStorage.getItem('employeeList') || '[]');
    const employee = employees.find(e => e.ID === id);

    $('#name').val(employee.name);
    $('#surname').val(employee.surname);
    $('#paycheck').val(employee.payCheck);
    $('#ID').val(employee.ID);
    $('#generatedEmail').val(employee.email);
    $('#generatedPassword').val(employee.password);

    $('#editButton').on('click', function (e) {
        e.preventDefault();

        let name = $('#name').val().trim();
        let surname = $('#surname').val().trim();
        let payCheck = $('#paycheck').val().trim();

        if(!name || !surname || !payCheck){
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);

            return;
        }

        if(name === employee.name && surname === employee.surname && payCheck === employee.payCheck){
            $('#alert-box').removeClass('success info').addClass('show info').text('Nothing changed');

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            return;
        }

        const existsName = name.toLowerCase();
        const existsSurname = surname.toLowerCase();

        const alreadyExists = employees.some(emp => emp.ID !== id && emp.name.trim().toLowerCase() === existsName && emp.surname.trim().toLowerCase() === existsSurname);

        if(alreadyExists){
            $('#alert-box').removeClass('success info').addClass('show danger').text('This employee is already registered');
            
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            
            return;
        }

        let generatedEmail = name.toLowerCase() + surname.toLowerCase() + id + '@gmail.com';
        let generatedPassword = name.toLowerCase() + surname.toLowerCase() + id;

        $('#generatedEmail').val(generatedEmail);
        $('#generatedPassword').val(generatedPassword);

        const index = employees.findIndex(emp => emp.ID === id);

        employees[index] = {
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            surname: surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase(),
            payCheck: payCheck,
            ID: id,
            email: generatedEmail,
            password: generatedPassword
        };

        localStorage.setItem('employeeList', JSON.stringify(employees));

        $('#alert-box').removeClass('danger info').addClass('show success').text('Employee edited successfully');

        setTimeout(() => $('#alert-box').removeClass('show'), 5000);
    });

    $('#goBack').on('click', function (){
        window.location.href = '/frontend/pages/admin/adminHome.html';
    });
});
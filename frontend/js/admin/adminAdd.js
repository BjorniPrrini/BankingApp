$(document).ready(() => {
    $('#addButton').on('click', function (e){
        e.preventDefault();

        let name = $('#name').val();
        let surname = $('#surname').val();
        let payCheck = $('#paycheck').val();

        if(!name || !surname || !payCheck){
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');

            setTimeout(() => {
                $('#alert-box').removeClass('show');
            }, 3000);

            return;
        }

        let employeeList = JSON.parse(localStorage.getItem('employeeList') || '[]');

        let generatedID;

        do{
            generatedID = Math.floor(100000 + Math.random() * 900000);
        }while(employeeList.some(emp => emp.ID === generatedID));

        let generatedEmail = name.toLowerCase() + surname.toLowerCase() + generatedID + '@gmail.com';

        let generatedPassword = name.toLowerCase() + surname.toLowerCase() + generatedID;

        let employee = {
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            surname: surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase(),
            payCheck: payCheck,
            ID: generatedID,
            email: generatedEmail,
            password: generatedPassword
        }

        employeeList.push(employee);
        localStorage.setItem('employeeList', JSON.stringify(employeeList));

        $('#generatedID').val(generatedID);
        $('#generatedEmail').val(generatedEmail);
        $('#generatedPassword').val(generatedPassword);

        $('#alert-box').removeClass('danger info').addClass('show success').text('Employee added successfully');

        setTimeout(() => {
            $('#alert-box').removeClass('show');
        }, 5000);
    });

    $('#goBack').on('click', function(){
        window.location.href = '/frontend/pages/admin/adminHome.html';
    })
});
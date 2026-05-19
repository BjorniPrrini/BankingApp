$(document).ready(() => {
    $('#addButton').on('click', function(e){
        e.preventDefault();

        let name = $('#name').val().trim();
        let surname = $('#surname').val().trim();
        let payCheck = $('#paycheck').val().trim();

        if(!name || !surname || !payCheck){
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');

            setTimeout(() => {
                $('#alert-box').removeClass('show');
            }, 3000);

            return;
        }


        $.ajax({
           url: 'http://localhost:5104/api/admin/addEmployee/add',
            method : 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                surname: surname,
                salary: payCheck
            }),
            success: function(response){
                $('#generatedID').val(response.employeeID);
                $('#generatedEmail').val(response.email);
                $('#generatedPassword').val(response.password);
                $('#alert-box').removeClass('danger info').addClass('show success').text('Employee added successfully');

                setTimeout(() => $('#alert-box').removeClass('show'), 5000);
            },
            error: function(error){
                let message = error.responseJSON?.message || 'Something went wrong';

                $('#alert-box').removeClass('success info').addClass('show danger').text(message);

                setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            }
        });
    });

    $('#goBack').on('click', function(){
        window.location.href = '/frontend/pages/admin/adminHome.html';
    })
});
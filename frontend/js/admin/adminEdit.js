$(document).ready(() => {
    const urlID = new URLSearchParams(window.location.search);
    const id = parseInt(urlID.get('id'));

    $.ajax({
        url: `http://localhost:5104/api/admin/editEmployee/get/${id}`,
        type: "GET",
        dataType: "json",
        success: function(response){
            $('#name').val(response.name);
            $('#surname').val(response.surname);
            $('#paycheck').val(response.salary);
            $('#ID').val(response.employeeID);
            $('#generatedEmail').val(response.email);
            $('#generatedPassword').val(response.password);
        },
        error: function(error){
            let message = error.responseJSON?.message || 'An error occurred';

            $('#alert-box').removeClass('success info').addClass('show danger').text(message);

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
        }
    });

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

        $.ajax({
            url: "http://localhost:5104/api/admin/editEmployee/edit",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                id: id,
                name: name,
                surname: surname,
                salary: payCheck
            }),
            success: function(response){
                $('#name').val(response.name);
                $('#surname').val(response.surname);
                $('#paycheck').val(response.salary);
                $('#ID').val(response.employeeID);
                $('#generatedEmail').val(response.email);
                $('#generatedPassword').val(response.password);

                $('#alert-box').removeClass('danger info').addClass('show success').text('Employee edited successfully');

                setTimeout(() => $('#alert-box').removeClass('show'), 5000);
            },
            error: function(error){
                let message = error.responseJSON?.message || 'User could not be added';

                $('#alert-box').removeClass('success info').addClass('show danger').text(message);

                setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            }
        });
    });

    $('#goBack').on('click', function (){
        window.location.href = '/frontend/pages/admin/adminHome.html';
    });
});
$(document).ready(() => {
    $('#addButton').on('click', function(e){
        e.preventDefault();

        let name = $('#name').val().trim();
        let surname = $('#surname').val().trim();
        let balance = $('#balance').val().trim();
        let email = $('#email').val().trim();


        if(!name || !surname || !balance || !email){
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');

            setTimeout(() => {
                $('#alert-box').removeClass('show');
            }, 3000);

            return;
        }

        let clientList = JSON.parse(localStorage.getItem('clientList') || '[]');

        const existsName = name.trim().toLowerCase();
        const existsSurname = surname.trim().toLowerCase();

        const alreadyExists = clientList.some(emp => emp.name.trim().toLowerCase() === existsName && emp.surname.trim().toLowerCase() === existsSurname);

        if(alreadyExists){
            $('#alert-box').removeClass('success info').addClass('show danger').text('This client is already registered');

            setTimeout(() => {
                $('#alert-box').removeClass('show');
            }, 3000);

            return;
        }

        let generatedID;

        do{
            generatedID = Math.floor(10000 + Math.random() * 900000);
        }while(clientList.some(cli => cli.ID === generatedID));

        let generatedPassword = name.toLowerCase() + surname.toLowerCase() + generatedID;

        let client = {
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            surname: surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase(),
            balance: balance,
            ID: generatedID,
            email: email,
            password: generatedPassword
        }

        clientList.push(client);
        localStorage.setItem('clientList', JSON.stringify(clientList));

        $('#generatedID').val(generatedID);
        $('#email').val(email);
        $('#generatedPassword').val(generatedPassword);

        $('#alert-box').removeClass('danger info').addClass('show success').text('Client added successfully');

        setTimeout(() => {
            $('#alert-box').removeClass('show');
        }, 5000);
    });

    $('#goBack').on('click', function(){
        window.location.href = '/frontend/pages/banker/bankerHome.html';
    })
});
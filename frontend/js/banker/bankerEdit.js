$(document).ready(() => {
    const urlID = new URLSearchParams(window.location.search);
    const id = parseInt(urlID.get('id'));
    const clients = JSON.parse(localStorage.getItem('clientList') || '[]');
    const client = clients.find(c => c.ID === id);

    $('#name').val(client.name);
    $('#surname').val(client.surname);
    $('#balance').val(client.balance);
    $('#ID').val(client.ID);
    $('#email').val(client.email);
    $('#generatedPassword').val(client.password);

    $('#editButton').on('click', function (e){
        e.preventDefault();

        let name = $('#name').val().trim();
        let surname = $('#surname').val().trim();
        let balance = $('#balance').val().trim();
        let email = $('#email').val().trim();

        if(!name || !surname || !balance){
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);

            return;
        }

        if(name === client.name && surname === client.surname && balance === client.balance && email === client.email){
            $('#alert-box').removeClass('success info').addClass('show info').text('Nothing changed');

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);

            return;
        }

        const existsName = name.toLowerCase();
        const existsSurname = surname.toLowerCase();

        const alreadyExists = clients.some(cli => cli.ID !== id && cli.name.trim().toLowerCase() === existsName && cli.surname.trim().toLowerCase() === existsSurname);

        if(alreadyExists){
            $('#alert-box').removeClass('success info').addClass('show danger').text('This client is already registered');

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);

            return;
        }

        let generatedPassword = name.toLowerCase() + surname.toLowerCase() + id;

        $('#email').val(email);
        $('#generatedPassword').val(generatedPassword);

        const index = clients.findIndex(cli => cli.ID === id);

        clients[index] = {
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            surname: surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase(),
            balance: balance,
            ID: id,
            email: email,
            password: generatedPassword
        };

        localStorage.setItem('clientList', JSON.stringify(clients));

        $('#alert-box').removeClass('danger info').addClass('show success').text('Client edited successfully');

        setTimeout(() => $('#alert-box').removeClass('show'), 5000);
    });

    $('#goBack').on('click', function (){
        window.location.href = '/frontend/pages/banker/bankerHome.html';
    });
});
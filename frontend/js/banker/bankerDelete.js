$(document).ready(function (){
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const clients = JSON.parse(localStorage.getItem('clientList') || '[]');
    const cli = clients.find(c => c.ID === id);

    if(!cli){
        window.location.href = '/frontend/pages/banker/bankerHome.html';

        return;
    }

    $('#cliID').val('#' + cli.ID);
    $('#cliName').val(cli.name + ' ' + cli.surname);
    $('#cliBalance').val('$' + cli.balance);
    $('#cliEmail').val(cli.email);

    $('#confirmDelete').on('click', function (){
        let updated = clients.filter(c => c.ID !== id);

        localStorage.setItem('clientList', JSON.stringify(updated));

        window.location.href = '/frontend/pages/banker/bankerHome.html';
    });

    $('#cancelDelete').on('click', function (){
        window.location.href = '/frontend/pages/banker/bankerHome.html';
    });
});
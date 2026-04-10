$(document).ready(function () {
    function loadTable() {
        const employees = JSON.parse(localStorage.getItem('employeeList') || '[]');
        const tbody = $('tbody');

        tbody.empty();

        if(employees.length === 0){
            tbody.append('<tr><td colspan="4" style="text-align:center; color: var(--text-dim); padding: 30px;">No employees found.</td></tr>');

            return;
        }

        $.each(employees, function(_, emp){
            const initials = emp.name.charAt(0) + emp.surname.charAt(0);

            const row = `
                <tr data-id="${emp.ID}">
                    <td><span class="id-badge">#${emp.ID}</span></td>
                    <td>
                        <div class="name-cell">
                            <div class="avatar">${initials}</div>
                            ${emp.name} ${emp.surname}
                        </div>
                    </td>
                    <td><span class="paycheck">$${emp.payCheck}</span></td>
                    <td>
                        <button class="action-edit" data-id="${emp.ID}">Edit</button>
                        <button class="action-delete" data-id="${emp.ID}">Delete</button>
                    </td>
                </tr>`;

            tbody.append(row);
        });
    }

    loadTable();

    $(document).on('click', '.action-delete', function (){
        const id = $(this).data('id');

        window.location.href = '/frontend/pages/admin/adminDelete.html?id=' + id;
    });

    $(document).on('click', '.action-edit', function (){
        const id = $(this).data('id');

        window.location.href = '/frontend/pages/admin/adminEdit.html?id=' + id;
    });

    $('.add-btn').on('click', function (){
        window.location.href = '/frontend/pages/admin/adminAdd.html';
    });

    $('.logout-btn').on('click', function (){
        window.location.href = '../../login.html';
    });
});
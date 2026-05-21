$(document).ready(function () {
    function loadEmployees() {
        $.ajax({
            url: "http://localhost:5104/api/admin/home/employee",
            type: "GET",
            dataType: "json",
            success: function(employees){
                const tbody = $("tbody");
                tbody.empty();

                if(!employees || employees.length === 0){
                    tbody.append(`
                        <tr>
                            <td colspan="4" style="text-align:center;">
                                No employees found
                            </td>
                        </tr>
                    `);
                    return;
                }

                employees.forEach(emp => {
                    const row = `
                        <tr data-id="${emp.id}">

                            <td>
                                <span class="id-badge">#${emp.employeeID}</span>
                            </td>

                            <td>${emp.name} ${emp.surname}</td>

                            <td>$${emp.payCheck}</td>

                            <td>
                                <button class="action-edit" data-id="${emp.id}">Edit</button>
                                <button class="action-delete" data-id="${emp.id}">Delete</button>
                            </td>

                        </tr>
                    `;

                    tbody.append(row);
                });
            },

            error: function () {
                $("tbody").html(`
                    <tr>
                        <td colspan="4" style="text-align:center; color:red;">
                            Failed to load employees
                        </td>
                    </tr>
                `);
            }
        });
    }

    loadEmployees();

    $(document).on("click", ".action-edit", function () {
        const id = $(this).data("id");
        window.location.href = `/frontend/pages/admin/adminEdit.html?id=${id}`;
    });

    $(document).on("click", ".action-delete", function () {
        const id = $(this).data("id");
        window.location.href = `/frontend/pages/admin/adminDelete.html?id=${id}`;
    });

    $(document).on("click", ".add-btn", function () {
        window.location.href = "/frontend/pages/admin/adminAdd.html";
    });

    $(document).on("click", ".changePassword-btn", function () {
        window.location.href = "/frontend/components/html/change-password.html";
    });

    $(document).on("click", ".logout-btn", function () {
        window.location.href = "../../login.html";
    });
});
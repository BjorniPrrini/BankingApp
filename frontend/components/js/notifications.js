const API_BASE_URL = "http://localhost:5104";

window.connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/notificationHub`)
    .withAutomaticReconnect()
    .build();

window.activeNotifications = [];

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedInBanker')) || JSON.parse(localStorage.getItem('loggedInClient')) || JSON.parse(localStorage.getItem('loggedInAdmin'));
}

async function refreshNotifications() {
    const user = getCurrentUser();

    if(!user){
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/user/${user.id}`);

        window.activeNotifications = await response.json();

        renderBellUI();

        $(document).trigger('notificationsUpdated');
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function renderBellUI() {
    const unreadCount = window.activeNotifications.filter(n => !n.isRead).length;
    const badge = $('#bellBadge');

    if(unreadCount > 0){
        badge.text(unreadCount > 99 ? '99+' : unreadCount).removeClass('hidden');
    }else{
        badge.addClass('hidden');
    }

    const list = $('#notifList').empty();
    window.activeNotifications.slice(0, 5).forEach(n => {
        list.append(`
            <div class="notif-item ${n.isRead ? '' : 'unread'}">
                <span class="notif-type-badge ${n.type}">${n.type.replace(/_/g, ' ')}</span>
                <span class="notif-message">${n.message}</span>
            </div>
        `);
    });
}

async function startSignalR() {
    try{
        await window.connection.start();

        const user = getCurrentUser();
        if(user){
            await window.connection.invoke("JoinUserGroup", user.id.toString());
        }
    } catch (err) {
        setTimeout(startSignalR, 5000);
    }
}

window.connection.on("ReceiveNotification", () => {
    refreshNotifications();
});

$(document).ready(() => {
    startSignalR();
    refreshNotifications();

    $('#bellBtn').on('click', function (e) {
        e.stopPropagation();

        const dropdown = $('#notifDropdown');

        dropdown.toggleClass('open');

        if(dropdown.hasClass('open')){
            renderBellUI();
        }
    });

    $(document).on('click', function (e) {
        if(!$(e.target).closest('.notif-wrapper').length){
            $('#notifDropdown').removeClass('open');
        }
    });

    $('#showAllBtn').on('click', () => {
        window.location.href = '/frontend/components/html/inbox.html';
    });

    $('#readAllBtn').on('click', async () => {
        const user = getCurrentUser();

        if(!user){
            return;
        }

        await fetch(`${API_BASE_URL}/api/notifications/mark-all-read/${user.id}`, { method: 'POST' });

        refreshNotifications();
    });

    $('#inboxReadAll').on('click', async () => {
        const user = getCurrentUser();

        if(!user){
            return;
        }

        await fetch(`${API_BASE_URL}/api/notifications/mark-all-read/${user.id}`, { method: 'POST' });

        refreshNotifications();
    });
});
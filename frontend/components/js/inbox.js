$(document).ready(function(){
    let currentFilter = 'all';

    function getCurrentUser() {
        const banker = localStorage.getItem('loggedInBanker');
        const client = localStorage.getItem('loggedInClient');

        if(banker){
            return {...JSON.parse(banker), dashboardRole: 'banker'};
        }

        if(client){
            return {...JSON.parse(client), dashboardRole: 'client'};
        }

        return null;
    }

    function renderInbox(){
        const all = (window.activeNotifications || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filtered = currentFilter === 'all' ? all : currentFilter === 'unread' ? all.filter(n => !n.isRead) : all.filter(n => n.isRead);

        const container = $('#inboxList').empty();

        $('#inboxSubtitle').text(`${all.filter(n => !n.isRead).length} unread notifications`);

        if(filtered.length === 0) {
            container.append('<div class="inbox-empty">No notifications found.</div>');

            return;
        }

        filtered.forEach(n => {
            const actionBtn = n.isRead ? '<span class="read-label">Read</span>' : `<button class="inbox-single-read" data-id="${n.id}">Mark as read</button>`;

            container.append(`
                <div class="inbox-item ${n.isRead ? '' : 'unread'}">
                    <div class="inbox-item-body">
                        <span class="notif-type-badge ${n.type}">${n.type.replace(/_/g, ' ')}</span>
                        <p>${n.message}</p>
                    </div>
                    <div class="inbox-item-action">${actionBtn}</div>
                </div>
            `);
        });
    }

    $(document).on('notificationsUpdated', renderInbox);

    $(document).on('click', '.filter-btn', function(){
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        currentFilter = $(this).data('filter');

        renderInbox();
    });

    $(document).on('click', '#goBack', function(){
        const user = getCurrentUser();

        if(user && user.dashboardRole){
            window.location.href = `/frontend/pages/${user.dashboardRole}/${user.dashboardRole}Home.html`;
        }else{
            window.location.href = '/frontend/login.html';
        }
    });

    $(document).on('click', '.inbox-single-read', async function(){
        const id = $(this).data('id');

        if(!id){
            return;
        }

        try {
            await fetch(`http://localhost:5104/api/notifications/mark-read/${id}`, { method: 'POST' });

            if(typeof refreshNotifications === "function"){
                refreshNotifications();
            }
        } catch (err) {
            console.error("Failed executing mark-read route context:", err);
        }
    });

    renderInbox();
});
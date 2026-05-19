$(document).ready(function(){
    let currentFilter = 'all';

    function formatDate(dateStr){
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    function renderInbox(){
        const all = getNotifications().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const filtered = currentFilter === 'all'    ? all
            : currentFilter === 'unread' ? all.filter(n => !n.isRead)
                : all.filter(n => n.isRead);

        const unreadCount = all.filter(n => !n.isRead).length;
        $('#inboxSubtitle').text(unreadCount + ' unread notification' + (unreadCount !== 1 ? 's' : ''));

        const container = $('#inboxList');
        container.empty();

        if(filtered.length === 0){
            container.append('<div class="inbox-empty">No notifications found.</div>');
            return;
        }

        filtered.forEach(function(n){
            const actionBtn = n.isRead
                ? `<span class="inbox-mark-btn read-label">Read</span>`
                : `<button class="inbox-mark-btn inbox-single-read" data-id="${n.id}">Mark as read</button>`;

            container.append(`
                <div class="inbox-item ${n.isRead ? '' : 'unread'}" data-id="${n.id}">
                    <div class="unread-dot ${n.isRead ? 'read' : ''}"></div>
                    <div class="inbox-item-body">
                        <div class="inbox-item-top">
                            <span class="notif-type-badge ${n.type}">${n.type.replace(/_/g, ' ')}</span>
                            <span class="inbox-item-time">${formatDate(n.createdAt)}</span>
                        </div>
                        <span class="inbox-item-message">${n.message}</span>
                    </div>
                    <div class="inbox-item-action">${actionBtn}</div>
                </div>
            `);
        });
    }

    $(document).on('click', '.filter-btn', function(){
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        renderInbox();
    });

    $(document).on('click', '.inbox-single-read', function(){
        const id = parseInt($(this).data('id'));
        const list = getNotifications();
        const notif = list.find(n => n.id === id);
        if(notif) notif.isRead = true;
        saveNotifications(list);
        updateBellBadge();
        renderInbox();
    });

    $('#inboxReadAll').on('click', function(){
        const list = getNotifications().map(n => ({ ...n, isRead: true }));
        saveNotifications(list);
        updateBellBadge();
        renderInbox();
    });

    $('#logoutBtn').on('click', function(){
        window.location.href = '../../login.html';
    });

    renderInbox();
});
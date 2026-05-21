function getNotifications() {
    return JSON.parse(localStorage.getItem('notificationList') || '[]');
}

function saveNotifications(list) {
    localStorage.setItem('notificationList', JSON.stringify(list));
}

function updateBellBadge() {
    const count = getNotifications().filter(n => !n.isRead).length;
    const badge = $('#bellBadge');

    if(count > 0){
        badge.text(count > 99 ? '99+' : count).removeClass('hidden');
    } else {
        badge.addClass('hidden');
    }
}

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if(diff < 60)    return 'just now';
    if(diff < 3600)  return Math.floor(diff / 60) + 'm ago';
    if(diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
}

function renderDropdown() {
    const unread = getNotifications()
        .filter(n => !n.isRead)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const list = $('#notifList');
    list.empty();

    if(unread.length === 0){
        list.append('<div class="notif-empty">No unread notifications</div>');
        return;
    }

    unread.forEach(function(n){
        list.append(`
            <div class="notif-item unread" data-id="${n.id}">
                <div class="notif-item-top">
                    <span class="notif-type-badge ${n.type}">${n.type.replace(/_/g, ' ')}</span>
                    <span class="notif-time">${timeAgo(n.createdAt)}</span>
                </div>
                <span class="notif-message">${n.message}</span>
                <div class="notif-item-bottom">
                    <span class="notif-hint">Click to read</span>
                </div>
            </div>
        `);
    });
}

function injectModal() {
    if($('#notifModal').length) return;

    $('body').append(`
        <div class="notif-modal-overlay" id="notifModalOverlay">
            <div class="notif-modal" id="notifModal">
                <div class="notif-modal-header">
                    <span class="notif-modal-type" id="notifModalType"></span>
                    <button class="notif-modal-close" id="notifModalClose">✕</button>
                </div>
                <div class="notif-modal-body">
                    <p class="notif-modal-message" id="notifModalMessage"></p>
                    <span class="notif-modal-time" id="notifModalTime"></span>
                </div>
            </div>
        </div>
    `);
}

function openModal(id) {
    const notif = getNotifications().find(n => n.id === id);
    if(!notif) return;

    $('#notifModalType')
        .text(notif.type.replace(/_/g, ' '))
        .attr('class', 'notif-modal-type notif-type-badge ' + notif.type);
    $('#notifModalMessage').text(notif.message);
    $('#notifModalTime').text(new Date(notif.createdAt).toLocaleString('en-GB'));
    $('#notifModalOverlay').addClass('open');

    const list = getNotifications();
    const n = list.find(n => n.id === id);
    if(n) n.isRead = true;
    saveNotifications(list);
    updateBellBadge();
    renderDropdown();
}

function closeModal() {
    $('#notifModalOverlay').removeClass('open');
}

function initNotifications() {
    injectModal();
    updateBellBadge();

    $('#bellBtn').on('click', function(e){
        e.stopPropagation();
        const isOpen = $('#notifDropdown').hasClass('open');
        $('#notifDropdown').toggleClass('open', !isOpen);
        if(!isOpen) renderDropdown();
    });

    $(document).on('click', function(e){
        if(!$(e.target).closest('.notif-wrapper').length){
            $('#notifDropdown').removeClass('open');
        }
    });

    $(document).on('click', '.notif-item', function(){
        const id = parseInt($(this).data('id'));
        openModal(id);
        $('#notifDropdown').removeClass('open');
    });

    $('#readAllBtn').on('click', function(e){
        e.stopPropagation();
        const list = getNotifications().map(n => ({ ...n, isRead: true }));
        saveNotifications(list);
        updateBellBadge();
        renderDropdown();
    });

    $('#showAllBtn').on('click', function(){
        window.location.href = '../html/inbox.html';
    });

    $(document).on('click', '#notifModalClose, #notifModalOverlay', function(e){
        if(e.target === this) closeModal();
    });

    if(!localStorage.getItem('notificationList')){
        saveNotifications([
            { id: 1, type: 'login_detected',      message: 'New login detected from IP 192.168.1.1', isRead: false, createdAt: new Date(Date.now() - 60000).toISOString() },
            { id: 2, type: 'create_client',        message: 'Client John Doe was created successfully', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
            { id: 3, type: 'balance_updated',      message: 'Balance updated to $2,500 for client Jane Smith', isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
            { id: 4, type: 'transaction_received', message: 'Transaction of $500 received by client #102', isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 5, type: 'transaction_failed',   message: 'Transfer of $1,200 failed — insufficient balance', isRead: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
            { id: 6, type: 'delete_client',        message: 'Client account #88 was deleted by banker', isRead: true,  createdAt: new Date(Date.now() - 259200000).toISOString() },
            { id: 6, type: 'balance_updated',        message: 'Client account #90 was added by banker', isRead: false,  createdAt: new Date(Date.now() - 259200000).toISOString() },
        ]);
        updateBellBadge();
    }
}

$(document).ready(function(){
    initNotifications();
});
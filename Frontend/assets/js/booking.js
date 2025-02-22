document.addEventListener("DOMContentLoaded", () => {
    // Initialize date range picker
    $('#date-range-picker').daterangepicker({
        startDate: moment(),
        endDate: moment(),
        locale: { format: 'YYYY-MM-DD' },
    });

    // Handle guest input
    document.getElementById("increase-guest").addEventListener("click", () => {
        const guestInput = document.getElementById("guest-input");
        guestInput.value = parseInt(guestInput.value) + 1;
    });

    document.getElementById("decrease-guest").addEventListener("click", () => {
        const guestInput = document.getElementById("guest-input");
        if (guestInput.value > 1) guestInput.value = parseInt(guestInput.value) - 1;
    });

    // Handle room input
    document.getElementById("increase-room").addEventListener("click", () => {
        const roomInput = document.getElementById("room-input");
        roomInput.value = parseInt(roomInput.value) + 1;
    });

    document.getElementById("decrease-room").addEventListener("click", () => {
        const roomInput = document.getElementById("room-input");
        if (roomInput.value > 1) roomInput.value = parseInt(roomInput.value) - 1;
    });

    // Handle booking submission
    document.getElementById("bookButton").addEventListener("click", () => {
        const dateRange = $('#date-range-picker').val();
        const [startDate, endDate] = dateRange.split(' - ');
        const roomType = document.querySelector(".form-select").value;
        const numGuests = document.getElementById("guest-input").value;
        const numRooms = document.getElementById("room-input").value;
        const message = document.getElementById("formControlTextarea1").value;

        if (!startDate || !endDate || !roomType || !numGuests || !numRooms) {
            alert("Please fill in all fields before booking.");
            return;
        }

        const bookingData = { startDate, endDate, roomType, numGuests, numRooms, message };
        renderBookingData(bookingData);
    });
});

function renderBookingData(data) {
    localStorage.setItem('bookingData', JSON.stringify(data));
    window.location.href = 'payment.html';
}
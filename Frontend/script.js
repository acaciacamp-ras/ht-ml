$(document).ready(function() {
    // Initialize the date range picker
    $('#date-range-picker').daterangepicker({
        startDate: moment(), // Today's date
        endDate: moment(),   // Today's date
        locale: {
            format: 'YYYY-MM-DD' // Date format
        }
    });

    // Capture the selected dates
    $('#date-range-picker').on('apply.daterangepicker', function(ev, picker) {
        const startDate = picker.startDate.format('YYYY-MM-DD');
        const endDate = picker.endDate.format('YYYY-MM-DD');
        console.log("Selected Start Date: " + startDate);
        console.log("Selected End Date: " + endDate);
    });

    // Handle Guest Input
    const increaseGuestBtn = document.getElementById('increase-guest');
    const decreaseGuestBtn = document.getElementById('decrease-guest');
    const guestInput = document.getElementById('guest-input');

    increaseGuestBtn.addEventListener('click', () => {
        let currentGuestValue = parseInt(guestInput.value);
        guestInput.value = currentGuestValue + 1;
    });

    decreaseGuestBtn.addEventListener('click', () => {
        let currentGuestValue = parseInt(guestInput.value);
        if (currentGuestValue > 1) {
            guestInput.value = currentGuestValue - 1;
        }
    });

    // Handle Room Input
    const increaseRoomBtn = document.getElementById('increase-room');
    const decreaseRoomBtn = document.getElementById('decrease-room');
    const roomInput = document.getElementById('room-input');

    increaseRoomBtn.addEventListener('click', () => {
        let currentRoomValue = parseInt(roomInput.value);
        roomInput.value = currentRoomValue + 1;
    });

    decreaseRoomBtn.addEventListener('click', () => {
        let currentRoomValue = parseInt(roomInput.value);
        if (currentRoomValue > 1) {
            roomInput.value = currentRoomValue - 1;
        }
    });

    // Capture and Render Form Data
    const bookButton = document.querySelector('.btn-info'); // BOOK button
    bookButton.addEventListener('click', () => {
        // Get the selected dates
        const dateRange = $('#date-range-picker').val();
        const [startDate, endDate] = dateRange.split(' - ');

        // Get the selected room type
        const roomType = document.querySelector('.form-select').value;

        // Get the number of guests
        const numGuests = document.getElementById('guest-input').value;

        // Get the number of rooms
        const numRooms = document.getElementById('room-input').value;

        // Get the additional message
        const message = document.getElementById('formControlTextarea1').value;

        // Create an object to store the data
        const bookingData = {
            startDate,
            endDate,
            roomType,
            numGuests,
            numRooms,
            message
        };

        // Validate the fields
        if (!startDate || !endDate || !roomType || !numGuests || !numRooms) {
            alert("Please fill in all fields before booking.");
            return;
        }

        // Proceed to render or process the data
        renderBookingData(bookingData);
    });

    // Function to render or process the booking data
    function renderBookingData(data) {
    // Store the data in localStorage
    localStorage.setItem('bookingData', JSON.stringify(data));
    
    // Redirect to another page
    window.location.href = 'payment.html';
}

        // Display the data on the page
        const outputDiv = document.createElement('div');
        outputDiv.innerHTML = `
            <h3>Booking Details:</h3>
            <p><strong>Check-In:</strong> ${data.startDate}</p>
            <p><strong>Check-Out:</strong> ${data.endDate}</p>
            <p><strong>Room Type:</strong> ${data.roomType}</p>
            <p><strong>Number of Guests:</strong> ${data.numGuests}</p>
            <p><strong>Number of Rooms:</strong> ${data.numRooms}</p>
            <p><strong>Additional Message:</strong> ${data.message}</p>
        `;
        document.body.appendChild(outputDiv);
    }
);

        // Sample gallery data
        const galleries = [
            {
                id: 1,
                title: "Gallery 1",
                images: [
                    "https://via.placeholder.com/300?text=Image+1",
                    "https://via.placeholder.com/300?text=Image+2",
                    "https://via.placeholder.com/300?text=Image+3",
                    "https://via.placeholder.com/300?text=Image+4"
                ]
            },
            {
                id: 2,
                title: "Gallery 2",
                images: [
                    "https://via.placeholder.com/300?text=Image+5",
                    "https://via.placeholder.com/300?text=Image+6",
                    "https://via.placeholder.com/300?text=Image+7",
                    "https://via.placeholder.com/300?text=Image+8"
                ]
            },
            {
                id: 3,
                title: "Gallery 3",
                images: [
                    "https://via.placeholder.com/300?text=Image+9",
                    "https://via.placeholder.com/300?text=Image+10",
                    "https://via.placeholder.com/300?text=Image+11",
                    "https://via.placeholder.com/300?text=Image+12"
                ]
            }
        ];

        // Function to render galleries
        function renderGalleries(galleries) {
            const galleryRow = document.getElementById('galleryRow');
            galleryRow.innerHTML = ''; // Clear previous content

            galleries.forEach(gallery => {
                // Create thumbnail
                const col = document.createElement('div');
                col.className = 'col';
                const img = document.createElement('img');
                img.src = gallery.images[0]; // Use the first image as thumbnail
                img.className = 'img-thumbnail';
                img.alt = gallery.title;
                img.setAttribute('data-bs-toggle', 'modal');
                img.setAttribute('data-bs-target', `#modal${gallery.id}`);
                col.appendChild(img);
                galleryRow.appendChild(col);

                // Create modal
                const modal = document.createElement('div');
                modal.className = 'modal fade';
                modal.id = `modal${gallery.id}`;
                modal.tabIndex = '-1';
                modal.setAttribute('aria-labelledby', `modal${gallery.id}Label`);
                modal.setAttribute('aria-hidden', 'true');
                modal.innerHTML = `
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modal${gallery.id}Label">${gallery.title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    ${gallery.images.map((image, index) => `
                                        <div class="col-md-6 mb-3">
                                            <img src="${image}" class="img-fluid" alt="Image ${index + 1}">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            });
        }

        // Function to render galleries by specific IDs
        function renderGalleriesByIds(ids) {
            const filteredGalleries = galleries.filter(gallery => ids.includes(gallery.id));
            renderGalleries(filteredGalleries);
        }

        // Initialize the gallery on page load
        window.onload = () => renderGalleries(galleries);

        // Example of rendering galleries by specific IDs
        // Uncomment the line below to see the filtered galleries
        // renderGalleriesByIds([1, 3]);

        //regester-login.js
        
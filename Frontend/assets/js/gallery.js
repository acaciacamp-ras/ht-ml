document.addEventListener("DOMContentLoaded", () => {
    // Gallery data organized by categories
    const galleries = {
        nature: [
            {
                id: 1,
                title: "Nature Image 1",
                images: [
                    "https://via.placeholder.com/300?text=Nature+1",
                    "https://via.placeholder.com/300?text=Nature+2",
                    "https://via.placeholder.com/300?text=Nature+3",
                ],
            },
            {
                id: 2,
                title: "Nature Image 2",
                images: [
                    "https://via.placeholder.com/300?text=Nature+4",
                    "https://via.placeholder.com/300?text=Nature+5",
                    "https://via.placeholder.com/300?text=Nature+6",
                ],
            },
        ],
        adventure: [
            {
                id: 3,
                title: "Adventure Image 1",
                images: [
                    "https://via.placeholder.com/300?text=Adventure+1",
                    "https://via.placeholder.com/300?text=Adventure+2",
                    "https://via.placeholder.com/300?text=Adventure+3",
                ],
            },
            {
                id: 4,
                title: "Adventure Image 2",
                images: [
                    "https://via.placeholder.com/300?text=Adventure+4",
                    "https://via.placeholder.com/300?text=Adventure+5",
                    "https://via.placeholder.com/300?text=Adventure+6",
                ],
            },
        ],
        relaxation: [
            {
                id: 5,
                title: "Relaxation Image 1",
                images: [
                    "https://via.placeholder.com/300?text=Relaxation+1",
                    "https://via.placeholder.com/300?text=Relaxation+2",
                    "https://via.placeholder.com/300?text=Relaxation+3",
                ],
            },
            {
                id: 6,
                title: "Relaxation Image 2",
                images: [
                    "https://via.placeholder.com/300?text=Relaxation+4",
                    "https://via.placeholder.com/300?text=Relaxation+5",
                    "https://via.placeholder.com/300?text=Relaxation+6",
                ],
            },
        ],
    };

    // Render galleries for each category
    renderGallery("nature", "natureGallery", galleries.nature);
    renderGallery("adventure", "adventureGallery", galleries.adventure);
    renderGallery("relaxation", "relaxationGallery", galleries.relaxation);
});

function renderGallery(category, containerId, galleryData) {
    const galleryRow = document.getElementById(containerId);
    galleryRow.innerHTML = ""; // Clear previous content

    galleryData.forEach((gallery) => {
        // Create thumbnail
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        const img = document.createElement("img");
        img.src = gallery.images[0]; // Use the first image as thumbnail
        img.className = "img-thumbnail";
        img.alt = gallery.title;
        img.setAttribute("data-bs-toggle", "modal");
        img.setAttribute("data-bs-target", `#modal${gallery.id}`);
        col.appendChild(img);
        galleryRow.appendChild(col);

        // Create modal
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = `modal${gallery.id}`;
        modal.tabIndex = "-1";
        modal.setAttribute("aria-labelledby", `modal${gallery.id}Label`);
        modal.setAttribute("aria-hidden", "true");
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
                            `).join("")}
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
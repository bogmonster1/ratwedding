// --- UPCOMING DATES ---
document.addEventListener('DOMContentLoaded', () => {

    // MOBILE MENU
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('is-active');
        });
        navLinks.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    }

    // GOOGLE SHEETS TOUR DATES
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPMMR4ynutBrliv9qNzl7rZSviuhKtL615bY5RAgQtl9hU8NzY92koFErD8vcNr9O_6PUsm6DLIr6T/pub?output=csv";

    const tableBody = document.getElementById('tour-list');

    if (tableBody) {
        fetch(sheetURL)
            .then(response => response.text())
            .then(csvText => {
                const rows = csvText.split('\n').slice(1); // Remove header
                tableBody.innerHTML = ''; // Clear loading text

                let hasUpcomingDates = false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                rows.forEach(row => {
                    const columns = row.split(',');
                    if (columns.length < 4) return;

                    const dateStr = columns[0].trim();
                    const venue = columns[1].trim();
                    const city = columns[2].trim();
                    const link = columns[3].trim();

                    // UK Date Parser (DD/MM/YYYY)
                    let gigDate;
                    if (dateStr.includes('/')) {
                        const parts = dateStr.split('/');
                        gigDate = new Date(parts[2], parts[1] - 1, parts[0]);
                    } else {
                        gigDate = new Date(dateStr);
                    }

                    if (gigDate >= today && !isNaN(gigDate)) {
                        hasUpcomingDates = true;

                        // ... inside the loop ...

                        const tr = document.createElement('tr');

                        const dateDisplay = gigDate.toLocaleDateString('en-GB');

                        // --- SMART TICKET LOGIC START ---
                        let ticketButtonHTML;

                        // Clean up the input (make lowercase, remove spaces)
                        // This allows the band to type "Free", "FREE", or "free " and it still works
                        const cleanLink = link.toLowerCase().trim();

                        if (cleanLink === 'free') {
                            // CASE 1: The show is explicitly FREE
                            ticketButtonHTML = '<span class="ticket-status free">Free Entry</span>';
                        } else if (!link || cleanLink === '' || cleanLink === 'tba' || cleanLink === 'tbc') {
                            // CASE 2: No link or TBA
                            ticketButtonHTML = '<span class="ticket-status tba">More Info Soon</span>';
                        } else {
                            // CASE 3: It's a real URL
                            ticketButtonHTML = `<a href="${link}" target="_blank" class="ticket-link">Buy Tickets</a>`;
                        }
                        // --- SMART TICKET LOGIC END ---

                        tr.innerHTML = `
                            <td>${dateDisplay}</td>
                            <td>${venue}</td>
                            <td>${city}</td>
                            <td>${ticketButtonHTML}</td>
                        `;

                        tableBody.appendChild(tr);
                    }
                });

                if (!hasUpcomingDates) {
                    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px">No upcoming dates announced.</td></tr>';
                }

                if (window.location.hash) {
                    const anchorElement = document.querySelector(window.location.hash);
                    if (anchorElement) {
                        setTimeout(() => {
                            anchorElement.scrollIntoView({behavior: 'smooth'});
                        }, 100);
                    }
                }
            })
            .catch(error => {
                console.error('Error loading dates');
            });
    }
});

// --- CAROUSEL NAVIGATION ---
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // How far to scroll? (Adjust this based on your image width)
    const scrollAmount = 400;

    if (track && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({left: scrollAmount, behavior: 'smooth'});
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({left: -scrollAmount, behavior: 'smooth'});
        });
    }
});
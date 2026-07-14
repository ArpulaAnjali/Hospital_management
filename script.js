/* 
   Hospital Management System - JavaScript Logic
   Developed as a B.Tech 2nd Year Mini-Project
   Features: LocalStorage Persistence, Form Validations, SPA Navigation, Dark Mode Toggle
*/

// --- Static Doctor Data ---
const doctorData = [
    {
        id: 1,
        name: "Dr. Aravind Sharma",
        specialization: "Cardiologist",
        timings: "09:00 AM - 01:00 PM",
        contact: "+91 98765 43210"
    },
    {
        id: 2,
        name: "Dr. Priya Patel",
        specialization: "Pediatrician",
        timings: "10:00 AM - 02:00 PM",
        contact: "+91 87654 32109"
    },
    {
        id: 3,
        name: "Dr. Rajesh Iyer",
        specialization: "Neurologist",
        timings: "02:00 PM - 06:00 PM",
        contact: "+91 76543 21098"
    },
    {
        id: 4,
        name: "Dr. Sneha Reddy",
        specialization: "Dermatologist",
        timings: "04:00 PM - 08:00 PM",
        contact: "+91 65432 10987"
    },
    {
        id: 5,
        name: "Dr. Amit Verma",
        specialization: "Orthopedic",
        timings: "11:00 AM - 03:00 PM",
        contact: "+91 95432 87654"
    },
    {
        id: 6,
        name: "Dr. Meera Nair",
        specialization: "Gynecologist",
        timings: "08:00 AM - 12:00 PM",
        contact: "+91 84321 76543"
    }
];

// --- Initialize Local Storage ---
if (!localStorage.getItem("patients")) {
    localStorage.setItem("patients", JSON.stringify([]));
}
if (!localStorage.getItem("appointments")) {
    localStorage.setItem("appointments", JSON.stringify([]));
}

// --- DOM elements loaded ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup SPA navigation
    initNavigation();

    // 2. Setup Dark Mode
    initDarkMode();

    // 3. Render Doctors Cards & Populate dropdowns
    renderDoctors();
    populateDoctorDropdown();

    // 4. Load Records & Statistics
    updateDashboardStats();
    renderRecordsTable();

    // 5. Setup Form Submissions & Validations
    setupForms();

    // 6. Mobile Menu (Hamburger)
    setupMobileMenu();
});

// --- SPA Navigation System ---
function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetSectionId = link.getAttribute("data-target");

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove("active"));
            sections.forEach(s => s.classList.remove("active"));

            // Add active class to selected link and section
            link.classList.add("active");
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add("active");
            }

            // If navigating to Dashboard or Records, refresh them to show latest updates
            if (targetSectionId === "records") {
                renderRecordsTable();
            } else if (targetSectionId === "dashboard") {
                updateDashboardStats();
            }

            // Close mobile menu if open
            const navMenu = document.querySelector(".nav-menu");
            const hamburger = document.querySelector(".hamburger");
            if (navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
            }

            // Smooth scroll to top of page
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    // Special: Book button links inside Home / Doctors list
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-trigger-booking")) {
            const docId = e.target.getAttribute("data-doctor-id");
            navigateToSection("booking");
            if (docId) {
                document.getElementById("appt-doctor").value = docId;
            }
        }
    });
}

// Helper to switch sections programmatically
function navigateToSection(sectionId) {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section");

    navLinks.forEach(l => l.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));

    const activeLink = document.querySelector(`.nav-link[data-target="${sectionId}"]`);
    if (activeLink) activeLink.classList.add("active");

    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add("active");

    if (sectionId === "records") renderRecordsTable();
    if (sectionId === "dashboard") updateDashboardStats();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- Dark Mode Toggle System ---
function initDarkMode() {
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = themeBtn.querySelector("i");
    
    // Check local storage for preference
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.className = "fas fa-sun"; // Change to sun icon for light toggle
    } else {
        themeIcon.className = "fas fa-moon"; // Change to moon icon for dark toggle
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        
        let theme = "light";
        if (document.body.classList.contains("dark-mode")) {
            theme = "dark";
            themeIcon.className = "fas fa-sun";
        } else {
            themeIcon.className = "fas fa-moon";
        }
        localStorage.setItem("theme", theme);
    });
}

// --- Render Doctor Information List ---
function renderDoctors() {
    const doctorsContainer = document.getElementById("doctors-list-container");
    if (!doctorsContainer) return;

    doctorsContainer.innerHTML = ""; // Clear existing

    doctorData.forEach(doctor => {
        const card = document.createElement("div");
        card.className = "doctor-card";
        card.innerHTML = `
            <div class="doctor-image-container">
                <svg class="doctor-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
            </div>
            <div class="doctor-info">
                <h3 class="doctor-name">${doctor.name}</h3>
                <div class="doctor-specialty">${doctor.specialization}</div>
                <ul class="doctor-details-list">
                    <li>
                        <i>🕒</i> <strong>Timings:</strong> ${doctor.timings}
                    </li>
                    <li>
                        <i>📞</i> <strong>Contact:</strong> ${doctor.contact}
                    </li>
                </ul>
                <button class="btn-book btn-trigger-booking" data-doctor-id="${doctor.id}">
                    Book Appointment
                </button>
            </div>
        `;
        doctorsContainer.appendChild(card);
    });
}

// --- Populate Doctor Dropdown in Booking Form ---
function populateDoctorDropdown() {
    const selectElem = document.getElementById("appt-doctor");
    if (!selectElem) return;

    // Reset dropdown
    selectElem.innerHTML = `<option value="">-- Select Specialist --</option>`;

    doctorData.forEach(doctor => {
        const option = document.createElement("option");
        option.value = doctor.id;
        option.textContent = `${doctor.name} (${doctor.specialization})`;
        selectElem.appendChild(option);
    });
}

// --- Form Validation and Logic ---
function setupForms() {
    // 1. Patient Registration Form Validation
    const regForm = document.getElementById("patient-reg-form");
    if (regForm) {
        regForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateRegistrationForm()) {
                // Get form values
                const name = document.getElementById("reg-name").value.trim();
                const age = document.getElementById("reg-age").value.trim();
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const phone = document.getElementById("reg-phone").value.trim();
                const address = document.getElementById("reg-address").value.trim();
                const symptoms = document.getElementById("reg-symptoms").value.trim();

                const newPatient = {
                    id: Date.now(), // Unique ID using timestamp
                    name,
                    age,
                    gender,
                    phone,
                    address,
                    symptoms,
                    dateRegistered: new Date().toLocaleDateString()
                };

                // Add to Local Storage
                const patients = JSON.parse(localStorage.getItem("patients"));
                patients.push(newPatient);
                localStorage.setItem("patients", JSON.stringify(patients));

                // Show Success Alert
                showFormAlert("reg-alert", "Registration Successful! Patient ID: " + newPatient.id, "success");

                // Reset Form
                regForm.reset();
                
                // Add to Recent Activity log
                logActivity(`New Patient Registered: ${name}`);
            }
        });
    }

    // 2. Appointment Booking Form Validation
    const bookForm = document.getElementById("appointment-form");
    if (bookForm) {
        bookForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateBookingForm()) {
                const doctorId = document.getElementById("appt-doctor").value;
                const patientName = document.getElementById("appt-patient-name").value.trim();
                const date = document.getElementById("appt-date").value;
                const slot = document.getElementById("appt-slot").value;

                const selectedDoc = doctorData.find(d => d.id == doctorId);

                const newAppointment = {
                    id: Date.now(),
                    doctorName: selectedDoc.name,
                    doctorSpecialty: selectedDoc.specialization,
                    patientName,
                    date,
                    slot,
                    dateBooked: new Date().toLocaleDateString()
                };

                // Add to Local Storage
                const appointments = JSON.parse(localStorage.getItem("appointments"));
                appointments.push(newAppointment);
                localStorage.setItem("appointments", JSON.stringify(appointments));

                // Show Success Alert
                showFormAlert("appt-alert", `Appointment Booked successfully with ${selectedDoc.name} for ${date} (${slot})!`, "success");

                // Reset Form
                bookForm.reset();

                // Add to Recent Activity log
                logActivity(`Appointment Booked: ${patientName} with ${selectedDoc.name}`);
            }
        });
    }

    // 3. Contact Form Submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateContactForm()) {
                const contactName = document.getElementById("contact-name").value.trim();
                showFormAlert("contact-alert", `Thank you, ${contactName}! Your query has been submitted. Our team will contact you shortly.`, "success");
                contactForm.reset();
            }
        });
    }
}

// Validation helper for Registration
function validateRegistrationForm() {
    let isValid = true;

    const name = document.getElementById("reg-name");
    const age = document.getElementById("reg-age");
    const phone = document.getElementById("reg-phone");
    const address = document.getElementById("reg-address");
    const symptoms = document.getElementById("reg-symptoms");
    const genderMale = document.getElementById("gender-male");
    const genderFemale = document.getElementById("gender-female");
    const genderOther = document.getElementById("gender-other");

    // Clear previous invalid states
    document.querySelectorAll(".form-group").forEach(g => g.classList.remove("invalid"));

    // Name check
    if (name.value.trim().length < 3) {
        setInvalid(name, "Name must be at least 3 characters long");
        isValid = false;
    }

    // Age check
    const ageVal = parseInt(age.value);
    if (isNaN(ageVal) || ageVal <= 0 || ageVal > 120) {
        setInvalid(age, "Please enter a valid age (1-120)");
        isValid = false;
    }

    // Gender check
    if (!genderMale.checked && !genderFemale.checked && !genderOther.checked) {
        const genderContainer = document.querySelector(".gender-options").parentElement;
        genderContainer.classList.add("invalid");
        isValid = false;
    }

    // Phone check (10 digits)
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(phone.value.trim())) {
        setInvalid(phone, "Please enter a valid 10-digit mobile number");
        isValid = false;
    }

    // Address check
    if (address.value.trim().length < 5) {
        setInvalid(address, "Address must be at least 5 characters long");
        isValid = false;
    }

    // Symptoms check
    if (symptoms.value.trim().length === 0) {
        setInvalid(symptoms, "Please list symptoms or reason for registration");
        isValid = false;
    }

    return isValid;
}

// Validation helper for Booking Form
function validateBookingForm() {
    let isValid = true;

    const doctor = document.getElementById("appt-doctor");
    const patientName = document.getElementById("appt-patient-name");
    const dateInput = document.getElementById("appt-date");
    const slot = document.getElementById("appt-slot");

    document.querySelectorAll(".form-group").forEach(g => g.classList.remove("invalid"));

    // Doctor choice
    if (doctor.value === "") {
        setInvalid(doctor, "Please select a doctor");
        isValid = false;
    }

    // Patient Name check
    if (patientName.value.trim().length < 3) {
        setInvalid(patientName, "Patient name must be at least 3 characters long");
        isValid = false;
    }

    // Date check (Cannot book in the past)
    if (dateInput.value === "") {
        setInvalid(dateInput, "Please select an appointment date");
        isValid = false;
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(dateInput.value);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setInvalid(dateInput, "Appointment date cannot be in the past");
            isValid = false;
        }
    }

    // Slot selection
    if (slot.value === "") {
        setInvalid(slot, "Please select a time slot");
        isValid = false;
    }

    return isValid;
}

// Validation helper for Contact Form
function validateContactForm() {
    let isValid = true;

    const name = document.getElementById("contact-name");
    const email = document.getElementById("contact-email");
    const message = document.getElementById("contact-message");

    document.querySelectorAll(".form-group").forEach(g => g.classList.remove("invalid"));

    if (name.value.trim().length < 3) {
        setInvalid(name, "Name must be at least 3 characters long");
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        setInvalid(email, "Please enter a valid email address");
        isValid = false;
    }

    if (message.value.trim().length < 10) {
        setInvalid(message, "Message must be at least 10 characters long");
        isValid = false;
    }

    return isValid;
}

// Utility to set form fields as invalid
function setInvalid(element, message) {
    const parent = element.parentElement;
    parent.classList.add("invalid");
    const errorDisplay = parent.querySelector(".error-msg");
    if (errorDisplay) {
        errorDisplay.textContent = message;
    }
}

// Utility to show alert box
function showFormAlert(alertId, message, type) {
    const alertBox = document.getElementById(alertId);
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = "block";

    // Auto hide after 5 seconds
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 5000);
}

// --- Render Patients Records Table ---
function renderRecordsTable() {
    const tableBody = document.getElementById("records-table-body");
    if (!tableBody) return;

    const searchVal = document.getElementById("search-patient").value.trim().toLowerCase();
    const patients = JSON.parse(localStorage.getItem("patients")) || [];

    tableBody.innerHTML = ""; // Clear existing

    // Filter patients based on search input
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchVal)
    );

    if (filteredPatients.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-records">
                    ${searchVal ? "No matching patients found" : "No patient records available"}
                </td>
            </tr>
        `;
        return;
    }

    filteredPatients.forEach((patient, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${patient.name}</strong></td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.phone}</td>
            <td>${patient.symptoms}</td>
            <td>
                <button class="btn-delete" onclick="deletePatientRecord(${patient.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Hook up search filter on patient input
const searchInput = document.getElementById("search-patient");
if (searchInput) {
    searchInput.addEventListener("input", renderRecordsTable);
}

// Delete patient record
window.deletePatientRecord = function(patientId) {
    if (confirm("Are you sure you want to delete this patient record? This action cannot be undone.")) {
        let patients = JSON.parse(localStorage.getItem("patients")) || [];
        const patientObj = patients.find(p => p.id === patientId);
        
        // Remove patient
        patients = patients.filter(p => p.id !== patientId);
        localStorage.setItem("patients", JSON.stringify(patients));
        
        // Refresh records table
        renderRecordsTable();
        
        // Refresh dashboard counts if admin is active
        updateDashboardStats();

        if (patientObj) {
            logActivity(`Deleted Patient Record: ${patientObj.name}`);
        }
    }
};

// --- Update Admin Dashboard Stats ---
function updateDashboardStats() {
    const patientsCountEl = document.getElementById("total-patients-stat");
    const apptsCountEl = document.getElementById("total-appointments-stat");
    const docsCountEl = document.getElementById("total-doctors-stat");

    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    if (patientsCountEl) patientsCountEl.textContent = patients.length;
    if (apptsCountEl) apptsCountEl.textContent = appointments.length;
    if (docsCountEl) docsCountEl.textContent = doctorData.length;

    renderRecentActivity();
}

// --- Recent Activity Panel ---
function renderRecentActivity() {
    const activityList = document.getElementById("recent-activity-list");
    if (!activityList) return;

    let activities = JSON.parse(localStorage.getItem("recent_activity")) || [];
    
    // Default list if empty
    if (activities.length === 0) {
        activities = [
            { text: "System initialized", time: new Date().toLocaleTimeString() }
        ];
        localStorage.setItem("recent_activity", JSON.stringify(activities));
    }

    activityList.innerHTML = "";

    // Show top 5 recent activities (latest first)
    activities.slice(-5).reverse().forEach(act => {
        const li = document.createElement("li");
        li.className = "activity-item";
        li.innerHTML = `
            <div>${act.text}</div>
            <div class="activity-time">${act.time}</div>
        `;
        activityList.appendChild(li);
    });
}

function logActivity(text) {
    const activities = JSON.parse(localStorage.getItem("recent_activity")) || [];
    const newActivity = {
        text: text,
        time: new Date().toLocaleTimeString()
    };
    activities.push(newActivity);
    // Limit to last 50 activities in Storage
    if (activities.length > 50) {
        activities.shift();
    }
    localStorage.setItem("recent_activity", JSON.stringify(activities));
}

// --- Setup Mobile Menu Navigation ---
function setupMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }
}

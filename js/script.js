
// ==========================================
// 1. Mobile Navigation
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    const navItems = navLinks.querySelectorAll("a");

    // Open and close menu
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after clicking a navigation link
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}


// ==========================================
// 2. Dark Mode
// ==========================================

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

// Update theme icon
const updateThemeIcon = () => {
    if (!themeIcon) return;

    const isDarkMode = document.body.classList.contains("dark-mode");

    themeIcon.className = isDarkMode
        ? "bi bi-sun-fill theme-icon"
        : "bi bi-moon-fill theme-icon";
};

updateThemeIcon();

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener("click", () => {

        const isDarkMode =
            document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "theme",
            isDarkMode ? "dark" : "light"
        );

        updateThemeIcon();
    });
}


// ==========================================
// 3. Contact Form
// ==========================================

// ========================================
// Contact Form - Formspree
// ========================================

const contactForm = document.querySelector("#contactForm");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const formMessage = document.querySelector("#formMessage");
const messageCount = document.querySelector("#messageCount");

if (
    contactForm &&
    nameInput &&
    emailInput &&
    messageInput &&
    formMessage
) {

    let messageTimer;

    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    // Message character counter
    if (messageCount) {
        messageInput.addEventListener("input", () => {
            messageCount.textContent =
                `${messageInput.value.length} characters`;
        });
    }

    // Form submission
    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        clearTimeout(messageTimer);

        formMessage.textContent = "";
        formMessage.classList.remove("success", "error");

        // Validate name
        if (!name) {
            formMessage.textContent =
                "Please enter your name.";

            formMessage.classList.add("error");
            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            formMessage.textContent =
                "Please enter a valid email address.";

            formMessage.classList.add("error");
            return;
        }

        // Validate message
        if (!message) {
            formMessage.textContent =
                "Please enter your message.";

            formMessage.classList.add("error");
            return;
        }

        // Prevent multiple submissions
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        formMessage.textContent = "Sending your message...";

        try {

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                formMessage.textContent =
                    "Thank you! Your message has been sent successfully.";

                formMessage.classList.add("success");

                contactForm.reset();

                // Reset character counter
                if (messageCount) {
                    messageCount.textContent = "0 characters";
                }

            } else {

                const result = await response.json();

                formMessage.textContent =
                    result.errors?.map(error => error.message).join(", ") ||
                    "Sorry, your message could not be sent. Please try again.";

                formMessage.classList.add("error");
            }

        } catch (error) {

            formMessage.textContent =
                "Network error. Please check your internet connection and try again.";

            formMessage.classList.add("error");

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }

            messageTimer = setTimeout(() => {
                formMessage.textContent = "";
                formMessage.classList.remove("success", "error");
            }, 7000);
        }

    });

}


// ==========================================
// 4. Back to Top
// ==========================================

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {

    // Show or hide button while scrolling
    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    // Scroll to top when clicked
    backToTop.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

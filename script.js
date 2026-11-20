document.documentElement.classList.add("js-enabled");

const revealTargets = document.querySelectorAll(
  ".about .section-heading, .about-content, .services-section .section-heading, .service-card, .work-heading, .project-card, .contact-copy, .contact-form-panel"
);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => element.classList.add("reveal", "is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const EMAILJS_PUBLIC_KEY = "Fi--TjTxbepC8dhW4";
const EMAILJS_SERVICE_ID = "service_yd66aa5";
const EMAILJS_TEMPLATE_ID = "template_ojz9er1";

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const emailjsIsConfigured = [
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
].every((value) => value && !value.startsWith("YOUR_"));

if (emailjsIsConfigured && window.emailjs) {
  window.emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
    limitRate: {
      id: "portfolio-contact-form",
      throttle: 10000,
    },
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.className = "form-status";

    if (!emailjsIsConfigured) {
      formStatus.textContent = "Add your EmailJS public key, service ID, and template ID in script.js to enable message delivery.";
      formStatus.classList.add("is-info");
      return;
    }

    if (!window.emailjs) {
      formStatus.textContent = "The message service could not load. Please refresh the page and try again.";
      formStatus.classList.add("is-error");
      return;
    }

    const submitButton = contactForm.querySelector(".submit-button");
    const buttonLabel = submitButton.querySelector("span:first-child");
    submitButton.disabled = true;
    buttonLabel.textContent = "Sending...";
    formStatus.textContent = "";

    try {
      await window.emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        contactForm
      );

      contactForm.reset();
      formStatus.textContent = "Thanks for reaching out. Your message has been sent.";
      formStatus.classList.add("is-success");
    } catch (error) {
      console.error("EmailJS message could not be sent:", error);
      formStatus.textContent = "Your message could not be sent. Please try again in a moment.";
      formStatus.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      buttonLabel.textContent = "Send Message";
    }
  });
}

import "./style.css";
import "./main";
import emailjs from "@emailjs/browser";

const form = document.querySelector<HTMLFormElement>("#contact-form");
const status = document.querySelector<HTMLParagraphElement>("#status");
const submitButton = form?.querySelector<HTMLButtonElement>(
  'button[type="submit"]'
);

const year = document.querySelector<HTMLElement>("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (form && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    status.textContent = "Sending your message...";

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      status.textContent =
        "Thank you! Your message has been sent successfully.";

      form.reset();
    } catch (error) {
      console.error("Email sending failed:", error);

      status.textContent =
        "Sorry, your message could not be sent. Please try again.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

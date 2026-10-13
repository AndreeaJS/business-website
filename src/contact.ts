import "./style.css";
import "./main";

const form = document.querySelector<HTMLFormElement>("#contact-form");
const status = document.querySelector<HTMLParagraphElement>("#status");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  status!.textContent = "Thank you! Your message has been received.";

  form.reset();
});
import "./style.css";

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll<HTMLAnchorElement>("nav a").forEach((link) => {
  const href = link.getAttribute("href");

  if (
    href === `/${currentPage}` ||
    (currentPage === "index.html" && href === "/")
  ) {
    link.classList.add("active");
  }
});

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear().toString();
}
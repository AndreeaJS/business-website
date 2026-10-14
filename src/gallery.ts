
import "./style.css";
import "./main";

const gallery = document.querySelector<HTMLDivElement>("#gallery");

if (!gallery) {
  throw new Error("Gallery container not found.");
}

const images = import.meta.glob<string>(
  "/public/images/portofolio/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const sortedImages = Object.entries(images).sort(
  ([a], [b]) =>
    a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    })
);

if (sortedImages.length === 0) {
  console.warn("No portfolio images found.");
}

const imageUrls = sortedImages.map(([, url]) => url);

imageUrls.forEach((url, index) => {
  const button = document.createElement("button");
  button.className = "gallery-item";
  button.type = "button";
  button.setAttribute("aria-label", `Open photo ${index + 1}`);

  const img = document.createElement("img");
  img.src = url;
  img.alt = `Sorriso Photography — photo ${index + 1}`;
  img.loading = "lazy";
  img.decoding = "async";

  button.appendChild(img);
  gallery.appendChild(button);
});

// Creează lightbox-ul
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.hidden = true;
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Photo viewer");

lightbox.innerHTML = `
  <button class="lightbox-close" type="button"
    aria-label="Close photo">&times;</button>
  <button class="lightbox-arrow lightbox-prev" type="button"
    aria-label="Previous photo">&#8249;</button>
  <img class="lightbox-image" alt="">
  <button class="lightbox-arrow lightbox-next" type="button"
    aria-label="Next photo">&#8250;</button>
  <div class="lightbox-counter"></div>
`;

document.body.appendChild(lightbox);

const lightboxImage =
  lightbox.querySelector<HTMLImageElement>(".lightbox-image")!;

const counter =
  lightbox.querySelector<HTMLDivElement>(".lightbox-counter")!;

const closeButton =
  lightbox.querySelector<HTMLButtonElement>(".lightbox-close")!;

const prevButton =
  lightbox.querySelector<HTMLButtonElement>(".lightbox-prev")!;

const nextButton =
  lightbox.querySelector<HTMLButtonElement>(".lightbox-next")!;

let currentIndex = 0;
let previousFocus: HTMLElement | null = null;

function showPhoto(index: number) {
  if (imageUrls.length === 0) return;

  currentIndex = (index + imageUrls.length) % imageUrls.length;

  lightboxImage.src = imageUrls[currentIndex];
  lightboxImage.alt = `Portfolio photo ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${imageUrls.length}`;
}

function openLightbox(index: number) {
  previousFocus = document.activeElement as HTMLElement | null;

  showPhoto(index);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lightboxImage.removeAttribute("src");
  previousFocus?.focus();
}

gallery.querySelectorAll<HTMLButtonElement>(".gallery-item")
  .forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(index));
  });

closeButton.addEventListener("click", closeLightbox);

prevButton.addEventListener("click", () => {
  showPhoto(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
  showPhoto(currentIndex + 1);
});

// Închide la click pe fundal
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Navigare din tastatură
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
  if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
});

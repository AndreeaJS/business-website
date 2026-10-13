import "./style.css";
import "./main";


const galleryItems = Array.from(
  document.querySelectorAll<HTMLButtonElement>(".gallery-item")
);

const images = galleryItems.map((item) => {
  return item.querySelector("img")!;
});

if (images.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Photo viewer");

  const image = document.createElement("img");
  image.className = "lightbox-image";
  image.alt = "";

  const closeButton = document.createElement("button");
  closeButton.className = "lightbox-close";
  closeButton.type = "button";
  closeButton.innerHTML = "&times;";
  closeButton.setAttribute("aria-label", "Close photo");

  const prevButton = document.createElement("button");
  prevButton.className = "lightbox-arrow lightbox-prev";
  prevButton.type = "button";
  prevButton.textContent = "‹";
  prevButton.setAttribute("aria-label", "Previous photo");

  const nextButton = document.createElement("button");
  nextButton.className = "lightbox-arrow lightbox-next";
  nextButton.type = "button";
  nextButton.textContent = "›";
  nextButton.setAttribute("aria-label", "Next photo");

  const counter = document.createElement("p");
  counter.className = "lightbox-counter";
  counter.setAttribute("aria-live", "polite");

  lightbox.append(
    image,
    closeButton,
    prevButton,
    nextButton,
    counter
  );

  document.body.appendChild(lightbox);

  let currentIndex = 0;
  let lastFocusedElement: HTMLElement | null = null;

  function showImage(index: number) {
    currentIndex = (index + images.length) % images.length;

    const selectedImage = images[currentIndex];

    image.src = selectedImage.src;
    image.alt = selectedImage.alt;
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function openLightbox(index: number) {
    lastFocusedElement = document.activeElement as HTMLElement;
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
  }

  function showPrevious() {
    showImage(currentIndex - 1);
  }

  function showNext() {
    showImage(currentIndex + 1);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", showPrevious);
  nextButton.addEventListener("click", showNext);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showPrevious();
    } else if (event.key === "ArrowRight") {
      showNext();
    }
  });
}

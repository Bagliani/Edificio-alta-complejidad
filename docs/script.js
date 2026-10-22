// Lightbox para cualquier imagen con clase .lightbox-img (renders + historia)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.addEventListener('click', (e) => {
  const img = e.target.closest('.lightbox-img');
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = img.dataset.caption || img.alt;
  lightbox.classList.add('open');
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Acordeón del programa: expandir piso al clickear en mobile
const floors = document.querySelectorAll('.floor');
floors.forEach((floor) => {
  floor.addEventListener('click', () => {
    floor.classList.toggle('is-open');
  });
});

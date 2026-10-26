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

// Carrusel de renders: se desliza solo, y se puede arrastrar con mouse
// o deslizar con el dedo / trackpad (scroll nativo del navegador).
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.render-track').forEach((track) => {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let dragDistance = 0;
  let autoTimer = null;

  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    autoTimer = setInterval(() => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: 1, behavior: 'auto' });
      }
    }, 20);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    dragDistance = 0;
    track.classList.add('dragging');
    startX = e.pageX;
    startScroll = track.scrollLeft;
    stopAuto();
  });
  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
    if (dragDistance > 6) {
      // Fue un arrastre real: que el click que sigue no abra el lightbox.
      track.addEventListener('click', (e) => e.stopPropagation(), { capture: true, once: true });
    }
    startAuto();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const delta = e.pageX - startX;
    dragDistance = Math.abs(delta);
    track.scrollLeft = startScroll - delta;
  });
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', () => { if (!isDown) startAuto(); });
  track.addEventListener('touchstart', stopAuto, { passive: true });

  startAuto();
});

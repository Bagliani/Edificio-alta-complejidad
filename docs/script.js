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

// Diagrama "Programa en altura": hover (desktop) o click (mobile) muestra
// la descripción del nivel en el panel compartido de abajo.
const programRows = document.querySelectorAll('.prog-row');
const programDetail = document.getElementById('programDetail');
const programData = document.getElementById('programData');

if (programRows.length && programDetail && programData) {
  const descByFloor = {};
  programData.querySelectorAll('[data-floor]').forEach((el) => {
    descByFloor[el.dataset.floor] = el.textContent.trim();
  });
  const detailName = programDetail.querySelector('.program-detail__name');
  const detailDesc = programDetail.querySelector('.program-detail__desc');

  function showFloor(row) {
    programRows.forEach((r) => r.classList.toggle('is-active', r === row));
    detailName.textContent = row.querySelector('.prog-row__name').textContent;
    detailDesc.textContent = descByFloor[row.dataset.floor] || '';
    programDetail.classList.add('has-floor');
  }

  programRows.forEach((row) => {
    row.addEventListener('mouseenter', () => showFloor(row));
    row.addEventListener('focus', () => showFloor(row));
    row.addEventListener('click', () => showFloor(row));
  });
}

// Crossfade de imágenes en Concepto: van alternando solas.
document.querySelectorAll('.section__media--crossfade').forEach((wrap) => {
  const imgs = wrap.querySelectorAll('.crossfade__img');
  if (imgs.length < 2) return;
  let current = 0;
  setInterval(() => {
    imgs[current].classList.remove('is-active');
    current = (current + 1) % imgs.length;
    imgs[current].classList.add('is-active');
  }, 5500);
});

// Links de Documentación: forzar apertura en pestaña/ventana nueva vía JS.
// En algunos navegadores/webviews, target="_blank" termina navegando en la
// misma pestaña y "reemplaza" el historial, así que al volver con "atrás"
// no se vuelve a esta página. window.open() evita ese problema.
document.querySelectorAll('.doc-card a[target="_blank"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(link.href, '_blank', 'noopener');
  });
});

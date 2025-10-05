// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(link => {
link.addEventListener('click', function(e) {
e.preventDefault();
document.querySelector(this.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
});
});

// Book Us button scrolls to contact
document.getElementById('bookBtn').addEventListener('click', function(e){
e.preventDefault();
document.querySelector('#contact').scrollIntoView({behavior:'smooth'});
});

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryLinks = Array.from(document.querySelectorAll('.gallery-grid a'));
  let currentIndex = -1;

  if (!galleryGrid || galleryLinks.length === 0) {
    console.warn('Gallery is empty or .gallery-grid missing. Add <a data-src="images/your.jpg"><img> items.');
    return;
  }

  // Open lightbox with given src
  function openLightbox(src) {
    if (!src) {
      console.error('openLightbox called without src');
      return;
    }
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    // ensure focus so keyboard works
    lightbox.setAttribute('tabindex', '-1');
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  }

  function showIndex(i) {
    if (i < 0) i = galleryLinks.length - 1;
    if (i >= galleryLinks.length) i = 0;
    currentIndex = i;
    const a = galleryLinks[currentIndex];
    const src = a.dataset.src || a.href;
    openLightbox(src);
  }

  // Delegated click handler - prevents default navigation
  galleryGrid.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || !galleryGrid.contains(a)) return; // not a gallery link
    e.preventDefault(); // IMPORTANT - prevents browser from navigating to href
    currentIndex = galleryLinks.indexOf(a);
    if (currentIndex === -1) {
      // rebuild array if DOM changed
      const updated = Array.from(document.querySelectorAll('.gallery-grid a'));
      currentIndex = updated.indexOf(a);
      if (currentIndex === -1) return console.error('Clicked gallery link not found');
    }
    const src = a.dataset.src || a.href;
    openLightbox(src);
  });

  // Close button
  closeBtn.addEventListener('click', closeLightbox);

  // Prev / Next
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showIndex(currentIndex - 1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showIndex(currentIndex + 1);
  });

  // Click outside image closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard controls: Esc, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
  });

  // Handy: verify each image loads (console message if not)
  galleryLinks.forEach((a, idx) => {
    const src = a.dataset.src || a.href;
    const img = new Image();
    img.onload = () => {/* ok */};
    img.onerror = () => console.warn(`Image failed to load: ${src} (index ${idx})`);
    img.src = src;
  });

  console.log('Gallery lightbox initialized. Images found:', galleryLinks.length);
});
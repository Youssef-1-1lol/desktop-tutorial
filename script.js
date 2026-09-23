const progressBar = document.querySelector('#progress-bar');
const chapterLabel = document.querySelector('#chapter-label');
const parallaxItems = document.querySelectorAll('[data-speed]');
const scenes = document.querySelectorAll('.scene');
const glow = document.querySelector('.cursor-glow');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrollTop / scrollable) * 100}%`;

  parallaxItems.forEach((item) => {
    const rect = item.closest('.scene').getBoundingClientRect();
    const speed = Number(item.dataset.speed);
    const distance = clamp(-rect.top * speed, -220, 220);
    item.style.transform = `translate3d(0, ${distance}px, 0)`;
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    chapterLabel.textContent = entry.target.dataset.chapter;
  });
}, { threshold: 0.48 });

scenes.forEach((scene) => sceneObserver.observe(scene));

window.addEventListener('scroll', updateScrollEffects, { passive: true });
window.addEventListener('resize', updateScrollEffects);
window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

updateScrollEffects();

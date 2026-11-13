const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    }
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const typewriterItems = [...document.querySelectorAll('[data-typewriter]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeBookTeaser() {
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const teaser = document.querySelector('.book-tease');
  if (!teaser) return;

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();

    let itemIndex = 0;
    const typeNextItem = () => {
      const item = typewriterItems[itemIndex];
      if (!item) return;
      const text = item.dataset.typewriter;
      item.textContent = '';
      item.classList.add('book-typed');
      let character = 0;
      const typeCharacter = () => {
        item.textContent = text.slice(0, ++character);
        if (character < text.length) {
          window.setTimeout(typeCharacter, 42);
        } else {
          item.classList.remove('book-typed');
          itemIndex += 1;
          window.setTimeout(typeNextItem, 180);
        }
      };
      typeCharacter();
    };

    typeNextItem();
  }, { threshold: 0.35 });

  observer.observe(teaser);
}

typeBookTeaser();

function playProjectorStart() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const context = new AudioContext();
    const start = context.currentTime;
    const noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;

    const source = context.createBufferSource();
    source.buffer = noise;
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, start);
    const clicks = context.createGain();
    clicks.gain.setValueAtTime(0.001, start);
    for (let i = 0; i < 11; i += 1) {
      const time = start + 0.06 + i * 0.065;
      clicks.gain.setValueAtTime(0.001, time);
      clicks.gain.linearRampToValueAtTime(0.11, time + 0.008);
      clicks.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
    }
    source.connect(filter).connect(clicks).connect(context.destination);
    source.start(start);
    source.stop(start + 0.9);

    const motor = context.createOscillator();
    const motorGain = context.createGain();
    motor.type = 'sine';
    motor.frequency.setValueAtTime(42, start);
    motor.frequency.exponentialRampToValueAtTime(62, start + 0.45);
    motorGain.gain.setValueAtTime(0.001, start);
    motorGain.gain.linearRampToValueAtTime(0.035, start + 0.45);
    motorGain.gain.exponentialRampToValueAtTime(0.001, start + 1.15);
    motor.connect(motorGain).connect(context.destination);
    motor.start(start);
    motor.stop(start + 1.2);
    window.setTimeout(() => context.close(), 1500);
  } catch {
    // Sound is a small enhancement; the link still works if audio is unavailable.
  }
}

document.querySelector('[data-projector-sound]')?.addEventListener('click', playProjectorStart);

const hero = document.querySelector('.hero');
if (hero && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
    hero.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
  });

  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--light-x', '50%');
    hero.style.setProperty('--light-y', '52%');
  });
}

(() => {
  const textTarget = document.querySelector('.darkness-typewriter-text');
  const soundToggle = document.querySelector('.darkness-sound-toggle');
  if (!textTarget || !soundToggle) return;

  const title = 'DARKNESS OF PHOTOGRAPHY';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let soundEnabled = false;
  let audioContext;
  let timer;

  function typeTap() {
    if (!soundEnabled || !audioContext || audioContext.state !== 'running') return;
    const now = audioContext.currentTime;
    const buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * 0.045), audioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 2300;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);
    source.connect(filter).connect(gain).connect(audioContext.destination);
    source.start(now);
  }

  function startTyping() {
    window.clearTimeout(timer);
    if (reducedMotion) {
      textTarget.textContent = title;
      return;
    }

    textTarget.textContent = '';
    let position = 0;
    const nextCharacter = () => {
      textTarget.textContent += title[position];
      typeTap();
      position += 1;
      if (position < title.length) timer = window.setTimeout(nextCharacter, 88);
    };
    timer = window.setTimeout(nextCharacter, 550);
  }

  soundToggle.addEventListener('click', async () => {
    if (reducedMotion) return;
    if (!soundEnabled) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioContext ||= new AudioContext();
      await audioContext.resume();
      soundEnabled = true;
      soundToggle.setAttribute('aria-pressed', 'true');
      soundToggle.setAttribute('aria-label', 'Turn typing sound off');
      soundToggle.innerHTML = 'Typing sound <span>on</span>';
    } else {
      soundEnabled = false;
      soundToggle.setAttribute('aria-pressed', 'false');
      soundToggle.setAttribute('aria-label', 'Enable typing sound');
      soundToggle.innerHTML = 'Typing sound <span>off</span>';
    }
    startTyping();
  });

  if (reducedMotion) {
    soundToggle.hidden = true;
    textTarget.textContent = title;
  } else {
    startTyping();
  }
})();

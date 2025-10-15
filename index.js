STATUS = { inhale: 'inhale', exhale: 'exhale', hold: 'hold' };
FOUR_SECONDS_INTERVAL = 4_000; // 4 seconds
FIVE_SECONDS_INTERVAL = 5_000; // 5 seconds
SEVEN_SECONDS_INTERVAL = 7_000; // 7 seconds
EIGHT_SECONDS_INTERVAL = 8_000; // 8 seconds
REFRESH_RATE_MILLIS = 200;
const params = new URLSearchParams(window.location.search);
const debug_mode = params.get('debug') === 'true';

const themeColors = {
  light: { inhale: '#F55E56', exhale: '#E8F556', hold: '#56A8F5' },
  dark: { inhale: '#F55E56', exhale: '#D4883C', hold: '#56A8F5' },
}

const inhaleAudio = new Audio('./assets/sounds/inhale.mp3');
const exhaleAudio = new Audio('./assets/sounds/exhale.mp3');
const holdAudio = new Audio('./assets/sounds/hold.mp3');

let mainInterval = null;
let currentShape = null;
let lastPlayedSound = null;
let muted = false;
let darkTheme = true;

document.addEventListener('DOMContentLoaded', () => {
  if (debug_mode) console.info('%cSaludos a Walter', "color: purple; font-size: 20px;");
  if (debug_mode) alert('Debug mode enabled (CACHE_V12)');
  const buttonSquare = document.getElementById('button-square');
  // const buttonTriangle = document.getElementById('button-triangle');
  const buttonTriangle478 = document.getElementById('button-triangle-478');
  const buttonCircle = document.getElementById('button-circle');
  const toggleNightMode = document.getElementById('toggle-night-mode-button');
  const toggleSound = document.getElementById('toggle-sound-button');
  toggleNightMode.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    darkTheme = !darkTheme;
    if (darkTheme) {
      document.getElementById('sun-icon').style.display = 'block';
      document.getElementById('moon-icon').style.display = 'none';
      document.querySelector('meta[name="theme-color"]').setAttribute("content", '#16161D');
    } else {
      document.getElementById('sun-icon').style.display = 'none';
      document.getElementById('moon-icon').style.display = 'block';
      document.querySelector('meta[name="theme-color"]').setAttribute("content", '#FFFFFF');
    }
  })
  toggleSound.addEventListener('click', () => {
    muted = !muted;
    [inhaleAudio, exhaleAudio, holdAudio].forEach(audio => audio.muted = muted);
    if (muted) {
      document.getElementById('sound-icon').style.display = 'none';
      document.getElementById('mute-icon').style.display = 'block';
    } else {
      document.getElementById('sound-icon').style.display = 'block';
      document.getElementById('mute-icon').style.display = 'none';
    }
  })
  buttonSquare.addEventListener('click', (event) => {
    if (mainInterval && currentShape === event.target.id) {
      stopGuide();
    } else {
      prepareToBreath(event.target);
      squareBreathing(FOUR_SECONDS_INTERVAL);
    }
  })
  // buttonTriangle.addEventListener('click', (event) => {
  //   if (mainInterval && currentShape === event.target.id) {
  //     stopGuide();
  //   } else {
  //     prepareToBreath(event.target);
  //     triangleBreathing(FOUR_SECONDS_INTERVAL);
  //   }
  // })
  buttonTriangle478.addEventListener('click', (event) => {
    if (mainInterval && currentShape === event.target.id) {
      stopGuide();
    } else {
      prepareToBreath(event.target);
      triangleBreathing(FOUR_SECONDS_INTERVAL, SEVEN_SECONDS_INTERVAL, EIGHT_SECONDS_INTERVAL);
    }
  })
  buttonCircle.addEventListener('click', (event) => {
    if (mainInterval && currentShape === event.target.id) {
      stopGuide();
    } else {
      prepareToBreath(event.target);
      circleBreathing(FIVE_SECONDS_INTERVAL);
    }
  })
});

const unlockAudio = () => {
  [inhaleAudio, exhaleAudio, holdAudio].forEach(audio => {
    audio.load();
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => {
      // Ignore errors during unlock
    });
  });
};

const playSound = (currentSound) => {
  if (currentSound === lastPlayedSound) return;

  const audioMap = {
    inhaleSound: inhaleAudio,
    exhaleSound: exhaleAudio,
    holdSound: holdAudio
  };

  try {
    // Pause every audio before playing the next one
    [inhaleAudio, exhaleAudio, holdAudio].forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    const audio = audioMap[currentSound];
    audio.play().catch((error) => {
      if (debug_mode) alert(`play() error: ${error.message}`);
    });
    lastPlayedSound = currentSound;
  } catch (e) {
    if (debug_mode) alert(`playSound error: ${e.message}`);
  }
};

const stopGuide = () => {
  [inhaleAudio, exhaleAudio, holdAudio].forEach(audio => audio.pause());
  lastPlayedSound = null; // reset last played sound
  clearInterval(mainInterval); // stop the interval
  mainInterval = null;
  currentShape = null;
  clearButtonsBackground(); // clear previous selected button
  const breathingGuide = document.getElementById('breathing-guide');
  document.getElementById('controls-container').style.opacity = '1';
  document.getElementById('toggle-night-mode-button').style.opacity = '1';
  document.getElementById('toggle-sound-button').style.opacity = '1';
  breathingGuide.innerHTML = '';
  breathingGuide.style.width = '0';
  breathingGuide.style.height = '0';
};

const clearButtonsBackground = () => {
  const controlsContainer = document.getElementById('controls-container')
  Array.from(controlsContainer.getElementsByClassName('button')).forEach((button) => {
    button.classList.remove('selected');
  });
}

const prepareToBreath = (eventTarget) => {
  stopGuide();
  unlockAudio();
  document.getElementById('controls-container').style.opacity = '0.3';
  document.getElementById('toggle-night-mode-button').style.opacity = '0.3';
  document.getElementById('toggle-sound-button').style.opacity = '0.3';
  // read button id, and set as current Shape
  currentShape = eventTarget.id;
  eventTarget.classList.add('selected');
};

const holdingShape = (breathingGuide) => {
  playSound('holdSound');
  const color = darkTheme ? themeColors.dark.hold : themeColors.light.hold;
  breathingGuide.style.borderRadius = '20%';
  breathingGuide.style.width = '75%';
  breathingGuide.style.height = '75%';
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
}

const inhaleShape = (breathingGuide, percentage) => {
  playSound('inhaleSound');
  const color = darkTheme ? themeColors.dark.inhale : themeColors.light.inhale;
  breathingGuide.style.borderRadius = '100%';
  breathingGuide.style.width = `${percentage}%`;
  breathingGuide.style.height = `${percentage}%`;
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
};

const exhaleShape = (breathingGuide, percentage) => {
  playSound('exhaleSound');
  const color = darkTheme ? themeColors.dark.exhale : themeColors.light.exhale;
  breathingGuide.style.borderRadius = '100%';
  breathingGuide.style.width = `${100 - percentage}%`;
  breathingGuide.style.height = `${100 - percentage}%`;
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
}

const updateShape = (currentStatus, elapsedMillis, timeInterval) => {
  if (elapsedMillis > timeInterval) return;

  const breathingGuide = document.getElementById('breathing-guide');
  const remainingSeconds = Math.max(1, Math.ceil((timeInterval - elapsedMillis) / 1000));
  const percentage = (elapsedMillis / timeInterval * 100).toFixed(2);

  if (currentStatus === STATUS.hold) holdingShape(breathingGuide);
  if (currentStatus === STATUS.inhale) inhaleShape(breathingGuide, percentage);
  if (currentStatus === STATUS.exhale) exhaleShape(breathingGuide, percentage);
  breathingGuide.innerHTML = `
    <span>${remainingSeconds}</span>
    <small style='font-size: 1.5rem'>${currentStatus}</small>
  `;
};

/**
 * Square breathing: Ideal for axious moments.
 * @param {number} timeInterval - time in milliseconds for each step. 
 */
const squareBreathing = (timeInterval) => {
  let startTime = Date.now();
  let currentStatus = STATUS.inhale;
  let formerStatus = STATUS.inhale;
  mainInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedMillis = (currentTime - startTime);
    updateShape(currentStatus, elapsedMillis, timeInterval);
    if (elapsedMillis > timeInterval) {
      startTime = currentTime;
      if ([STATUS.inhale, STATUS.exhale].includes(currentStatus)) {
        formerStatus = currentStatus;
        currentStatus = STATUS.hold;
      } else if (currentStatus === STATUS.hold && formerStatus === STATUS.inhale) {
        currentStatus = STATUS.exhale;
      } else if (currentStatus === STATUS.hold && formerStatus === STATUS.exhale) {
        currentStatus = STATUS.inhale;
      }
    };
  }, REFRESH_RATE_MILLIS);
}

/**
 * Triangle breathing: Flexible breathing pattern with hold phase.
 * @param {number} inhaleDuration - time in milliseconds for inhale phase
 * @param {number} holdDuration - (optional) time in milliseconds for hold phase. If not provided, uses inhaleDuration
 * @param {number} exhaleDuration - (optional) time in milliseconds for exhale phase. If not provided, uses inhaleDuration
 */
const triangleBreathing = (inhaleDuration, holdDuration, exhaleDuration) => {
  // If only one parameter provided, use it for all phases (symmetric)
  const durations = {
    [STATUS.inhale]: inhaleDuration,
    [STATUS.hold]: holdDuration !== undefined ? holdDuration : inhaleDuration,
    [STATUS.exhale]: exhaleDuration !== undefined ? exhaleDuration : inhaleDuration
  };

  let startTime = Date.now();
  let currentStatus = STATUS.inhale;
  mainInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedMillis = (currentTime - startTime);
    const currentDuration = durations[currentStatus];
    updateShape(currentStatus, elapsedMillis, currentDuration);
    if (elapsedMillis > currentDuration) {
      startTime = currentTime;
      switch (currentStatus) {
        case STATUS.inhale:
          currentStatus = STATUS.hold;
          break;
        case STATUS.hold:
          currentStatus = STATUS.exhale;
          break;
        case STATUS.exhale:
          currentStatus = STATUS.inhale;
          break;
      }
    };
  }, REFRESH_RATE_MILLIS);
};

/**
 * Circle breathing: Ideal to recover your breath.
 * @param {number} timeInterval - time in milliseconds for each step. 
 */
const circleBreathing = (timeInterval) => {
  let startTime = Date.now();
  let currentStatus = STATUS.inhale;
  mainInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedMillis = (currentTime - startTime);
    updateShape(currentStatus, elapsedMillis, timeInterval);
    if (elapsedMillis >= timeInterval) {
      startTime = currentTime;
      switch (currentStatus) {
        case STATUS.inhale:
          currentStatus = STATUS.exhale;
          break;
        case STATUS.exhale:
          currentStatus = STATUS.inhale;
          break;
      }
    };
  }, REFRESH_RATE_MILLIS);
};

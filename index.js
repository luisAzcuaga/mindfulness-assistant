STATUS = { inhale: 'inhale', exhale: 'exhale', hold: 'hold' };
BREATHING_TIME_INTERVAL_MILLIS = 4_000; // 4 seconds
REFRESH_RATE_MILLIS = 200;
const params = new URLSearchParams(window.location.search);
const debug_mode = params.get('debug') === 'true';

const inhaleSound = new Audio('./assets/sounds/inhale.mp3');
const exhaleSound = new Audio('./assets/sounds/exhale.mp3');
const holdSound = new Audio('./assets/sounds/hold.mp3');

let mainInterval = null;
let currentShape = null;
let lastPlayedSound = null;
let darkTheme = true;

document.addEventListener('DOMContentLoaded', () => {
  if (debug_mode) console.info('%cSaludos a Walter', "color: purple; font-size: 20px;");
  if (debug_mode) alert('Debug mode enabled');
  const buttonSquare = document.getElementById('button-square');
  const buttonTriangle = document.getElementById('button-triangle');
  const buttonCircle = document.getElementById('button-circle');
  const toggleNightMode = document.getElementById('toggle-night-mode-button');
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

  buttonSquare.addEventListener('click', (event) => {
    if (mainInterval && currentShape === event.target.id) {
      stopGuide();
    } else {
      prepareToBreath(event.target);
      squareBreathing(BREATHING_TIME_INTERVAL_MILLIS);
    }
  })
  buttonTriangle.addEventListener('click', (event) => {
    if (mainInterval && currentShape === event.target.id) {
      stopGuide();
    } else {
      prepareToBreath(event.target);
      triangleBreathing(STATUS.exhale, BREATHING_TIME_INTERVAL_MILLIS);
    }
  })
  buttonCircle.addEventListener('click', (event) => {
    if (mainInterval && currentShape === event.target.id) {
      stopGuide();
    } else {
      prepareToBreath(event.target);
      circleBreathing(BREATHING_TIME_INTERVAL_MILLIS);
    }
  })
});

const clearSounds = () => {
  lastPlayedSound = null;
  holdSound.pause();
  holdSound.currentTime = 0;
  inhaleSound.pause();
  inhaleSound.currentTime = 0;
  exhaleSound.pause();
  exhaleSound.currentTime = 0;
};

const playSound = (sound) => {
  if (sound == 'exhaleSound' && lastPlayedSound != 'exhaleSound') {
    holdSound.pause();
    exhaleSound.currentTime = 0;
    exhaleSound.play();
    lastPlayedSound = 'exhaleSound';
  }
  if (sound == 'inhaleSound' && lastPlayedSound != 'inhaleSound') {
    holdSound.pause();
    inhaleSound.currentTime = 0;
    inhaleSound.play();
    lastPlayedSound = 'inhaleSound';
  }
  if (sound == 'holdSound' && lastPlayedSound != 'holdSound') {
    holdSound.currentTime = 0;
    holdSound.play();
    lastPlayedSound = 'holdSound';
  }
};

const stopGuide = () => {
  clearSounds();
  clearInterval(mainInterval);
  mainInterval = null;
  currentShape = null;
  clearButtonsBackground();
  const breathingGuide = document.getElementById('breathing-guide');
  document.getElementById('controls-container').style.opacity = '1';
  document.getElementById('toggle-night-mode-button').style.opacity = '1';
  breathingGuide.innerHTML = '';
  breathingGuide.style.backgroundColor = darkTheme ? 'black' : 'white';
  breathingGuide.style.boxShadow = 'none';
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
  clearSounds();
  clearInterval(mainInterval);
  clearButtonsBackground(); // clear previous selected button
  document.getElementById('controls-container').style.opacity = '0.3';
  document.getElementById('toggle-night-mode-button').style.opacity = '0.3';
  // read button id, and set as current Shape
  currentShape = eventTarget.id;
  eventTarget.classList.add('selected');
};

const holdingShape = (breathingGuide, color = '#56A8F5') => {
  playSound('holdSound');
  breathingGuide.style.borderRadius = '20%';
  breathingGuide.style.width = '75%';
  breathingGuide.style.height = '75%';
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
}

const inhaleShape = (breathingGuide, percentage, color = '#F55E56') => {
  playSound('inhaleSound');
  breathingGuide.style.borderRadius = '100%';
  breathingGuide.style.width = `${percentage}%`;
  breathingGuide.style.height = `${percentage}%`;
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
};

const exhaleShape = (breathingGuide, percentage, color = '#E8F556') => {
  playSound('exhaleSound');
  color = darkTheme ? '#D4883C ' : color; // dark theme yellow alternative
  breathingGuide.style.borderRadius = '100%';
  breathingGuide.style.width = `${100 - percentage}%`;
  breathingGuide.style.height = `${100 - percentage}%`;
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
}

const updateShape = (currentStatus, elapsedMillis, timeInterval) => {
  if (elapsedMillis > timeInterval) return;

  const breathingGuide = document.getElementById('breathing-guide');
  const remainingSeconds = ((timeInterval - elapsedMillis) / 1000).toFixed(0);
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
 * Square breathing: Ideal for axious moments.
 * @param {inhale | exhale} holdAfter - When will the holding step shows up.
 * @param {number} timeInterval - time in milliseconds for each step. 
 */
const triangleBreathing = (holdAfter = STATUS.inhale, timeInterval) => {
  let startTime = Date.now();
  let currentStatus = STATUS.inhale;
  mainInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedMillis = (currentTime - startTime);
    updateShape(currentStatus, elapsedMillis, timeInterval);
    if (elapsedMillis > timeInterval) {
      startTime = currentTime;
      switch (currentStatus) {
        case STATUS.inhale:
          currentStatus = holdAfter === STATUS.inhale ? STATUS.hold : STATUS.exhale;
          break;
        case STATUS.exhale:
          currentStatus = holdAfter === STATUS.inhale ? STATUS.inhale : STATUS.hold;
          break;
        case STATUS.hold:
          currentStatus = holdAfter === STATUS.inhale ? STATUS.exhale : STATUS.inhale;
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

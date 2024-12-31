const STATUS = { inhale: 'inhale', exhale: 'exhale', hold: 'hold' };
let mainInterval = null;
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('time-gap').addEventListener('change', (event) => {
    const breathingGuide = document.getElementById('breathing-guide');
    clearInterval(mainInterval);
    document.getElementById('time-gap-display').innerHTML = event.target.value;
    breathingGuide.innerHTML = '';
    breathingGuide.style.backgroundColor = 'white';
    breathingGuide.style.boxShadow = 'none';
  })
  document.getElementById('button-square').addEventListener('click', () => {
    const timeGap = document.getElementById('time-gap-display').innerHTML;
    clearInterval(mainInterval);
    squareBreathing(timeGap * 10);
  })
  document.getElementById('button-triangle').addEventListener('click', () => {
    const timeGap = document.getElementById('time-gap-display').innerHTML;
    clearInterval(mainInterval);
    triangleBreating(STATUS.exhale, timeGap * 10);
  })
  document.getElementById('button-circle').addEventListener('click', () => {
    const timeGap = document.getElementById('time-gap-display').innerHTML;
    clearInterval(mainInterval);
    circleBreating(timeGap * 10);
  })
});

const printStatus = (status, elapsedTime) => {
  const breathingGuide = document.getElementById('breathing-guide');
  const timeGapDisplay = document.getElementById('time-gap-display').innerHTML;
  const percentage = elapsedTime / timeGapDisplay * 10;
  if (status === STATUS.hold) {
    breathingGuide.style.borderRadius = '20%';
    breathingGuide.style.width = '100px';
    breathingGuide.style.height = '100px';
    breathingGuide.style.backgroundColor = '#56A8F5';
    breathingGuide.style.boxShadow = '0 0 20px 1px #56A8F5';
  }; 
  if (status === STATUS.inhale) {
    breathingGuide.style.borderRadius = '100%';
    breathingGuide.style.width = `${percentage}px`;
    breathingGuide.style.height = `${percentage}px`;
    breathingGuide.style.backgroundColor = '#F55E56';
    breathingGuide.style.boxShadow = '0 0 20px 1px #F55E56';
  };
  if (status === STATUS.exhale) {
    breathingGuide.style.borderRadius = '100%';
    breathingGuide.style.width = `${100 - percentage}px`;
    breathingGuide.style.height = `${100 - percentage}px`;
    breathingGuide.style.backgroundColor = '#E8F556';
    breathingGuide.style.boxShadow = '0 0 20px 1px #E8F556';
  };
  if (timeGapDisplay < 3) {
    breathingGuide.innerHTML = ''
  } else {
    breathingGuide.innerHTML = (elapsedTime / 10).toFixed(0);
  }
};

/**
 * Square breating: Ideal for axious moments.
 * @param {number} timeGap - time in seconds for each step. 
 */
const squareBreathing = (timeGap = 40) => {
  let startTime = Date.now();
  let status = STATUS.inhale;
  let formerStatus = STATUS.inhale;
  mainInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 100);
    printStatus(status, elapsedTime);
    if (elapsedTime >= timeGap) {
      startTime = currentTime;
      if ([STATUS.inhale, STATUS.exhale].includes(status)) {
        formerStatus = status;
        status = STATUS.hold;
      } else if (status === STATUS.hold && formerStatus === STATUS.inhale) {
        status = STATUS.exhale;
      } else if (status === STATUS.hold && formerStatus === STATUS.exhale) {
        status = STATUS.inhale;
      } 
    };
  },100);
}

/**
 * Square breating: Ideal for axious moments.
 * @param {inhale | exhale} holdAfter - When will the holding step shows up.
 * @param {number} timeGap - time in seconds for each step. 
 */
const triangleBreating = (holdAfter = STATUS.inhale, timeGap = 40) => {
  let startTime = Date.now();
  let status = STATUS.inhale;
  mainInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 100);
    printStatus(status, elapsedTime);
    if (elapsedTime >= timeGap) {
      startTime = currentTime;
      switch (status) {
        case STATUS.inhale:
          status = holdAfter === STATUS.inhale ? STATUS.hold : STATUS.exhale;
          break;
        case STATUS.exhale:
          status = holdAfter === STATUS.inhale ? STATUS.inhale : STATUS.hold;
          break;
        case STATUS.hold:
          status = holdAfter === STATUS.inhale ? STATUS.exhale : STATUS.inhale;
          break;
      }
    };
  },100);
};

/**
 * Circle breating: Ideal to recover your breath.
 * @param {number} timeGap - time in seconds for each step. 
 */
const circleBreating = (timeGap = 40) => {
  let startTime = Date.now();
  let status = STATUS.inhale;
  mainInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 100);
    printStatus(status, elapsedTime);
    if (elapsedTime >= timeGap) {
      startTime = currentTime;
      switch (status) {
        case STATUS.inhale:
          status = STATUS.exhale;
          break;
        case STATUS.exhale:
          status = STATUS.inhale;
          break;
      }
    };
  },100);
};
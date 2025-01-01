const STATUS = { inhale: 'inhale', exhale: 'exhale', hold: 'hold' };
let mainInterval = null;
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('time-gap').addEventListener('change', (event) => {
    const breathingGuide = document.getElementById('breathing-guide');
    clearInterval(mainInterval);
    clearButtonsBackground();
    document.getElementById('time-gap-display').innerHTML = `<span>${event.target.value}<small>&nbsp;sec</small></span>`;
    breathingGuide.innerHTML = '';
    breathingGuide.style.backgroundColor = 'white';
    breathingGuide.style.boxShadow = 'none';
  })
  document.getElementById('button-square').addEventListener('click', (event) => {
    const timeGapValue = document.getElementById('time-gap').value;
    prepareToBreath(event.target);
    squareBreathing(timeGapValue * 10);
  })
  document.getElementById('button-triangle').addEventListener('click', (event) => {
    const timeGapValue = document.getElementById('time-gap').value;
    prepareToBreath(event.target);
    triangleBreating(STATUS.exhale, timeGapValue * 10);
  })
  document.getElementById('button-circle').addEventListener('click', (event) => {
    const timeGapValue = document.getElementById('time-gap').value;
    prepareToBreath(event.target);
    circleBreating(timeGapValue * 10);
  })
});

const clearButtonsBackground = () => {
  Array.from(document.getElementsByClassName('button')).forEach((button) => {
    button.style.backgroundColor = '';
    button.style.color = 'black';
  });
}

const prepareToBreath = (eventTarget) => {
  clearButtonsBackground();
  eventTarget.style.backgroundColor = 'black';
  eventTarget.style.color = 'white';
  clearInterval(mainInterval);
};

const holdingShape = (breathingGuide, color = '#56A8F5') => {
  breathingGuide.style.borderRadius = '20%';
  breathingGuide.style.width = '75px';
  breathingGuide.style.height = '75px';
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
}

const inhaleShape = (breathingGuide, percentage, color = '#F55E56') => {
  breathingGuide.style.borderRadius = '100%';
  breathingGuide.style.width = `${percentage}px`;
  breathingGuide.style.height = `${percentage}px`;
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
};

const exhaleShape = (breathingGuide, percentage, color = '#E8F556') => {
  breathingGuide.style.borderRadius = '100%';
  breathingGuide.style.width = `${100 - percentage}px`;
  breathingGuide.style.height = `${100 - percentage}px`;
  breathingGuide.style.backgroundColor = color;
  breathingGuide.style.boxShadow = `0 0 20px 1px ${color}`;
}

const updateShape = (status, elapsedTime) => {
  const breathingGuide = document.getElementById('breathing-guide');
  const timeGapValue = document.getElementById('time-gap').value;
  const percentage = elapsedTime / timeGapValue * 10;
  if (status === STATUS.hold) holdingShape(breathingGuide);
  if (status === STATUS.inhale) inhaleShape(breathingGuide, percentage);
  if (status === STATUS.exhale) exhaleShape(breathingGuide, percentage);

  breathingGuide.innerHTML = timeGapValue - (elapsedTime / 10).toFixed(0)
  breathingGuide.innerHTML += `<small style='font-size: 1rem'>${status}</small>`
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
    updateShape(status, elapsedTime);
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
  }, 100);
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
    updateShape(status, elapsedTime);
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
  }, 100);
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
    updateShape(status, elapsedTime);
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
  }, 100);
};
import {
  getDistance,
  shiftPoint,
  getTarget,
  getLineColor,
  initializePoints,
} from './utils'

let points = [];
let context = null;
let arePointsShown = true;
let height = 0;
let width = 0;
let target = {
  x: width / 2,
  y: height / 2
};

// Temp variables
let onResize = null;
let point = null;
let distance = null;

// Basically constructor
export const attachListeners = canvas => {
  onResize = createOnResize(canvas);
  onResize();

  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext("2d");

  startAnimation();

  if (!("ontouchstart" in window)) {
    window.addEventListener("mousemove", onMouseMove);
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("mouseout", onMouseLeave);
  window.addEventListener("mouseover", onMouseEnter);
};

// Basically destructor
export const detachListeners = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("mouseout", onMouseLeave);
  window.removeEventListener("mouseover", onMouseEnter);
};

const createOnResize = canvas => () => {
  width = window.innerWidth;
  height = window.innerHeight;
  target = { x: width / 2, y: height / 2 };
  canvas.width = width;
  canvas.height = height;

  startAnimation();
};

const startAnimation = () => {
  points = initializePoints(width, height);

  animatePoints();

  for (let i in points) {
    shiftPoint(points[i]);
  }
};

const animatePoints = () => {
  if (arePointsShown && context) {
    context.clearRect(0, 0, width, height);

    for (let i in points) {
      // detect points in range
      point = points[i];
      distance = Math.abs(getDistance(target, point))
      
      if (distance < 4000) {
        point.transparency = 0.3;
        point.circle.transparency = 0.6;
      } else if (distance < 20000) {
        point.transparency = 0.1;
        point.circle.transparency = 0.3;
      } else if (distance < 40000) {
        point.transparency = 0.02;
        point.circle.transparency = 0.1;
      } else {
        point.transparency = 0;
        point.circle.transparency = 0;
      }

      drawLine(point);
      drawPoint(point);
    }
  }

  requestAnimationFrame(animatePoints);
};

const onMouseMove = e => {
  target = getTarget(e);
};

const onMouseLeave = () => {
  arePointsShown = false;
  window.removeEventListener("mousemove", onMouseMove);
  context.clearRect(0, 0, width, height);
};

const onMouseEnter = () => {
  arePointsShown = true;
  window.addEventListener("mousemove", onMouseMove);
};

const drawLine = point => {
  if (!point.transparency) {
    return;
  }

  for (let i in point.closest) {
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.closest[i].x, point.closest[i].y);
    context.strokeStyle = getLineColor(point.transparency);
    context.stroke();
  }
};

const drawPoint = point => {
  if (!point.circle || !point.circle.transparency) {
    return;
  }

  context.beginPath();
  context.arc(point.x, point.y, point.circle.radius, 0, 2 * Math.PI, false);
  context.fillStyle = getLineColor(point.circle.transparency);
  context.fill();
};

import { TweenLite, Circ } from "gsap";

const CIRCLE_COLOR = 'rgba(255,255,255,0.3)';
let points = [];
let context = null;
let animateHeader = true;
let height = 0;
let width = 0;
let target = {
  x: width / 2,
  y: height / 2
};
let resizeRef = null;
let point = null;

// Basically constructor
export const attachListeners = canvas => {
  setDimentions();

  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext("2d");

  initializePoints();

  initializeAnimation();

  resizeRef = resize(canvas);

  if (!("ontouchstart" in window)) {
    window.addEventListener("mousemove", mouseMove);
  }
  window.addEventListener("resize", resizeRef);
  window.addEventListener("mouseout", mouseLeave);
  window.addEventListener("mouseover", mouseEnter);
};

// Basically destructor
export const detachListeners = () => {
  window.removeEventListener("mousemove", mouseMove);
  window.removeEventListener("resize", resizeRef);
  window.removeEventListener("mouseout", mouseLeave);
  window.removeEventListener("mouseover", mouseEnter);
};

const initializePoints = () => {
  let i = 0;
  let j = 0;
  let k = 0;
  let px;
  let py;
  let placed;
  let closest = [];

  points = [];

  for (i = 0; i < width; i = i + width / 20) {
    for (j = 0; j < height; j = j + height / 20) {
      px = i + (Math.random() * width) / 20;
      py = j + (Math.random() * height) / 20;
      points.push({ x: px, originX: px, y: py, originY: py });
    }
  }

  // for each point find the 5 closest points
  for (i in points) {
    closest = [];
    px = points[i];

    for (j = 0; j < points.length; j++) {
      py = points[j];
      if (!(px === py)) {
        placed = false;
        for (let k = 0; k < 5; k++) {
          if (!placed) {
            if (closest[k] === undefined) {
              closest[k] = py;
              placed = true;
            }
          }
        }

        for (k = 0; k < 5; k++) {
          if (!placed && getDistance(px, py) < getDistance(px, closest[k])) {
            closest[k] = py;
            placed = true;
          }
        }
      }
    }

    px.closest = closest;
  }

  // assign a circle to each point
  for (i in points) {
    points[i].circle = Circle(2 + Math.random() * 2);
  }
};

const initializeAnimation = () => {
  animate();
  for (let i in points) {
    shiftPoint(points[i]);
  }
};

const animate = () => {
  if (animateHeader) {
    context.clearRect(0, 0, width, height);
    for (let i in points) {
      // detect points in range
      point = points[i];
      if (Math.abs(getDistance(target, point)) < 4000) {
        point.active = 0.3;
        point.circle.active = 0.6;
      } else if (Math.abs(getDistance(target, point)) < 20000) {
        point.active = 0.1;
        point.circle.active = 0.3;
      } else if (Math.abs(getDistance(target, point)) < 40000) {
        point.active = 0.02;
        point.circle.active = 0.1;
      } else {
        point.active = 0;
        point.circle.active = 0;
      }

      drawLines(point);
      draw(point);
    }
  }
  requestAnimationFrame(animate);
};

const mouseMove = e => {
  let posx = 0;
  let posy = 0;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    posy =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  target.x = posx;
  target.y = posy;
};

const resize = canvas => () => {
  setDimentions();

  canvas.width = width;
  canvas.height = height;
};

const mouseLeave = context => () => {
  window.removeEventListener("mousemove", mouseMove);
  animateHeader = false;
  context.clearRect(0, 0, width, height);
};

const mouseEnter = () => {
  animateHeader = true;
  window.addEventListener("mousemove", mouseMove);
};

const shiftPoint = p =>
  TweenLite.to(p, 1 + 1 * Math.random(), {
    x: p.originX - 50 + Math.random() * 100,
    y: p.originY - 50 + Math.random() * 100,
    ease: Circ.easeInOut,
    onComplete: () => shiftPoint(p)
  });

const drawLines = p => {
  if (!p.active) {
    return;
  }
  for (let i in p.closest) {
    context.beginPath();
    context.moveTo(p.x, p.y);
    context.lineTo(p.closest[i].x, p.closest[i].y);
    context.strokeStyle = "rgba(156,217,249," + p.active + ")";
    context.stroke();
  }
};

const getDistance = (p1, p2) =>
  Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);

const Circle = radius => ({
  radius,
  color: CIRCLE_COLOR,
  active: 0
});

const draw = point => {
  if (!point.circle || !point.circle.active) {
    return;
  }
  context.beginPath();
  context.arc(point.x, point.y, point.circle.radius, 0, 2 * Math.PI, false);
  context.fillStyle = "rgba(156,217,249," + point.circle.active + ")";
  context.fill();
};

const setDimentions = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  target = { x: width / 2, y: height / 2 };
  initializePoints();
};

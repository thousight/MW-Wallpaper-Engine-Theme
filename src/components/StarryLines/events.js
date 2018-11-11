import { TweenLite, Circ } from "gsap";
// import Circle from "./Circle";

let points = [];
let context = null;
let animateHeader = true;
let height = 0;
let width = 0;
let target = {
  x: width / 2,
  y: height / 2
};
let resizeRef = null
let point = null


// Basically constructor
export const attachListeners = canvas => {
  setDimentions()
  
  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext("2d");

  initializePoints();

  initializeAnimation();

  resizeRef = resize(canvas)

  if (!("ontouchstart" in window)) {
    window.addEventListener("mousemove", mouseMove);
  }
  window.addEventListener("scroll", scrollCheck);
  window.addEventListener("resize", resizeRef);
  window.addEventListener("mouseout", mouseLeave);
  window.addEventListener("mouseover", mouseEnter);
};

// Basically destructor
export const detachListeners = () => {
  window.removeEventListener("mousemove", mouseMove);
  window.removeEventListener("scroll", scrollCheck);
  window.removeEventListener("resize", resizeRef);
  window.removeEventListener("mouseout", mouseLeave);
  window.removeEventListener("mouseover", mouseEnter);
};

const initializePoints = () => {
  let i,
    j,
    k,
    x,
    y,
    px,
    py,
    placed,
    closest = [];
  points = [];

  for (x = 0; x < width; x = x + width / 20) {
    for (y = 0; y < height; y = y + height / 20) {
      px = x + (Math.random() * width) / 20;
      py = y + (Math.random() * height) / 20;
      points.push({ x: px, originX: px, y: py, originY: py });
    }
  }

  // for each point find the 5 closest points
  for (i = 0; i < points.length; i++) {
    closest = []
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
          if (!placed) {
            if (getDistance(px, py) < getDistance(px, closest[k])) {
              closest[k] = py;
              placed = true;
            }
          }
        }
      }
    }
    px.closest = closest;
  }

  // assign a circle to each point
  for (let i in points) {
    points[i].circle = Circle(
      points[i],
      2 + Math.random() * 2,
      "rgba(255,255,255,0.3)",
      context
    );
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
      point = points[i]
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
      point.circle.draw(point);
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

const scrollCheck = () => {
  animateHeader = document.body.scrollTop <= height;
};

const resize = canvas => () => {
  setDimentions()

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

const shiftPoint = p => {
  TweenLite.to(p, 1 + 1 * Math.random(), {
    x: p.originX - 50 + Math.random() * 100,
    y: p.originY - 50 + Math.random() * 100,
    ease: Circ.easeInOut,
    onComplete: () => shiftPoint(p)
  });
};

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

const Circle = (pos, radius, color) => ({
  pos,
  radius,
  color,
  active: 0,
  draw,
})

const draw = point => {
  if (!point.active) {
    return;
  }
  context.beginPath();
  context.arc(point.x, point.y, point.radius, 0, 2 * Math.PI, false);
  context.fillStyle = "rgba(156,217,249," + point.active + ")";
  context.fill();
};

const setDimentions = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  target = { x: width / 2, y: height / 2 };
  initializePoints();
}
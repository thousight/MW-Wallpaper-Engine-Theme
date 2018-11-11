import { TweenLite, Circ } from "gsap";

import Circle from './Circle'

export const getDistance = (point1, point2) =>
  Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2);

export const shiftPoint = point =>
  TweenLite.to(point, 1 + 1 * Math.random(), {
    x: point.originX - 50 + Math.random() * 100,
    y: point.originY - 50 + Math.random() * 100,
    ease: Circ.easeInOut,
    onComplete: () => shiftPoint(point)
  });

export const getTarget = e => {
  let x = 0;
  let y = 0;

  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else if (e.clientX || e.clientY) {
    x =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
      y =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { x, y }
}

export const getLineColor = transparency => `rgba(156, 217, 249, ${transparency})`

export const initializePoints = (width, height) => {
  let i = 0;
  let j = 0;
  let k = 0;
  let px;
  let py;
  let placed;
  let closest = [];
  let points = [];

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
          if (!(placed || closest[k])) {
              closest[k] = py;
              placed = true;
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

  return points;
};

//1 px = 1 cm

let physicsObjects = [];
let funny = -1;
let pause = false;
let refreshInterval = 10;
let previousTime = 0;
let currentTime = 0;
let interval = 0;
let radius = 30;
let elastic = false;
let elasticity = 0.75;
let friction = true;
let coefficient = 0.2;
let gravity = 9.8;
let ceiling = true;
let timer = 0;
let maxEnergy = 0;
let energyLost = 0;

let lined = true;

const updateVariables = (index) => {
  /*
    x: cm
    y: cm
    xSpd: m/s
    ySpd: m/s
    mass: kg
    force: N
    angle: degrees
    */
  let obj = physicsObjects[index];
  let rads = (obj.angle * Math.PI) / 180;
  let xForce = -1;
  let yForce = -1;
  switch (obj.angle) {
    case "0":
      xForce = obj.force;
      yForce = 0;
      break;
    case "90":
      xForce = 0;
      yForce = obj.force;
      break;
    case "180":
      xForce = -obj.force;
      yForce = 0;
      break;
    case "270":
      xForce = 0;
      yForce = -obj.force;
      break;
    case "360":
      xForce = obj.force;
      yForce = 0;
      break;
    default:
      xForce = obj.force * Math.cos(rads);
      yForce = obj.force * Math.sin(rads);
      break;
  }

  let normal = obj.mass * gravity - yForce;

  let xAcc = xForce / obj.mass;
  let yAcc = yForce / obj.mass;

  if (obj.time <= 0) {
    obj.force = 0;
    obj.time = 0;
    obj.angle = 0;
  } else {
    obj.time -= interval / 1000;
  }

  //adjust x
  //not within bounds, collided with wall
  if (!(obj.x >= 0 && obj.x <= window.innerWidth - radius)) {
    if (!elastic) {
      obj.xSpd *= elasticity;
    }
    obj.xSpd *= -1;
    if (obj.x <= 0) {
      obj.x = 2;
    } else {
      obj.x = window.innerWidth - radius - 2;
    }
  }
  //friction
  if (friction && obj.y <= 0 && Math.abs(obj.xSpd) > 0) {
    let multiplier = 1;
    if (obj.xSpd < 0) multiplier = -1;
    obj.xSpd =
      Math.abs(obj.xSpd) -
      ((coefficient * normal) / obj.mass) * 0.001 * interval;
    if (obj.xSpd < 0) {
      obj.xSpd = 0;
    }
    obj.xSpd *= multiplier;
  }
  if (obj.x >= 0 && obj.x <= window.innerWidth - radius) {
    // vt + 1/2 a t^2
    obj.x +=
      (obj.xSpd * 100 /*m to cm*/ * interval) / 1000 /* ms to s */ +
      (1 / 2) * xAcc * Math.pow(interval / 1000, 2);
    obj.xSpd += (xAcc * interval) / 1000;
  }

  //adjust y
  obj.y +=
    (obj.ySpd * 100 /*m to cm*/ * interval) / 1000 /* ms to s */ +
    (1 / 2) * yAcc * Math.pow(interval / 1000, 2);
  if (obj.y > 0 || yAcc - gravity > 0) {
    obj.ySpd += ((yAcc - gravity) * interval) / 1000;
  }
  //collide with floor
  if (obj.y < 0 || (obj.y > window.innerHeight - radius && ceiling)) {
    if (!elastic) {
      obj.ySpd *= elasticity;
      if (obj.y < 0) {
        obj.y = 0;
      } else if (ceiling) {
        obj.y = window.innerHeight - radius;
      }
    }
    obj.ySpd *= -1;
    if (Math.abs(obj.ySpd) < 0.5) {
      obj.ySpd = 0;
    }
  }
};

const checkCollision = () => {
  //collision with other object
  for (let i = 0; i < physicsObjects.length; i++) {
    for (let j = i + 1; j < physicsObjects.length; j++) {
      if (i != j) {
        let obj = physicsObjects[i];
        let test = physicsObjects[j];
        //collision
        if (
          obj.y + radius > test.y &&
          obj.y < test.y + radius &&
          obj.x + radius > test.x &&
          obj.x < test.x + radius
        ) {
          //get angle
          let centerX = obj.x + 15;
          let centerY = obj.y + 15;
          let funnyX = test.x + 15;
          let funnyY = test.y + 15;
          let angle = Math.atan2(centerY - funnyY, centerX - funnyX);
          angle *= 180 / Math.PI;

          if (angle < 0) angle += 360;
          console.log(angle);

          if (
            (angle >= 0 && angle <= 45) ||
            (angle >= 135 && angle <= 225) ||
            (angle >= 315 && angle <= 360)
          ) {
            console.log("from left/right");
            //edit x stuff

            if (obj.x + radius > test.x && obj.x < test.x) {
              obj.x = test.x - radius - 1;
              if (obj.x < 0) {
                obj.x = 0;
                test.x = radius;
              }
            }
            if (obj.x < test.x + radius && obj.x + radius > test.x) {
              obj.x = test.x + radius + 1;
              if (obj.x > window.innerWidth) {
                obj.x = window.innerWidth - radius;
                test.x = obj.x - radius;
              }
            }

            if (obj.xSpd == 0 && test.xSpd == 0) {
              if ((angle >= 0 && angle <= 45) || (angle >= 315 && angle <= 360)){
                obj.xSpd = -1;
                test.xSpd = 1;
              }else{
                obj.xSpd = 1;
                test.xSpd = -1;
              }
            } else {
              let px = obj.xSpd * obj.mass + test.xSpd * test.mass;

              if (Math.abs(obj.xSpd) > Math.abs(test.xSpd)) {
                if (!elastic) {
                  obj.xSpd *= elasticity;
                  test.xSpd = (px - obj.xSpd * obj.mass) / test.mass;
                }
                else {
                  obj.xSpd *= -1;
                }
              } else if (Math.abs(obj.xSpd) < Math.abs(test.xSpd)) {
                if (!elastic) {
                  test.xSpd *= elasticity;
                  obj.xSpd = (px - test.xSpd * test.mass) / obj.mass;
                }
                else {
                  test.xSpd *= -1;
                }
              } else {
                test.xSpd = 0;
                obj.xSpd = 0;
              }
            }
          } else {
            console.log("from top/bottom");
            //edit y stuff

            if (obj.y + radius > test.y && obj.y < test.y) {
              if (Math.abs(test.y - obj.y) >= 5) {
                obj.y = test.y - radius - 1;
                if (obj.y < 0) {
                  obj.y = 0;
                  test.y = radius + 1;
                }
              }
            }
            if (obj.y < test.y + radius && obj.y + radius > test.y) {
              obj.y = test.y + radius + 1;
            }

            let py = obj.ySpd * obj.mass + test.ySpd * test.mass;

            if (Math.abs(obj.ySpd) > Math.abs(test.ySpd)) {
              if (!elastic) obj.ySpd *= elasticity;
              else obj.xSpd *= -1;
              test.ySpd = (py - obj.ySpd * obj.mass) / test.mass;
            } else if (Math.abs(obj.ySpd) < Math.abs(test.ySpd)) {
              if (!elastic) test.ySpd *= elasticity;
              else test.xSpd *= -1;
              obj.ySpd = (py - test.ySpd * test.mass) / obj.mass;
            } else {
              test.ySpd = 0;
              obj.ySpd = 0;
            }
          }
        }
      }
    }
  }
};

const loop = async () => {
  previousTime = performance.now();
  while (true) {
    if (!pause) {
      currentTime = performance.now();
      interval = currentTime - previousTime;
      let energy = 0;

      for (let i = 0; i < physicsObjects.length; i++) {
        updateVariables(i);
      }

      await checkCollision();

      for (obj in physicsObjects) {
        obj = physicsObjects[obj];
        obj.element.style.left = obj.x + "px";
        obj.element.style.bottom = obj.y + "px";
        let properties = obj.element.firstElementChild.children;
        let update = [
          Math.round(obj.xSpd * 100) / 100,
          Math.round(obj.ySpd * 100) / 100,
          Math.round(obj.x) / 100,
          Math.round(obj.y) / 100,
        ];

        update[0] += "m/s";
        update[1] += "m/s";
        update[2] += "m";
        update[3] += "m";

        for (let i = 0; i < properties.length; i++) {
          properties[i].lastElementChild.innerHTML = update[i];
        }

        energy += Math.abs((obj.y / 100) * gravity * obj.mass);
        energy += Math.abs(
          (obj.mass * (Math.pow(obj.xSpd, 2) + Math.pow(obj.ySpd, 2))) / 2
        );

        if (document.getElementById(obj.x + 15 + "," + (obj.y + 15)) == null) {
          let temp = document.createElement("div");
          temp.className = "dot " + obj.element.id;
          temp.style.left = obj.x + 15 + "px";
          temp.style.bottom = obj.y + 15 + "px";
          temp.id = obj.x + 15 + "," + (obj.y + 15);
          document.getElementById("dots").appendChild(temp);
        }

        let dots = document.getElementsByClassName(obj.element.id);
        if (dots.length > 1) {
          let point1X = dots[dots.length - 2].style.left;
          point1X = parseInt(point1X.substring(0, point1X.length - 2));

          let point2X = dots[dots.length - 1].style.left;
          point2X = parseInt(point2X.substring(0, point2X.length - 2));

          let point1Y = dots[dots.length - 2].style.bottom;
          point1Y = parseInt(point1Y.substring(0, point1Y.length - 2));

          let point2Y = dots[dots.length - 1].style.bottom;
          point2Y = parseInt(point2Y.substring(0, point2Y.length - 2));

          if (
            document.getElementById(
              point1X + "," + point2X + "|" + point1Y + "," + point2Y
            ) == null
          ) {
            let line = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );

            let height = Math.abs(point1Y - point2Y);
            let width = Math.abs(point2X - point1X);
            if (height == 0) height++;
            if (width == 0) width++;
            line.setAttribute("width", width);
            line.setAttribute("height", height);
            line.style.left = point1X + "px";
            line.style.bottom = point1Y + "px";
            line.classList.add("line");
            if (
              (obj.xSpd > 0 && obj.ySpd > 0) ||
              (obj.xSpd < 0 && obj.ySpd < 0)
            ) {
              line.style.transform = "scaleX(-1)";
            }
            let inner = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "line"
            );
            inner.setAttribute("x1", 0);
            inner.setAttribute("y1", 0);
            inner.setAttribute("x2", Math.abs(point2X - point1X));
            inner.setAttribute("y2", Math.abs(point1Y - point2Y));
            inner.setAttribute("stroke", "black");
            line.appendChild(inner);
            document.getElementById("lines").appendChild(line);
            if (document.getElementById("lines").childElementCount > 25) {
              document
                .getElementById("lines")
                .removeChild(document.getElementsByClassName("line")[0]);
            }
          }
        }
      }

      if (document.getElementById("dots").childElementCount > 25) {
        document
          .getElementById("dots")
          .removeChild(document.getElementsByClassName("dot")[0]);
      }

      energyLost = maxEnergy - energy;

      document.getElementById("timer").innerHTML =
        Math.floor(timer * 100) / 100 + "s";
      document.getElementById("total").innerHTML =
        Math.floor(maxEnergy * 100) / 100 + "J";
      document.getElementById("lost").innerHTML =
        Math.floor(energyLost * 100) / 100 + "J";
      document.getElementById("current").innerHTML =
        Math.floor(energy * 100) / 100 + "J";
      previousTime = currentTime;
      await new Promise((r) => setTimeout(r, refreshInterval));
      timer += interval / 1000;
    } else {
      await new Promise((r) => setTimeout(r, 1000));
      previousTime = performance.now();
    }
  }
};

const stop = () => {
  if (pause) {
    document.getElementById("status").innerText = "RUNNING";
    pause = false;
  } else {
    pause = true;
    document.getElementById("status").innerText = "PAUSED";
  }
};

const edit = (index) => {
  if (!pause) stop();
  funny = index;
  let obj = physicsObjects[index];
  document.getElementById("time").value = obj.time;
  document.getElementById("force").value = obj.force;
  document.getElementById("angle").value = obj.angle;
  document.getElementById("mass").value = obj.mass;
  document.getElementById("edit").style.visibility = "visible";
};

const submit = () => {
  let obj = physicsObjects[funny];
  document.getElementById("edit").style.visibility = "hidden";
  obj.time = document.getElementById("time").value;
  obj.force = document.getElementById("force").value;
  maxEnergy += parseInt(obj.force);
  obj.angle = document.getElementById("angle").value;
  obj.mass = document.getElementById("mass").value;
  obj.element.lastElementChild.innerHTML = obj.mass + "kg";
};

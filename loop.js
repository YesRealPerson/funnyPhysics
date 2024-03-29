let blockLocation = 0;
const defaultRadius = 50 / (1 + (50 * Math.pow(Math.E, (-0.15 * 5)))) + 29.02

const createObject = async () => {
  let id = "block" + blockLocation;
  let color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
  let obj = document.createElement("div");
  let labels = document.createElement("div");
  labels.innerHTML = "<div><span>V<sub>x</sub>: </span><span></span></div><div><span>Y<sub>y</sub>: </span><span></span></div><div><span>X: </span><span></span></div><div><span>Y: </span><span></span></div>";
  let weight = document.createElement("div");
  weight.innerText = "5kg";
  obj.appendChild(labels);
  obj.appendChild(weight);
  obj.id = id;
  obj.setAttribute("onclick",`edit(${blockLocation})`);
  obj.className = "physics block"
  obj.style = `left: 0px; bottom 0px; background-color: ${color};`;
  document.body.appendChild(obj);

  physicsObjects.push({
    element: document.getElementById(id),
    x: blockLocation * defaultRadius,
    xSpd: 0,
    y: 0,
    ySpd: 0,
    mass: 5,
    force: 0,
    angle: 0,
    time: 0,
    color: color,
    radius: defaultRadius,
    enabled: true
  });

  blockLocation++;
}

const randomizeValues = async() => {
  if(!pause){
    stop()
  }
  for(let i = 0; i < physicsObjects.length; i++){
    let block = physicsObjects[i];
    block.force = Math.floor(Math.random()*5000+1);
    block.angle = Math.floor(Math.random()*180);
  }
  if(pause){
    stop()
  }
}

const loop = async () => {
  previousTime = performance.now();
  while (true) {
    if (!pause) {
      currentTime = performance.now();
      if (realtime) {
        interval = currentTime - previousTime;
      }

      // let energy = 0;

      for (let i = 0; i < physicsObjects.length; i++) {
        updateVariables(i);
      }

      await checkCollision();

      for (obj in physicsObjects) {
        obj = physicsObjects[obj];
        if (obj.enabled) {
          obj.element.style.left = obj.x + "px";
          obj.element.style.bottom = obj.y + "px";
          let properties = obj.element.firstElementChild.children;
          let update = []
          if (cm) {
            update = [
              Math.round(obj.xSpd * 100) / 100,
              Math.round(obj.ySpd * 100) / 100,
              Math.round(obj.x) / 100,
              Math.round(obj.y) / 100,
            ];
          } else {
            {
              update = [
                Math.round(obj.xSpd * 100) / 100,
                Math.round(obj.ySpd * 100) / 100,
                Math.round(obj.x) / 10,
                Math.round(obj.y) / 10,
              ];
            }
          }

          update[0] += "m/s";
          update[1] += "m/s";
          update[2] += "m";
          update[3] += "m";

          for (let i = 0; i < properties.length; i++) {
            properties[i].lastElementChild.innerHTML = update[i];
          }

          // energy += Math.abs((obj.y / 100) * gravity * obj.mass);
          // energy += Math.abs(
          //   (obj.mass * (Math.pow(obj.xSpd, 2) + Math.pow(obj.ySpd, 2))) / 2
          // );

          // if (document.getElementById(obj.x + 15 + "," + (obj.y + 15)) == null) {
          //   let temp = document.createElement("div");
          //   temp.className = "dot " + obj.element.id;
          //   temp.style.left = obj.x + 15 + "px";
          //   temp.style.bottom = obj.y + 15 + "px";
          //   temp.id = obj.x + 15 + "," + (obj.y + 15);
          //   document.getElementById("dots").appendChild(temp);
          // }

          // let dots = document.getElementsByClassName(obj.element.id);
          // if (dots.length > 1) {
          //   let point1X = dots[dots.length - 2].style.left;
          //   point1X = parseInt(point1X.substring(0, point1X.length - 2));

          //   let point2X = dots[dots.length - 1].style.left;
          //   point2X = parseInt(point2X.substring(0, point2X.length - 2));

          //   let point1Y = dots[dots.length - 2].style.bottom;
          //   point1Y = parseInt(point1Y.substring(0, point1Y.length - 2));

          //   let point2Y = dots[dots.length - 1].style.bottom;
          //   point2Y = parseInt(point2Y.substring(0, point2Y.length - 2));

          //   if (
          //     document.getElementById(
          //       point1X + "," + point2X + "|" + point1Y + "," + point2Y
          //     ) == null
          //   ) {
          //     let line = document.createElementNS(
          //       "http://www.w3.org/2000/svg",
          //       "svg"
          //     );

          //     let height = Math.abs(point1Y - point2Y);
          //     let width = Math.abs(point2X - point1X);
          //     if (height == 0) height++;
          //     if (width == 0) width++;
          //     line.setAttribute("width", width);
          //     line.setAttribute("height", height);
          //     line.setAttribute("stroke", "black");
          //     line.style.left = point1X + "px";
          //     line.style.bottom = point1Y + "px";
          //     line.classList.add("line");
          //     if (
          //       (obj.xSpd > 0 && obj.ySpd > 0) ||
          //       (obj.xSpd < 0 && obj.ySpd < 0)
          //     ) {
          //       line.style.transform = "scaleX(-1)";
          //     }
          //     let inner = document.createElementNS(
          //       "http://www.w3.org/2000/svg",
          //       "line"
          //     );
          //     inner.setAttribute("x1", 0);
          //     inner.setAttribute("y1", 0);
          //     inner.setAttribute("x2", Math.abs(point2X - point1X));
          //     inner.setAttribute("y2", Math.abs(point1Y - point2Y));
          //     // inner.setAttribute("stroke", "black");
          //     line.appendChild(inner);
          //     document.getElementById("lines").appendChild(line);
          //     if (document.getElementById("lines").childElementCount > 25 && !infiniteTrails) {
          //       document
          //         .getElementById("lines")
          //         .removeChild(document.getElementsByClassName("line")[0]);
          //     }
          //     if (document.getElementById("dots").childElementCount > 25) {
          //       document
          //         .getElementById("dots")
          //         .removeChild(document.getElementsByClassName("dot")[0]);
          //     }
            // }
          // }
        }
      }

      // energyLost = maxEnergy - energy;

      document.getElementById("timer").innerHTML =
        Math.floor(timer * 100) / 100 + "s";
      // document.getElementById("total").innerHTML =
      //   Math.floor(maxEnergy * 100) / 100 + "J";
      // document.getElementById("lost").innerHTML =
      //   Math.floor(energyLost * 100) / 100 + "J";
      // document.getElementById("current").innerHTML =
      //   Math.floor(energy * 100) / 100 + "J";
      previousTime = currentTime;
      if (cm) {
        document.getElementById("windowWidth").innerHTML = window.innerWidth + " ";
        document.getElementById("windowHeight").innerHTML = window.innerHeight + " ";
      } else {
        document.getElementById("windowWidth").innerHTML = window.innerWidth / 10 + " ";
        document.getElementById("windowHeight").innerHTML = window.innerHeight / 10 + " ";
      }
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
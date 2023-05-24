const loop = async () => {
    previousTime = performance.now();
    while (true) {
      if (!pause) {
        currentTime = performance.now();
        if(realtime){
            interval = currentTime - previousTime;
        }

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
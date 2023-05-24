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
    if (!(obj.x >= 0 && obj.x <= window.innerWidth - obj.radius)) {
      if (!elastic) {
        obj.xSpd *= elasticity;
      }
      obj.xSpd *= -1;
      if (obj.x <= 0) {
        obj.x = 2;
      } else {
        obj.x = window.innerWidth - obj.radius - 2;
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
    if (obj.x >= 0 && obj.x <= window.innerWidth - obj.radius) {
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
    if (obj.y < 0 || (obj.y > window.innerHeight - obj.radius && ceiling)) {
      if (!elastic) {
        obj.ySpd *= elasticity;
        if (obj.y < 0) {
          obj.y = 0;
        } else if (ceiling) {
          obj.y = window.innerHeight - obj.radius;
        }
      }
      obj.ySpd *= -1;
      if (Math.abs(obj.ySpd) < 0.5) {
        obj.ySpd = 0;
      }
    }
  };
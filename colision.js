const checkCollision = () => {
    //collision with other object
    for (let i = 0; i < physicsObjects.length; i++) {
        for (let j = i + 1; j < physicsObjects.length; j++) {
            let obj = physicsObjects[i];
            let test = physicsObjects[j];
            if (i != j && obj.enabled && test.enabled) {
                //collision
                if (
                    obj.y + obj.radius > test.y &&
                    obj.y < test.y + test.radius &&
                    obj.x + obj.radius > test.x &&
                    obj.x < test.x + test.radius
                ) {
                    //console.log("colision");
                    //get angle
                    let centerX = obj.x + 15;
                    let centerY = obj.y + 15;
                    let funnyX = test.x + 15;
                    let funnyY = test.y + 15;
                    let angle = Math.atan2(centerY - funnyY, centerX - funnyX);
                    angle *= 180 / Math.PI;

                    while (angle < 0) {
                        angle += 360;
                    }
                    while (angle > 360) {
                        angle -= 360;
                    }

                    if (
                        (angle >= 0 && angle <= 45) ||
                        (angle >= 135 && angle <= 225) ||
                        (angle >= 315 && angle <= 360)
                    ) {
                        //console.log("from left/right");
                        //edit x stuff

                        //total x momentum
                        let px = test.xSpd * test.mass + obj.mass * obj.xSpd;

                        //flip velocities
                        // //console.log(px);
                        // //console.log(Math.abs(test.xSpd) < Math.abs(obj.xSpd));

                        //velocities must not be equal to each other, otherwise they would never collide, if they are they must be equal and opposite, 
                        if (px == 0) {
                            //console.log("0");
                            obj.xSpd = 0;
                            test.xSpd = 0;
                        }
                        //if test collided with obj
                        else if (Math.abs(test.xSpd) > Math.abs(obj.xSpd)) {
                            //console.log("1");
                            test.xSpd *= (1-elasticity);
                            obj.xSpd = (px - test.xSpd * test.mass) / obj.mass;
                        }
                        //if obj collided with test
                        else if (Math.abs(test.xSpd) < Math.abs(obj.xSpd)) {
                            //console.log("2");
                            obj.xSpd *= (1-elasticity);
                            test.xSpd = (px - obj.xSpd * obj.mass) / test.mass;
                        }
                        //velocities are the same but momentum total is not 0
                        //if test collided with obj
                        else if (Math.abs(test.xSpd * test.mass) > Math.abs(obj.xSpd * obj.mass)) {
                            //console.log("3");
                            test.xSpd *= (1-elasticity);
                            obj.xSpd = (px - test.xSpd * test.mass) / obj.mass;
                        }
                        //if obj collided with test
                        else if (Math.abs(test.xSpd * test.mass) < Math.abs(obj.xSpd * obj.mass)) {
                            //console.log("4");
                            obj.xSpd *= (1-elasticity);
                            test.xSpd = (px - obj.xSpd * obj.mass) / test.mass;
                        }else{
                            //console.log("ERROR! NO SUITABLE COLISION FOUND!");
                        }
                        // //console.log(test.xSpd * test.mass + obj.mass * obj.xSpd);

                        //make sure they are no longer coliding
                        if(obj.x + obj.radius > test.x && obj.x < test.x){
                            //console.log(obj.element.id + "  "+ test.element.id);
                            obj.x = test.x-obj.radius;
                            if(obj.x < 0){
                                //console.log("OUT OF BOUNDS");
                                obj.x = 0;
                                test.x = obj.radius;
                            }
                        }
                        if(obj.x < test.x + test.radius && obj.x > test.x){
                            //console.log(obj.element.id + "  "+ test.element.id);
                            obj.x = test.x+test.radius;
                            if(obj.x + obj.radius > window.innerWidth){
                                //console.log("OUT OF BOUNDS");
                                obj.x = window.innerWidth - obj.radius;
                                test.x = obj.x - test.radius;
                            }
                        }
                    } else {
                        //console.log("from top/bottom");
                        //edit y stuff

                        //total y momentum
                        let py = test.ySpd * test.mass + obj.mass * obj.ySpd;

                        //flip velocities
                        // //console.log(py);
                        // //console.log(Math.abs(test.ySpd) < Math.abs(obj.ySpd));

                        //velocities must not be equal to each other, otherwise they would never collide, if they are they must be equal and opposite, 
                        if (py == 0) {
                            //console.log("0");
                            obj.ySpd = 0;
                            test.ySpd = 0;
                        }
                        //if test collided with obj
                        else if (Math.abs(test.ySpd) > Math.abs(obj.ySpd)) {
                            //console.log("1");
                            test.ySpd *= (1-elasticity);
                            obj.ySpd = (py - test.ySpd * test.mass) / obj.mass;
                        }
                        //if obj collided with test
                        else if (Math.abs(test.ySpd) < Math.abs(obj.ySpd)) {
                            //console.log("2");
                            obj.ySpd *= (1-elasticity);
                            test.ySpd = (py - obj.ySpd * obj.mass) / test.mass;
                        }
                        //velocities are the same but momentum total is not 0
                        //if test collided with obj
                        else if (Math.abs(test.ySpd * test.mass) > Math.abs(obj.ySpd * obj.mass)) {
                            //console.log("3");
                            test.ySpd *= (1-elasticity);
                            obj.ySpd = (py - test.ySpd * test.mass) / obj.mass;
                        }
                        //if obj collided with test
                        else if (Math.abs(test.ySpd * test.mass) < Math.abs(obj.ySpd * obj.mass)) {
                            //console.log("4");
                            obj.ySpd *= (1-elasticity);
                            test.ySpd = (py - obj.ySpd * obj.mass) / test.mass;
                        }else{
                            //console.log("ERROR! NO SUITABLE COLISION FOUND!");
                        }
                        // //console.log(test.ySpd * test.mass + obj.mass * obj.ySpd);

                        //make sure they are no longer coliding
                        if(obj.y + obj.radius > test.y && obj.y < test.y){
                            //console.log(obj.element.id + "  "+ test.element.id);
                            obj.y = test.y-obj.radius;
                            if(obj.y < 0){
                                //console.log("OUT OF BOUNDS");
                                obj.y = 0;
                                test.y = obj.radius;
                            }
                        }
                        if(obj.y < test.y + test.radius && obj.y > test.y){
                            //console.log(obj.element.id + "  "+ test.element.id);
                            obj.y = test.y+test.radius;
                            if(obj.y + obj.radius > window.innerWidth){
                                //console.log("OUT OF BOUNDS");
                                obj.y = window.innerWidth - obj.radius;
                                test.y = obj.y - test.radius;
                            }
                        }
                    }
                }
            }
        }
    }
}
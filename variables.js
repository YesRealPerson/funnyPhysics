let physicsObjects = [];
let funny = -1;
let pause = false;
let refreshInterval = 1;
let previousTime = 0;
let currentTime = 0;
let realtime = false;
let interval = 1;
let elastic = false;
let elasticity = 0.75;
let friction = true;
let coefficient = 0.2;
let gravity = 9.8;
let ceiling = true;
let timer = 0;
let maxEnergy = 0;
let energyLost = 0;
let realStart = performance.now();

let lined = true;

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
    obj.radius = 50 / (1 + (50 * Math.pow(Math.E, (-0.15 * parseInt(obj.mass))))) + 29.02;
    obj.element.style.width = obj.radius + "px";
    obj.element.style.height = obj.radius + "px";
    obj.element.lastElementChild.innerHTML = obj.mass + "kg";
};
const reset = () => {
    timer = 0;
    maxEnergy = 0;
    energyLost = 0;
}

const settings = () => {
    stop();
    settingPanel.style.visibility = "visible";
    let f = document.getElementById("FRICTION");
    let r = document.getElementById("REALTIME");
    let c = document.getElementById("CEILING");
    let ce = document.getElementById("COEFFICIENT");
    let g = document.getElementById("GRAVITY");
    let i = document.getElementById("INTERVAL");
    if(friction){
        f.checked = true;
    }
    if(realtime){
        r.checked = true;
    }
    if(ceiling){
        c.checked = true;
    }
    ce.value = coefficient;
    g.value = gravity;
    i.value = interval;
}

const settingSubmit = () => {
    stop();
    settingPanel.style.visibility = "hidden";
    let f = document.getElementById("FRICTION");
    let r = document.getElementById("REALTIME");
    let c = document.getElementById("CEILING");
    let ce = document.getElementById("COEFFICIENT");
    let g = document.getElementById("GRAVITY");
    let i = document.getElementById("INTERVAL");
    friction = f.checked;
    realtime = r.checked;
    ceiling = c.checked;
    coefficient = ce.value;
    gravity = g.value;
    interval = i.value;
}
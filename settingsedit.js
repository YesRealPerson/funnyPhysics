const reset = () => {
    timer = 0;
    maxEnergy = 0;
    energyLost = 0;
}

const settings = () => {
    if(!pause){
        stop();
    }
    settingPanel.style.visibility = "visible";
    let f = document.getElementById("FRICTION");
    let r = document.getElementById("REALTIME");
    let c = document.getElementById("CEILING");
    let inf = document.getElementById("INFTRAILS");
    let cmE = document.getElementById("CM");
    let ce = document.getElementById("COEFFICIENT");
    let g = document.getElementById("GRAVITY");
    let i = document.getElementById("INTERVAL");
    // let e = document.getElementById("ELASTICITY");
    if(friction){
        f.checked = true;
    }
    if(realtime){
        r.checked = true;
    }
    if(ceiling){
        c.checked = true;
    }
    if(infiniteTrails){
        inf.checked = true;
    }
    if(cm){
        cmE.checked = true;
    }
    ce.value = coefficient;
    g.value = gravity;
    i.value = interval;
    // e.value = elasticity;
}

const settingSubmit = () => {
    settingPanel.style.visibility = "hidden";
    let f = document.getElementById("FRICTION");
    let r = document.getElementById("REALTIME");
    let c = document.getElementById("CEILING");
    let inf = document.getElementById("INFTRAILS");
    let cmE = document.getElementById("CM");
    let ce = document.getElementById("COEFFICIENT");
    let g = document.getElementById("GRAVITY");
    let i = document.getElementById("INTERVAL");
    // let e = document.getElementById("ELASTICITY");
    friction = f.checked;
    realtime = r.checked;
    ceiling = c.checked;
    coefficient = ce.value;
    gravity = g.value;
    interval = i.value;
    cm = cmE.checked;
    infiniteTrails = inf.checked;
    let units = document.getElementsByClassName("unit")
    if(cm){
        document.getElementById("key").innerHTML = "(EACH PIXEL IS 1 CM)";
        document.getElementById("size").innerHTML = "20 ";
        for(let i = 0; i < units.length; i++){
            units[i].innerHTML = "CENTIMETERS";
        }
    }else{
        document.getElementById("key").innerHTML = "(EVERY 10 PIXELS IS 1 M)";
        document.getElementById("size").innerHTML = " 2 ";
        for(let i = 0; i < units.length; i++){
            units[i].innerHTML = "METERS";
        }
    }
    stop();
    // elasticity = e.value;
}
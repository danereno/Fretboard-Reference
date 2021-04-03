"use strict";
const chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const noteColors = [
    "#ffed6f", 
    "#ccebc5", 
    "#bc80bd", 
    "#d9d9d9", 
    "#fccde5", 
    "#80b1d3", 
    "#fdb462", 
    "#b3de69", 
    "#fb8072", 
    "#bebada", 
    "#ffffb3", 
    "#8dd3c7"
];
const defaultTuning = ["E4", "B3", "G3", "D3", "A2", "E2"];
const markedFrets = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
let mode = "";

let noteTable = [];
for(let i = 1; i <= 7; i++){
    for(const tone of chromaticScale){
        noteTable.push(tone + String(i));
    }
}

let changeFrets = function(){
    let numFrets = Number(this.id.slice(0,2));
    let fretBoard = document.getElementById("fretboard");
    let siblings = this.parentNode.children;

    for(let i = 0; i < siblings.length; i++){
        siblings[i].classList.remove("active-button");
    }
    this.classList.add("active-button");

    while(fretBoard.firstChild){
        fretBoard.removeChild(fretBoard.firstChild);
    }

    // Generate table
    for(let i = 1; i <= 6; i++){
        let string = fretBoard.insertRow();
        for(let j = 0; j <= numFrets; j++){
            string.insertCell();
        }
    }
    
    // Assign note names
    for(let i = 0, string; string = fretBoard.rows[i]; i++){
        for(let j = 0, fret; fret = string.cells[j]; j++){
            if(j == 0){
                fret.innerHTML = "<p class=\"fret open\">" + defaultTuning[i] + "</p><div class=\"blank\"></div>";
            }
            else{
                let ix = noteTable.indexOf(defaultTuning[i]);
                fret.innerHTML = "<p class=\"fret\">" + noteTable[ix+j] + "</p><div class=\"blank\"></div>";
            }
        }
    }
    
    // Add "fret dots"
    let footer = fretBoard.createTFoot();
    let row = footer.insertRow();
    for(let i = 0; i <= numFrets; i++){
        let cell = row.insertCell();
        let str = "";
        if(i == 0){
            cell.innerHTML = "<p class=\"fret-number\">open</p>";
        }
        else if(markedFrets.includes(i)){
            cell.innerHTML = "<p class=\"fret-number\">" + i + "</p>";
        }
    }

    // Color notes
    let frets = document.getElementsByClassName("fret");
    for(let i = 0; i < frets.length; i++){
        let note = frets[i].innerHTML.slice(0,-1);
        for(let j = 0; j < chromaticScale.length; j++){
            frets[i].style.backgroundColor = noteColors[chromaticScale.indexOf(note)];
        }
    }

    changeMode();
}

let changeMode = function(){
    let fretList = document.querySelectorAll(".fret");

    for(let i = 0; i < fretList.length; i++){
        fretList[i].onmouseover = null;
        fretList[i].onmouseout = null;
        fretList[i].onclick = null;
        fretList[i].style.opacity = "0";
    }

    for(let i = 0; i < fretList.length; i++){
        let arr = [];
        switch(mode){
            case "all":
                fretList[i].style.opacity = "1";
                break;
            case "pitch":
                for(let j = 0; j < fretList.length; j++){
                    if(fretList[i].innerHTML == fretList[j].innerHTML){
                        arr.push(fretList[i], fretList[j]);
                    }
                }
                arr.classHighlight();
                break;
            case "letter":
                for(let j = 0; j < fretList.length; j++){
                    if(fretList[i].innerHTML.slice(0,-1) == fretList[j].innerHTML.slice(0,-1)){
                        arr.push(fretList[i], fretList[j]);
                    }
                }
                arr.classHighlight();
                break;
            case "octave":
                for(let j = 0; j < fretList.length; j++){
                    if(fretList[i].innerHTML.slice(-1) == fretList[j].innerHTML.slice(-1)){
                        arr.push(fretList[i], fretList[j]);
                    }
                }
                arr.classHighlight();
                break;
            default:
                alert("Select a mode");
        }
    }
}

// Bind elements into highlighted groups
Object.prototype.classHighlight = function(){
    var that = this.length ? this : [this];
    function onOver(){
        for (var i = 0, len = that.length; i < len; i++){
            that[i].style.opacity = "1";
        }
    }
    function onOut(){
        for (var i = 0, len = that.length; i < len; i++){
            that[i].style.opacity = "0";
        }
    }
    for (var i = 0, len = that.length; i < len; i++){
        that[i].onmouseover = onOver;
        that[i].onmouseout = onOut;
    }
};

window.onload = function(){
    let fretButtons = document.getElementsByClassName("fret-button");
    let modeButtons = document.getElementsByClassName("mode-button");

    for(const button of fretButtons){
        button.addEventListener("click", changeFrets);
    }

    for(const button of modeButtons){
        button.addEventListener("click", function(){
            let siblings = this.parentNode.children;
            for(let i = 0; i < siblings.length; i++){
                siblings[i].classList.remove("active-button");
            }
            this.classList.add("active-button");
            mode = this.id;
            changeMode();
        });
    }

    // Default settings
    document.getElementById("all").click();
    document.getElementById("19-frets").click();
}
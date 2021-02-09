// this makes the teambuttons work, this is purely cosmetic

document.getElementById("teamRed").addEventListener("click", function(){
    document.getElementById("left-container__cosmetics").style.background = "#E71D23";
    document.getElementById("right-container__cosmetics").style.background = "#E71D23";
    document.getElementById("left-container__hinge-top").style.background = "linear-gradient(to right, #7F100F, #E71D23, #E71D23, #7F100F)";
    document.getElementById("left-container__hinge-bottom").style.background = "linear-gradient(to right, #7F100F, #E71D23, #E71D23, #7F100F)";
    document.getElementById("teamRed").style.borderColor = "#e7a71d";
    document.getElementById("teamYellow").style.borderColor = "black";
    document.getElementById("teamBlue").style.borderColor = "black";
})

document.getElementById("teamYellow").addEventListener("click", function(){
    document.getElementById("left-container__cosmetics").style.background = "#fce803";
    document.getElementById("right-container__cosmetics").style.background = "#fce803";
    document.getElementById("left-container__hinge-top").style.background = "linear-gradient(to right, #ebaf09, #fce803, #fce803, #ebaf09)";
    document.getElementById("left-container__hinge-bottom").style.background = "linear-gradient(to right, #ebaf09, #fce803, #fce803, #ebaf09)";
    document.getElementById("teamRed").style.borderColor = "black";
    document.getElementById("teamYellow").style.borderColor = "#e7a71d";
    document.getElementById("teamBlue").style.borderColor = "black";
})

document.getElementById("teamBlue").addEventListener("click",function(){
    document.getElementById("left-container__cosmetics").style.background = "#1975e6";
    document.getElementById("right-container__cosmetics").style.background = "#1975e6";
    document.getElementById("left-container__hinge-top").style.background = "linear-gradient(to right, #261f70, #1975e6, #1975e6, #261f70)";
    document.getElementById("left-container__hinge-bottom").style.background = "linear-gradient(to right, #261f70, #1975e6, #1975e6, #261f70)";
    document.getElementById("teamRed").style.borderColor = "black";
    document.getElementById("teamYellow").style.borderColor = "black";
    document.getElementById("teamBlue").style.borderColor = "#e7a71d";
})
// ==UserScript==
// @name         e6 User Level
// @version      0.2
// @description  enter something useful
// @author       reBane
// @match        https://e621.net/users/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

let aa_ul_level = 1;
let aa_ul_ephave = 0;
let aa_ul_epneed = aa_ul_level*100;
let aa_Stats = new Array();

let peTarget = document.querySelector("table.user-statistics");
if (peTarget === null) {
  console.warn("Table not found");
  return;
}

//search user stats - Yeah, maybe this is unnesseccary, but whatever :)
// 2020 Update: Pools, Sets, Blips coutners are gone
console.info("Reading stats from Page...");
let peCells = peTarget.querySelectorAll("th,td");
for (let i = 0; i < peCells.length; i+=2) {
  switch(peCells[i].innerHTML) {
  case "Join Date": //since join date
    aa_Stats['Days'] = Math.floor(new Date(new Date().getTime()-new Date(peCells[i+1].innerText).getTime()).getTime()/1000/60/60/24);
    aa_ul_ephave += aa_Stats['Days']*1;  //1 point a day seems fair enough
    console.info("Days Since Join Date " + aa_Stats['Days']);
    break;
  case "Posts":
    aa_Stats['Posts'] = parseInt(peCells[i+1].firstElementChild.innerText);
    aa_ul_ephave += aa_Stats['Posts']*10;
    console.info("Found Posts " + aa_Stats['Posts']);
    break;
  case "Deleted Posts":
    aa_Stats['Deleted Posts'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Deleted Posts']*(-15);  // Still thinking about making this -20
    console.info("Found Deleted Posts " + aa_Stats['Deleted Posts']);
    break;
  case "Favorites":
    aa_Stats['Favorites'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Favorites']*0.1;  // Would be silly to give more ep for a simple click
    console.info("Found Favorites " + aa_Stats['Favorites']);
    break;
  case "Forum Posts":
    aa_Stats['Forum Posts'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Forum Posts']*5;
    console.info("Found Forum Posts " + aa_Stats['Forum Posts']);
    break;
  case "Comments":
    aa_Stats['Comments'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Comments']*3;  // No fakin idea, so I just put 3
    console.info("Found Comments " + aa_Stats['Comments']);
    break;
  case "Blips":
    aa_Stats['Blips'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Blips']*2.5;  // 2 or 2.5 - that is the question
    console.info("Found Blips " + aa_Stats['Blips']);
    break;
  case "Feedback":
    var tmp = (peCells[i+1].firstElementChild.tagName == "A");
    aa_Stats['Record'] = (!tmp ? parseInt(peCells[i+1].firstElementChild.innerText) : parseInt(peCells[i+1].firstChild.textContent.trim()));
    aa_ul_ephave += aa_Stats['Record']*100;  // Yes, 1 positive record is value 100 ep. They are pretty rare, so come on
    console.info("Found Feedback (ex Record) " + aa_Stats['Record']);
    break;
  case "Post Changes":
    aa_Stats['Tag Edits'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Tag Edits'];
    console.info("Found Post Changes (ex Tag Edits) " + aa_Stats['Tag Edits']);
    break;
  case "Wiki Page Changes":
    aa_Stats['Wiki Edits'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Wiki Edits'];
    console.info("Found Wiki Page Changes (ex Wiki Edits) " + aa_Stats['Wiki Edits']);
    break;
  case "Note Changes":
    aa_Stats['Note Edits'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Note Edits'];
    console.info("Found Note Changes (ex Note Edits) " + aa_Stats['Note Edits']);
    break;
  case "Pool Changes":
    aa_Stats['Pool Updates'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Pool Updates'];
    console.info("Found Pool Changes (ex Pool Updates) " + aa_Stats['Pool Updates']);
    break;
  case "Sets":
    aa_Stats['Sets'] = parseInt(peCells[i+1].innerText);
    aa_ul_ephave += aa_Stats['Sets'];
    console.info("Found Sets " + aa_Stats['Sets']);
    break;
  default:
    break;
  }
}

while (aa_ul_ephave >= aa_ul_epneed) {
  aa_ul_level++;
  aa_ul_ephave-=aa_ul_epneed;
  aa_ul_epneed+=100;
}
console.info("Updated Level to " + aa_ul_level);

{
    let peLastRow = peTarget.querySelector('tbody').lastElementChild;
    if (peLastRow.querySelectorAll("td").length == 2) {
        console.info("Table is full, appending row");

        peLastRow = document.createElement("tr");
        let peCell1 = document.createElement("th");
        peLastRow.appendChild(peCell1);
        let peCell2 = document.createElement("td");
        peLastRow.appendChild(peCell2);
        peTarget.querySelector('tbody').appendChild(peLastRow);
    }
    let peCell1 = document.createElement("th");
    peLastRow.appendChild(peCell1);
    let peCell2 = document.createElement("td");
    peLastRow.appendChild(peCell2);

    console.info("Injecting information into table!");
    peCell1.appendChild(document.createTextNode("User Level"));
	
	let ceSpan = document.createElement("span");
	ceSpan.setAttribute("id", "aa_ul_level");
	ceSpan.appendChild(document.createTextNode(aa_ul_level));
	peCell2.appendChild(ceSpan);
	peCell2.appendChild(document.createTextNode(" ("));
	ceSpan = document.createElement("span");
	ceSpan.setAttribute("id", "aa_ul_ephave");
	ceSpan.appendChild(document.createTextNode(Math.round(aa_ul_ephave)));
	peCell2.appendChild(ceSpan);
	peCell2.appendChild(document.createTextNode("/"));
	ceSpan = document.createElement("span");
	ceSpan.setAttribute("id", "aa_ul_epneed");
	ceSpan.appendChild(document.createTextNode(aa_ul_epneed));
	peCell2.appendChild(ceSpan);
	peCell2.appendChild(document.createTextNode(" ep)"));
}

//decor avatar
let ceAwardBar = document.createElement("div");

let peAvatar = document.querySelector("div.profile-avatar");
if (peAvatar !== null) {
  let peel1 = peAvatar.querySelector('img');
  ceAwardBar.setAttribute("style", "position: relative; top:-15px; left:-15px; width:0; height:0;");
  peAvatar.parentElement.insertBefore(ceAwardBar,peAvatar);
} else {
  let peNick = document.querySelector('div.profile-stats h1');
  //aa_left = peNick.getBoundingClientRect()['right']-peNick.getBoundingClientRect()['left'] + 16;
  ceAwardBar.setAttribute("style", "position: relative; top:-16px; left:-24px; z-index:25; height:0; overflow:shown;");
  peNick.parentNode.insertBefore(ceAwardBar, peNick.nextSibling);
}


let aa_bronze1 = "#966448";  let aa_bronze2 = "#df7272";
let aa_silver1 = "#aaaaaa";  let aa_silver2 = "#ffffff";
let aa_gold1 = "#d79600";    let aa_gold2 = "#ffd700";
let aa_diamond1 = "#4896ff"; let aa_diamond2 = "#64ffff";
let aa_ruby1 = "#640000";    let aa_ruby2 = "#ff0000";
let aa_emerald1 = "#22aa22"; let aa_emerald2 = "#00ff16";
let aa_vanta1 = "#000000";   let aa_vanta2 = "#161616";
let aa_blue1 = "#0816ff";    let aa_blue2 = "#3272ff";
let aa_yellow1 = "#aaaa00";  let aa_yellow2 = "#ffff00";
let aa_white1 = "#ffffff";   let aa_white2 = "#c0c0c0";

let ceLevel = document.createElement("font");
ceLevel.setAttribute("style","color:rgba(255,255,255,0.75); text-shadow:rgba(0,0,0,0.75) 1px 1px; font-size:16px; ");
let val = aa_Stats['Posts']-aa_Stats['Deleted Posts'];
let cePosterMedal;
if (val > 10000)      cePosterMedal = createMedal(aa_vanta1,   aa_vanta2,   false, "Poster [Vantablack]\n10 000 Active Posts");
else if (val > 5000)  cePosterMedal = createMedal(aa_ruby1,    aa_ruby2,    false, "Poster [Ruby]\n5000 Active Posts");
else if (val > 2500)  cePosterMedal = createMedal(aa_diamond1, aa_diamond2, false, "Poster [Diamond]\n2500 Active Posts");
else if (val > 1000)  cePosterMedal = createMedal(aa_gold1,    aa_gold2,    false, "Poster [Gold]\n1000 Active Posts");
else if (val > 500)   cePosterMedal = createMedal(aa_silver1,  aa_silver2,  false, "Poster [Silver]\n500 Active Posts");
else if (val > 100)   cePosterMedal = createMedal(aa_bronze1,  aa_bronze2,  false, "Poster [Bronze]\n100 Active Posts");
else {
  cePosterMedal = document.createElement("div");
  cePosterMedal.setAttribute("style", "width:24px; height:20px; text-align:center;");
}
ceLevel.appendChild(document.createTextNode(aa_ul_level));
cePosterMedal.appendChild(ceLevel);
ceAwardBar.appendChild(cePosterMedal);

if (aa_Stats['Favorites'] >= 10000) ceAwardBar.appendChild(createMedal2(aa_ruby1, aa_ruby2, aa_yellow1, aa_yellow2, "Favouriser\nFaved 10 000 Posts\n\nThis... I like!"));
if (aa_Stats['Blips'] >= 1000)      ceAwardBar.appendChild(createMedal2(aa_blue1, aa_blue2, aa_yellow1, aa_yellow2, "Bliper\nWrote 1000 Blips\n\nBleep - Bloop"));

if (aa_Stats['Record'] >= 10)     ceAwardBar.appendChild(createMedal2(aa_diamond1, aa_diamond2, aa_emerald1, aa_emerald2, "Like a Sir\nRecord Greater 10\n\nMe gud - Like me NAO!"));
else if (aa_Stats['Record'] >= 7) ceAwardBar.appendChild(createMedal2(aa_gold1,    aa_gold2,    aa_emerald1, aa_emerald2, "Well-Behaved III\nRecord Greater 7 \n\nYou are Awesome"));
else if (aa_Stats['Record'] >= 3) ceAwardBar.appendChild(createMedal2(aa_silver1,  aa_silver2,  aa_emerald1, aa_emerald2, "Well-Behaved II\nRecord Greater 3 \n\nGood Boy"));
else if (aa_Stats['Record'] >= 1) ceAwardBar.appendChild(createMedal (aa_emerald1, aa_emerald2, true, "Well-Behaved\nPositive Record\n\nNot Bad"));

var cePostMedal;
val = aa_Stats['Forum Posts']+aa_Stats['Comments']+aa_Stats['Blips'];
if (val > 10000)     cePostMedal = createMedal2(aa_vanta1,   aa_vanta2,   aa_blue1, aa_blue2, "Supreme Writer [Vantablack]\n10 000+ Textual Posts\n\nI can't even label this");
else if (val > 5000) cePostMedal = createMedal2(aa_ruby1,    aa_ruby2,    aa_blue1, aa_blue2, "Writer [Ruby]\n5000 Textual Posts\n\nPillar of Community");
else if (val > 2500) cePostMedal = createMedal2(aa_diamond1, aa_diamond2, aa_blue1, aa_blue2, "Writer [Diamond]\n2500 Textual Posts\n\nWhat is this 'tl;dr'?");
else if (val > 1000) cePostMedal = createMedal2(aa_gold1,    aa_gold2,    aa_blue1, aa_blue2, "Writer [Gold]\n1000 Textual Posts\n\nAsk me anything");
else if (val > 500)  cePostMedal = createMedal2(aa_silver1,  aa_silver2,  aa_blue1, aa_blue2, "Writer [Silver]\n500 Textual Posts\n\nHelping Hand");
else if (val > 250)  cePostMedal = createMedal2(aa_bronze1,  aa_bronze2,  aa_blue1, aa_blue2, "Writer [Bronze]\n250 Textual Posts\n\nChit-Chat");
else if (val > 100)  cePostMedal = createMedal (aa_blue1,    aa_blue2, true, "Texter\n100 Textual Posts\n\nHello there");
if (cePostMedal !== undefined) ceAwardBar.appendChild(cePostMedal);

var ceEditMedal;
val = aa_Stats['Tag Edits']+aa_Stats['Wiki Edits']+aa_Stats['Note Edits']; 
if      (val > 1000000) { ceEditMedal = createMedal2(aa_white1,   aa_white2,   aa_vanta1,   aa_vanta2,   "Supreme Elite Tagger Master [Vantablack White]\n1 000 000 Edits");
                          ceEditMedal.setAttribute("style", ceEditMedal.getAttribute("style") + "border:thin solid black;"); }
else if (val > 750000)  { ceEditMedal = createMedal2(aa_white1,   aa_white2,   aa_ruby1,    aa_ruby2,    "Global Elite Tagger Master [Ruby White]\n750 000 Edits");
                          ceEditMedal.setAttribute("style", ceEditMedal.getAttribute("style") + "border:thin solid black;"); }
else if (val > 500000)  { ceEditMedal = createMedal2(aa_white1,   aa_white2,   aa_diamond1, aa_diamond2, "Global Elite Tagger [Diamond White]\n500 000 Edits");
                          ceEditMedal.setAttribute("style", ceEditMedal.getAttribute("style") + "border:thin solid black;"); }
else if (val > 250000)    ceEditMedal = createMedal2(aa_vanta1,   aa_vanta2,   aa_white1,   aa_white2,   "Elite Tagger Master [Vantablack]\n250 000 Edits");
else if (val > 100000)    ceEditMedal = createMedal2(aa_ruby1,    aa_ruby2,    aa_white1,   aa_white2,   "Elite Tagger [Ruby]\n100 000 Edits");
else if (val > 50000)     ceEditMedal = createMedal2(aa_diamond1, aa_diamond2, aa_white1,   aa_white2,   "Tagger Master [Diamond]\n50 000 Edits");
else if (val > 10000)     ceEditMedal = createMedal2(aa_gold1,    aa_gold2,    aa_white1,   aa_white2,   "Tagger III [Gold]\n10 000 Edits");
else if (val > 5000)      ceEditMedal = createMedal2(aa_silver1,  aa_silver2,  aa_white1,   aa_white2,   "Tagger II [Silver]\n5000 Edits");
else if (val > 2500)      ceEditMedal = createMedal2(aa_bronze1,  aa_bronze2,  aa_white1,   aa_white2,   "Tagger I [Bronze]\n2500 Edits");
else if (val > 1000)      ceEditMedal = createMedal (aa_white1,   aa_white2, true, "Amateur Tagger Master\n1000 Edits");
else if (val > 500)    {  ceEditMedal = createMedal (aa_white1,   aa_white2, true, "Amateur Tagger III\n500 Edits");
                          ceEditMedal.setAttribute("style", ceEditMedal.getAttribute("style") + "opacity:0.88;"); }
else if (val > 250)    {  ceEditMedal = createMedal (aa_white1,   aa_white2, true, "Amateur Tagger II\n250 Edits");
                          ceEditMedal.setAttribute("style", ceEditMedal.getAttribute("style") + "opacity:0.66;"); }
else if (val > 100)    {  ceEditMedal = createMedal (aa_white1,   aa_white2, true, "Amateur Tagger\n100 Edits");
                          ceEditMedal.setAttribute("style", ceEditMedal.getAttribute("style") + "opacity:0.44;"); }
if (ceEditMedal !== undefined) ceAwardBar.appendChild(ceEditMedal);

//=====------ - -  -  -     -            -

function createMedal(color1, color2, square, alt) {
  let ceTmp = document.createElement("div");
  ceTmp.setAttribute("style", "cursor:help; width:24px; height:" + (square?"8":"24") + "px; " + (!square?"border-radius:12px; ":"margin-top:3px;") + "background:linear-gradient(" + (square?"180":"120") + "deg, "+color1+" 0, "+color2+" 100%);");
  ceTmp.setAttribute("title", alt);
  return ceTmp;
}

function createMedal2(color1, color2, color3, color4, alt) {
  let ceTmp = document.createElement("div");
  ceTmp.setAttribute("style", "cursor:help; width:24px; height:8px; margin-top:3px; background:linear-gradient(180deg, "+color1+" 0, "+color2+" 100%);");
  ceTmp.setAttribute("title", alt);
  let ceTmp2 = document.createElement("div");
  ceTmp2.setAttribute("style", "cursor:help; margin-left:4px; width:16px; height:8px; margin-top:3px; background:linear-gradient(180deg, "+color3+" 0, "+color4+" 100%);");
  ceTmp2.setAttribute("title", alt);
  ceTmp.appendChild(ceTmp2);
  return ceTmp;
}

createMedal.prototype = {
  
};
createMedal2.prototype = {
  
};

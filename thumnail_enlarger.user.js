// ==UserScript==
// @name         e6 Thumbnail enlarger
// @namespace    n/a
// @version      0.2
// @description  hold shift :D
// @author       reBane
// @match        https://e621.net/*
// @match        http://e621.net/*
// @match        https://e926.net/*
// @match        http://e926.net/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

var TEsetting_width = 0.75; // as multiplier: 0..1
var TEsetting_height = 0.9; // as multiplier: 0..1
var TEsetting_key = 'ShiftLeft';

var TEenabled = false;

var pbox;
var pboxpic;
var TEerrNum;

var hoveredImg = null;
var displayedImg = null;

function TEinit() {
    //create display elements
    pbox = document.createElement("div");
    pbox.style.background = "rgba(32, 64, 110, .5)";
    pbox.style.borderRadius = "8px";
    pbox.style.boxShadow = "2px 2px 5px #07162D";
    pbox.style.minWidth = "100px";
    pbox.style.maxWidth = "98%";
    pbox.style.minHeight = "100px";
    pbox.style.maxHeight = "98%";
    pbox.style.position = "fixed";
    pbox.style.top = "1%";
    pbox.style.left = "1%";
    pbox.style.padding = "2px";
    pbox.style.zIndex = "99";
    pbox.style.display = "none";
    
    pboxpic = document.createElement("img");
    pboxpic.style.border = "none";
    pboxpic.style.borderRadius = "8px";
    pboxpic.setAttribute('alt', 'Loading...');
    pboxpic.addEventListener('error', TEalter);
    pboxpic.addEventListener('mouseout', function(){ pbox.style.display = "none"; });
    
    pbox.appendChild(pboxpic);
    document.body.appendChild(pbox);
    
    //attach scripts to tumbnails
    document.querySelectorAll("img.post-thumbnail-img, article.post-preview picture img").forEach(thumbnail=> {
        thumbnail.addEventListener('mouseover', TEimg);
        thumbnail.addEventListener('mouseout', ()=>{ if (!TEenabled) hoveredImg=null; });
    });
    window.addEventListener('keyup', (event) => {
        if (event.code == TEsetting_key) TEtoggle(false)
    } );
    window.addEventListener('keydown', (event) => {
        if (event.code == TEsetting_key) TEtoggle(true)
    } );

    console.info("Thumbnail enlarger initialised");
    console.log('Use '+TEsetting_key+' to zoom');

}

window.setTimeout(TEinit, 100);

function TEtoggle(on) {
    if (on && !TEenabled) {
        TEenabled = true;
        TEimg(null);
        console.info("Enabled Previews");
    } else if (!on && TEenabled) {
        TEenabled = false;
        displayedImg = null;
        pbox.style.display="none";
        console.info("Disabled Previews");
    }
}

function TEimg(event) {

    if (event != null) {
        hoveredImg = event.target;
    }
    if (!TEenabled || hoveredImg == null) {
        return 0;
    }
    if (displayedImg != null && displayedImg == hoveredImg) {
        return 0; //Only load if image changed
    } else {
        displayedImg = hoveredImg;
    }
    pbox.style.display="block";

    var src = null;
    pboxpic.src=""; //clear the image until we find the working one
    if (!hoveredImg.classList.contains('post-thumbnail-img')) {
        //highly probably, that wer're in a new layout article tag
        // parent up to the article tag, as it holds all the goodies :)
        var article = hoveredImg.parentElement.parentElement.parentElement;
        if (article.getAttribute('data-file-ext') == 'swf')
            return; // won't display that as hover, sorry not sorry
        if (article.hasAttribute('data-large-file-url')) // large file is the sample url
            src = article.getAttribute('data-large-file-url');
        else if (article.hasAttribute('data-file-url'))
            src = article.getAttribute('data-file-url');
        //else somethings broken !
    }
    if (src == null) {
        //legacy method for comment thumbnails:
        src = hoveredImg.src.split("preview/").join('');
        // ^ this will probably fail and trigger the failed image handler to try other variants
    }

	TEerrNum = 0;
    pboxpic.style.background="URL("+hoveredImg.src+")"; //to look at while loading
    pboxpic.style.backgroundSize="cover"; //needs to be done again as background changes
    pboxpic.src = src; // try 1
	//*/// Need to calc size, auto or % not working
    var nwidth = window.innerWidth * TEsetting_width;
	var wscale = nwidth / hoveredImg.width ;
	var nheight = hoveredImg.height * wscale;
	if (nheight > window.innerHeight * TEsetting_height) {
		nheight = window.innerHeight * TEsetting_height;
		wscale = nheight / hoveredImg.height ;
		nwidth = hoveredImg.width * wscale;
	}
	pboxpic.style.width = nwidth + "px";
	pboxpic.style.height = nheight + "px";
    //*///
    pbox.style.display="block";
}

function TEalter() {
	TEerrNum++;
	if (TEerrNum == 1) {
		var np = pboxpic.src;
		var npp = np.split("data/");
		np = npp[0] + "data/sample/" + npp[1];
		pboxpic.src = np;
		console.log ("Image(jpg) located in parent directory?");
	}
	if (TEerrNum == 2) {
		np = pboxpic.src;
		npp = np.split("sample/");
		np = npp[0] + npp[1];
		np = np.replace (/jpg/gi, "png");
		pboxpic.src = np;
		console.log ("Image got a different format (png)?");
	}
	if (TEerrNum == 3) {
		np = pboxpic.src;
		npp = np.split("data/");
		np = npp[0] + "data/sample/" + npp[1];
		pboxpic.src = np;
		console.log ("Image(png) located in parent directory?");
	}
	if (TEerrNum == 4) {
		np = pboxpic.src;
		npp = np.split("sample/");
		np = npp[0] + npp[1];
		np = np.replace (/png/gi, "gif");
		pboxpic.src = np;
		console.log ("Image got a different format (gif)?");
	}
	if (TEerrNum == 5) {
		np = pboxpic.src;
		npp = np.split("data/");
		np = npp[0] + "data/sample/" + npp[1];
		pboxpic.src = np;
		console.log ("Image(gif) located in parent directory?");
	}
	if (TEerrNum == 6) {
		pbox.style.display = "none";
		console.log ("DUNNO");
	}
}

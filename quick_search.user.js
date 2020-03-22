// ==UserScript==
// @name         e6 Quick Search
// @version      0.2
// @description  enter something useful
// @author       reBane
// @include      https://e621.net*
// @include      https://e926.net*
// @exclude      https://e621.net/posts*
// @exclude      https://e926.net/posts*
// @grant        none
// ==/UserScript==

let ceQSearch = document.createElement("div");
ceQSearch.setAttribute("style", "position:fixed; top:0; left:120px; padding:0.3em; padding-top:0;"+
		"background:#203f6c; box-shadow: 2px 3px 5px #07162D; border-radius:0 0 6px 6px; z-index:25;");

	let ceQForm = document.createElement("form");
	ceQForm.setAttribute("method", "get");
	ceQForm.setAttribute("action", "/posts");
        
		let ceQHeader = document.createElement("h6");
		ceQHeader.appendChild(document.createTextNode("Quick Search"));
        ceQHeader.setAttribute("style", "display:inline-block; margin-right: 0.5em; margin-top: .25em");
		ceQForm.appendChild(ceQHeader);
        
		let ceQInput = document.createElement("input");
		ceQInput.setAttribute("type", "text");
        ceQInput.setAttribute("id", "tags");
        ceQInput.setAttribute("name", "tags");
        ceQInput.setAttribute("style", "width:183px; margin-right: 0.2em; box-shadow: none; transition:width .5s;");
		ceQForm.appendChild(ceQInput);
        
	ceQSearch.appendChild(ceQForm);

document.body.appendChild(ceQSearch);

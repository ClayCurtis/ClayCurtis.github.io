(function(){if(typeof wpcom==="undefined"){window.wpcom={}}if(!window.wpNotesArgs){console.warn("Missing data from PHP (wpNotesArgs).")}const e=window.wpNotesArgs||{};const t=e.cacheBuster||"none";let s=false;let i=e.iframeUrl||"https://widgets.wp.com/notes/";let n=e.iframeAppend||"";let o=e.iframeScroll||"no";let a=e.wide||false;let r;let c;class l{constructor(){this.el=document.querySelector("#wp-admin-bar-notes");if(!this.el){return}this.hasUnseen=null;this.initialLoad=true;this.count=null;this.iframe=null;this.iframeWindow=null;this.messageQ=[];this.iframeSpinnerShown=false;this.isJetpack=false;this.linkAccountsURL=false;this.currentMasterbarActive=undefined;if(window.jQuery&&window.jQuery.fn&&!window.jQuery.fn.spin){window.jQuery.fn.spin=()=>{}}const e=document.querySelector("#wpadminbar");this.isRtl=e&&e.classList.contains("rtl");this.count=document.querySelector("#wpnt-notes-unread-count");this.panel=document.querySelector(`#${r}`);if(!this.count||!this.panel){return}this.hasUnseen=this.count.classList.contains("wpn-unread");if(window.wpNotesIsJetpackClient){this.isJetpack=true}if(this.isJetpack&&typeof window.wpNotesLinkAccountsURL!=="undefined"){this.linkAccountsURL=window.wpNotesLinkAccountsURL}const t=e=>{e.preventDefault();this.togglePanel()};this.el.querySelectorAll(".ab-item").forEach(e=>{e.addEventListener("click",t);e.addEventListener("touchstart",t)});const s=e=>{if(e&&this.mouseInPanel){e.preventDefault()}};if(n==="2"){this.panel.addEventListener("mousewheel",s);this.panel.addEventListener("mouseenter",()=>{this.mouseInPanel=true});this.panel.addEventListener("mouseleave",()=>{this.mouseInPanel=false});if(typeof document.hidden!=="undefined"){document.addEventListener("visibilitychange",()=>{this.postMessage({action:"toggleVisibility",hidden:document.hidden})})}}const i=e=>{if(!this.showingPanel){return true}const t=e.target;if(t===document||t===document.documentElement){return true}if(t.closest("#wp-admin-bar-notes")){return true}this.hidePanel();return false};document.addEventListener("mousedown",i);document.addEventListener("focus",i);document.addEventListener("keydown",e=>{const t=window.wpNotesCommon.getKeycode(e);if(!t){return}if(t===27){this.hidePanel()}if(t===78){this.togglePanel()}if(this.iframeWindow===null){return}if(this.showingPanel){if(t===74||t===40){this.postMessage({action:"selectNextNote"});e.preventDefault()}if(t===75||t===38){this.postMessage({action:"selectPrevNote"});e.preventDefault()}if(t===82||t===65||t===83||t===84){this.postMessage({action:"keyEvent",keyCode:t});e.preventDefault()}}});if(window.wpcom.events&&window.wpcom.events.on){window.wpcom.events.on("notes:togglePanel",()=>this.togglePanel())}if(this.isJetpack){this.loadIframe()}else{setTimeout(()=>this.loadIframe(),3e3)}if(this.count.classList.contains("wpn-unread")){window.wpNotesCommon.bumpStat("notes-menu-impressions","non-zero")}else{window.wpNotesCommon.bumpStat("notes-menu-impressions","zero")}window.addEventListener("message",e=>{if(e.origin!=="https://widgets.wp.com"){return}try{const t=typeof e.data==="string"?JSON.parse(e.data):e.data;if(t.type!=="notesIframeMessage"){return}this.handleEvent(t)}catch(e){}})}handleEvent(e){if(!e||!e.action){return}switch(e.action){case"togglePanel":this.togglePanel();break;case"render":this.render(e.num_new,e.latest_type);break;case"renderAllSeen":this.renderAllSeen();break;case"iFrameReady":this.iFrameReady(e);break;case"widescreen":{const t=document.querySelector(`#${c}`);if(t){if(e.widescreen&&!t.classList.contains("widescreen")){t.classList.add("widescreen")}else if(!e.widescreen&&t.classList.contains("widescreen")){t.classList.remove("widescreen")}}break}}}render(e,t){if(this.hasUnseen===false&&e===0){return}if(this.initialLoad&&this.hasUnseen&&e!==0){this.initialLoad=false;return}if(!this.hasUnseen&&e!==0){window.wpNotesCommon.bumpStat("notes-menu-impressions","non-zero-async")}let s=window.wpNotesCommon.noteType2Noticon[t];if(!s){s="notification"}this.count.innerHTML="";if(e===0||this.showingPanel){this.hasUnseen=false;this.count.classList.remove("wpn-unread");this.count.classList.add("wpn-read");this.count.appendChild(this.getStatusIcon(e));if(window.wpcom.masterbar){window.wpcom.masterbar.hasUnreadNotifications(false)}}else{this.hasUnseen=true;this.count.classList.remove("wpn-read");this.count.classList.add("wpn-unread");this.count.appendChild(this.getStatusIcon(null,s));if(window.wpcom.masterbar){window.wpcom.masterbar.hasUnreadNotifications(true)}}}renderAllSeen(){if(!this.hasToggledPanel){return}this.render(0)}getStatusIcon(e,t=null){const s=t?`noticon-${t}`:"noticon-notification";const i=document.createElement("span");i.classList.add("noticon");i.classList.add(s);return i}togglePanel(){if(!this.hasToggledPanel){this.hasToggledPanel=true}this.loadIframe();this.el.classList.toggle("wpnt-stayopen");this.el.classList.toggle("wpnt-show");this.showingPanel=this.el.classList.contains("wpnt-show");document.querySelectorAll(".ab-active").forEach(e=>e.classList.remove("ab-active"));if(this.showingPanel){this.el.querySelectorAll(".wpn-unread").forEach(e=>{e.classList.remove("wpn-unread");e.classList.add("wpn-read")});this.reportIframeDelay();if(this.hasUnseen){window.wpNotesCommon.bumpStat("notes-menu-clicks","non-zero")}else{window.wpNotesCommon.bumpStat("notes-menu-clicks","zero")}this.hasUnseen=false}this.postMessage({action:"togglePanel",showing:this.showingPanel});const e=e=>{if(e.contentWindow===null){e.addEventListener("load",e.contentWindow.focus())}else{e.contentWindow.focus()}};if(this.showingPanel){e(this.iframe)}else{window.focus()}this.setActive(this.showingPanel)}setActive(e){if(e){this.currentMasterbarActive=document.querySelectorAll(".masterbar li.active");this.currentMasterbarActive.forEach(e=>e.classList.remove("active"));this.el.classList.add("active")}else{this.el.classList.remove("active");if(this.currentMasterbarActive){this.currentMasterbarActive.forEach(e=>e.classList.add("active"))}this.currentMasterbarActive=undefined}const t=this.el.querySelector("a");if(t){t.blur()}}loadIframe(){const e=[];if(this.iframe===null){this.panel.classList.add("loadingIframe");if(this.isJetpack){e.push("jetpack=true");if(this.linkAccountsURL){e.push("link_accounts_url="+escape(this.linkAccountsURL))}}if("ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch){this.panel.classList.add("touch")}const s=this.panel.getAttribute("dir")==="rtl";const r=this.panel.getAttribute("lang")||"en";e.push("v="+t);e.push("locale="+r);const l=e.length?"?"+e.join("&"):"";let d=i;if(n==="2"&&(this.isRtl||s)&&!/rtl.html$/.test(i)){d=i+"rtl.html"}d=d+l+"#"+document.location.toString();if(s){d+="&rtl=1"}if(!r.match(/^en/)){d+="&lang="+r}this.iframe=document.createElement("iframe");this.iframe.setAttribute("style","display:none");this.iframe.setAttribute("id",c);this.iframe.setAttribute("frameborder",0);this.iframe.setAttribute("allowtransparency","true");this.iframe.setAttribute("scrolling",o);this.iframe.setAttribute("src",d);if(a){this.panel.classList.add("wide");this.iframe.classList.add("wide")}this.iframe.classList.add("intrinsic-ignore");this.panel.appendChild(this.iframe)}}reportIframeDelay(){if(!this.iframeWindow){if(!this.iframeSpinnerShown){this.iframeSpinnerShown=new Date().getTime()}return}if(this.iframeSpinnerShown!==null){let e=0;if(this.iframeSpinnerShown){e=new Date().getTime()-this.iframeSpinnerShown}let t="";if(e===0){t="0"}else if(e<1e3){t="0-1"}else if(e<2e3){t="1-2"}else if(e<4e3){t="2-4"}else if(e<8e3){t="4-8"}else{t="8-N"}window.wpNotesCommon.bumpStat("notes_iframe_perceived_delay",t);this.iframeSpinnerShown=null}}iFrameReady(e){const t=new URL(this.iframe.src);this.iframeOrigin=t.protocol+"//"+t.host;this.iframeWindow=this.iframe.contentWindow;if("num_new"in e){this.render(e.num_new,e.latest_type)}this.panel.classList.remove("loadingIframe");this.panel.querySelectorAll(".wpnt-notes-panel-header").forEach(e=>e.remove());this.iframe.style.removeProperty("display");if(this.showingPanel){this.reportIframeDelay()}const s=()=>{const e=new Date().getTime();if(!this.lastActivityRefresh||this.lastActivityRefresh<e-5e3){this.lastActivityRefresh=e;this.postMessage({action:"refreshNotes"})}};window.addEventListener("focus",s);window.addEventListener("keydown",s);window.addEventListener("mousemove",s);window.addEventListener("scroll",s);this.sendQueuedMessages()}hidePanel(){if(this.showingPanel){this.togglePanel()}}postMessage(e){try{let t=typeof e==="string"?JSON.parse(e):e;const s=typeof t==="function"||typeof t==="object"&&!!t;if(!s){return}t={type:"notesIframeMessage",...t};const i=this.iframeOrigin;if(this.iframeWindow&&this.iframeWindow.postMessage){this.iframeWindow.postMessage(JSON.stringify(t),i)}else{this.messageQ.push(t)}}catch(e){}}sendQueuedMessages(){this.messageQ.forEach(e=>this.postMessage(e));this.messageQ=[]}}function d(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}function h(){return d()?window.location.hostname.match(/wordpress\.com$/)===null:true}function u(){var e=document.createElement("iframe");e.setAttribute("style","display:none");e.setAttribute("class","jetpack-notes-cookie-check");e.setAttribute("src","https://widgets.wp.com/3rd-party-cookie-check/index.html");document.body.appendChild(e)}function f(){u();window.addEventListener("message",function(e){if("https://widgets.wp.com"!==e.origin){return}if("WPCOM:3PC:allowed"===e.data){console.debug("3PC allowed");w()}else if("WPCOM:3PC:blocked"===e.data){console.debug("3PC blocked");m()}},false)}function w(){if(!document.querySelector("#wpnt-notes-panel")&&document.querySelector("#wpnt-notes-panel2")&&window.wpNotesIsJetpackClientV2){i="https://widgets.wp.com/notifications/";n="2";o="yes";a=true}r="wpnt-notes-panel"+n;c="wpnt-notes-iframe"+n;s=true;new l}function m(){if(s){return}document.querySelector("#wp-admin-bar-notes").addEventListener("click",function(e){e.stopPropagation();e.preventDefault();window.location="https://wordpress.com/read/notifications"})}function p(){h()?f():w()}if(document.readyState!=="loading"){p()}else{document.addEventListener("DOMContentLoaded",p)}})();
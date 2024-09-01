 class githubJiraTicket {
   constructor(domain) {
     this.domain = domain;
     this.previousUrl = "";
     this.observedElement = document;
     this.targetElSelector = ".gh-header-show .gh-header-title .js-issue-title";
     this.isDebug = true;
     this.runObserver();
   }
 
   runObserver() {
     this.consoleLog("runObserver -> observer started");
 
     const observerElement = this.observedElement;
     this.consoleLog("runObserver -> observerElement:", observerElement);
     const observer = new MutationObserver((mutationsList, observer) => {
       this.consoleLog("runObserver -> location", location.href);
       this.consoleLog("runObserver -> previousUrl", this.previousUrl);
       if (location.href !== this.previousUrl) {
         this.previousUrl = location.href;
         this.consoleLog("runObserver -> mutation changed");
         observer.disconnect();
         setTimeout(() => {
           this.addLinkToJiraTicket();
           this.runObserver();
         }, 500);        
       }
     });
 
     const config = { subtree: true, childList: true };
     observer.observe(observerElement, config);
   }
 
   async addLinkToJiraTicket() {
     this.consoleLog("addLinkToJiraTicket -> start");
 
     const found = await this.waitForElementToDisplay(
       this.targetElSelector,
       null,
       100,
       1000
     );
     if (!found) {
       this.consoleLog("addLinkToJiraTicket -> element not found");
       return;
     } else {
       this.consoleLog("addLinkToJiraTicket -> element found");
     }
 
     const title = document.querySelector(this.targetElSelector);
     const text = title.textContent;
     const pattern = /[A-Za-z\d]+-\d+/;
     const matches = text.match(pattern);
 
     if (matches && matches.length) {
       const jiraId = matches[0];
       const linkToJira = `${this.domain}${jiraId}`;
       const a = document.createElement("a");
       this.consoleLog(
         "addLinkToJiraTicket ->  link to jira ticket:",
         linkToJira
       );
       a.setAttribute("href", linkToJira);
       a.setAttribute("target", "_blank");
       a.textContent = text;
       title.innerHTML = "";
       this.consoleLog("a:", a);
       title.appendChild(a);
       this.consoleLog("addLinkToJiraTicket ->  element appended?");
     } else {
       this.consoleLog(
         "addLinkToJiraTicket -> regular expresion not find oject"
       );
     }
     this.consoleLog("addLinkToJiraTicket -> end");
   }
 
   waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
     this.consoleLog("waitForElementToDisplay -> start");
     return new Promise((resolve, reject) => {
       var startTimeInMs = Date.now();
       (function loopSearch() {
      
         if (document.querySelector(selector) != null) {
           if (callback) callback();
           resolve(true);
         } else {
           setTimeout(function () {
             if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
               resolve(false);
             } else {
               loopSearch();
             }
           }, checkFrequencyInMs);
         }
       })();
     });
   }
 
   consoleLog() {
     if (!this.isDebug) return;
     console.log("debug: ", ...arguments);
   }
 }
 
 //**********
  try {
  new githubJiraTicket('https://***URL***.atlassian.net/browse/');
  } 
 catch (error) {
     console.log('error:', error);
   }

class GithubJiraTicket {
  constructor(domain) {
    this.domain = domain;
    this.previousUrl = "";
    this.targetElSelector = ".gh-header-show .gh-header-title .js-issue-title";
    this.isDebug = true;
    this.observer = null;
    this.init();
  }

  init() {
    this.startObserver();
    this.addLinkToJiraTicket(); // Initial check
  }

  startObserver() {
    this.debug("Starting observer");
    
    this.observer?.disconnect();
    this.observer = new MutationObserver(this.handleMutation.bind(this));
    
    const config = { subtree: true, childList: true };
    this.observer.observe(document, config);
  }

  handleMutation() {
    if (location.href === this.previousUrl) return;
    
    this.debug(`URL changed from ${this.previousUrl} to ${location.href}`);
    this.previousUrl = location.href;
    
    // Debounce multiple rapid changes
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.addLinkToJiraTicket(), 300);
  }

  async addLinkToJiraTicket() {
    this.debug("Adding JIRA ticket link");

    const titleElement = await this.waitForElement(this.targetElSelector);
    if (!titleElement) {
      this.debug("Title element not found");
      return;
    }

    const text = titleElement.textContent;
    const jiraId = this.extractJiraId(text);
    
    if (!jiraId) {
      this.debug("No JIRA ID found in title");
      return;
    }

    this.updateTitleWithLink(titleElement, text, jiraId);
  }

  extractJiraId(text) {
    const pattern = /[A-Za-z\d]+-\d+/;
    const [match] = text.match(pattern) || [];
    return match;
  }

  updateTitleWithLink(titleElement, text, jiraId) {
    const link = document.createElement("a");
    link.href = `${this.domain}${jiraId}`;
    link.target = "_blank";
    link.textContent = text;
    
    titleElement.innerHTML = "";
    titleElement.appendChild(link);
    this.debug(`Link added: ${link.href}`);
  }

  async waitForElement(selector, timeout = 1000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
  }

  debug(...args) {
    if (this.isDebug) {
      console.log("GithubJiraTicket:", ...args);
    }
  }
}

try {
  new GithubJiraTicket('https://***URL***.atlassian.net/browse/');
} catch (error) {
  console.error('GithubJiraTicket Error:', error);
}

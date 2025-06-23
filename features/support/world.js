const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');


class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.clipboard = '';
  }
  
  async setDriver() {
        this.driver = await new Builder()
      .forBrowser('firefox')
      .build();
    
    await this.driver.manage().setTimeouts({
      implicit: this.parameters.waitTimeout
    });
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  await this.setDriver();
});

After(async function () {
  if (this.driver) {
    await this.driver.quit();
  }
});
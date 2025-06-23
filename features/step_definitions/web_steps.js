const { When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, Key, until, Select } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

const BASE_URL = 'http://localhost:8080';

let driver;

…  const actualMessage = await messageElement.getText();
  assert.ok(actualMessage.includes(expectedMessage), `Expected message "${expectedMessage}", but got "${actualMessage}"`);
});
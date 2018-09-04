require('babel-core/register')({
  presets: [
    'react',
    'es2015',
    'stage-0',
  ],
  plugins: ['transform-decorators-legacy'],
});

const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const JUnitXmlReporter = require('jasmine-reporters').JUnitXmlReporter;

// Grab server port from package.json
const serverPort = '3010'; // process.env.npm_package_betterScripts_start_dev_server_env_PORT;


const htmlScreenshotReporter = new HtmlScreenshotReporter({
  dest: 'reports/protractor-screenshots',
  filename: 'index.html',
  reportFailedUrl: true,
});

const junitReporter = new JUnitXmlReporter({
  savePath: 'reports/protractor-junit',
  consolidateAll: false,
});

const seleniumGridOptions = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
};
const seleniumDirectOptions = {
  directConnect: true,
};
const seleniumConfig = process.env.JENKINS_URL ? seleniumGridOptions : seleniumDirectOptions;

exports.config = Object.assign(
  {},
  {
    specs: ['./src/**/*.e2e.js'],
    baseUrl: `http://localhost:${serverPort}`,

    framework: 'jasmine2',
    jasmineNodeOpts: {
      isVerbose: true,
    },
    onPrepare: () => {
      browser.waitForAngularEnabled(false);

      browser.ignoreSynchronization = true;
      jasmine.getEnv().addReporter(htmlScreenshotReporter);
      jasmine.getEnv().addReporter(junitReporter);

      browser.manage().timeouts().pageLoadTimeout(10000);
      browser.manage().timeouts().implicitlyWait(3000);

      browser.driver.manage().window().setSize(1024, 768);

      return browser.get(`http://localhost:${serverPort}`);
    },

    beforeLaunch: () => new Promise(resolve => {
      htmlScreenshotReporter.beforeLaunch(resolve);
    }),

    afterLaunch: exitCode => new Promise(resolve => {
      htmlScreenshotReporter.afterLaunch(resolve.bind(this, exitCode));
    }),
  },
  seleniumConfig
);

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

// parameters for fallback scenario must exist.
const defaultParameters = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'defaultParameters.json'))
);

const defaultMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'defaultMessages.json'))
);

const defaultDesktopParameters = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'defaultDesktopParameters.json'))
);

const CONFIG_PATH = path.join(__dirname, '../../config');

const ENV = process.env.NODE_ENV || 'development';

const CMS_CONFIG = require('./config.json');

const getCmsParameters = async () => {
  try {
    const cmsParameterRes = await fetch(CMS_CONFIG[ENV].parameterUrl);
    const data = await cmsParameterRes.json();

    return data.parameters;
  } catch (e) {
    console.error(
      'Default client parameters have been set due to api failure:',
      e
    );
    return defaultParameters.parameters;
  }
};

const getCmsMessages = async () => {
  try {
    const cmsMessagesRes = await fetch(CMS_CONFIG[ENV].messagesUrl);
    const data = await cmsMessagesRes.json();

    return data.data;
  } catch (e) {
    console.error(
      'Default client messages has been set due to api failure:',
      e
    );
    return defaultMessages.data;
  }
};

const getDesktopParameters = async () => {
  try {
    const res = await fetch(CMS_CONFIG[ENV].desktopParametersUrl);

    return await res.json();
  } catch (e) {
    console.error(
      'Default desktop parameters has been set due to api failure:',
      e
    );
    return defaultDesktopParameters;
  }
};

const normalizeParameters = parameters => {
  const newConfig = {};

  parameters.forEach(parameter => {
    let val;
    // Convert string value to boolean if necessary.

    if (String(parameter.value).toLowerCase() === 'true') {
      val = true;
    } else if (String(parameter.value).toLowerCase() === 'false') {
      val = false;
    } else {
      val = parameter.value;
    }

    newConfig[parameter.key] = val;
  });

  return newConfig;
};

export default async function updateConfig() {
  const config = {
    parameters: {},
    messages: [],
    messagesUrl: CMS_CONFIG[ENV].messagesUrl,
    parametersUrl: CMS_CONFIG[ENV].parameterUrl,
    desktopParametersUrl: CMS_CONFIG[ENV].desktopParametersUrl,
  };

  const parameters = await getCmsParameters();
  const messages = await getCmsMessages();
  const desktopParameters = await getDesktopParameters();

  config.parameters = normalizeParameters(parameters);
  config.messages = messages;
  config.desktopParameters = desktopParameters;

  fs.writeFileSync(
    path.join(CONFIG_PATH, `local-${ENV}.json`),
    JSON.stringify(config)
  );
  console.info('Environment variables updated SUCCESSFULLY.');
}

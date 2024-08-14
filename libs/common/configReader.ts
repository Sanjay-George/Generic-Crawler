const config = require("../../appsettings.json");

export const getConfigValue = (key) => {
    return config[key];
};


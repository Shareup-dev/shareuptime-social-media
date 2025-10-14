// http://167.71.237.231:8081
// http://195.110.59.203:8081
// http://192.168.100.239:8080
// http://backend.shareup.digital

const settings = {
  dev: {
    apiUrl: 'http://192.168.100.239:8080', //Logeeshan
    //apiUrl: 'http://192.168.100.238:8080', //This Mac
  },
  staging: {
    apiUrl: 'http://192.168.100.2:8080',
  },
  prod: {
    apiUrl: 'https://shareup.digital/backend',
  },
};

const getCurrentSettings = () => {
  // If app running lally __DEV_ returns true.

  // if (__DEV__) return settings.dev;
  // if (__DEV__) return settings.prod;

  // if (Constants.manifest.releaseChannel === 'staging') return settings.staging;
  return settings.dev;
};

export default getCurrentSettings();

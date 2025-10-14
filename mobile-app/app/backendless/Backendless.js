/**
 *
 * Configure Backendless
 */
import Backendless from "backendless";

const APP_ID = "05F9EB34-FDFF-FF34-FF06-A90B42E4C900";
const API_KEY = "0B203BFC-4A6C-4BFD-9EDF-628E3C8FA164";

Backendless.serverURL = "https://eu-api.backendless.com";
Backendless.initApp(APP_ID, API_KEY);

export default Backendless;

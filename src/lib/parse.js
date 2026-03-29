import Parse from "parse";

Parse.initialize(
  import.meta.env.VITE_APP_ID,
  import.meta.env.VITE_JS_KEY
);
Parse.serverURL = import.meta.env.VITE_SERVER_URL || "https://parseapi.back4app.com";

export default Parse;
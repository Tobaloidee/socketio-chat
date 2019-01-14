import * as pino from "pino";

export const Logger = pino({
  name: "socketio-chat",
  prettyPrint: true
});

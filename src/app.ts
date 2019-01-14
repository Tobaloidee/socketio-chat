import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as helmet from "helmet";
import { createServer, Server } from "http";
import { join } from "path";
import * as socketIO from "socket.io";

// Utils
import { Logger } from "./logger";

class App {
  public static readonly PORT: number = 8080;
  private app: express.Application;
  private port: string | number;
  private io: SocketIO.Server;
  private server: Server;

  constructor() {
    this.config();
    this.createApp();
    this.createServer();
    this.sockets();
    this.middlewares();
    this.listen();
  }

  public getApp(): express.Application {
    return this.app;
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || App.PORT;
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      Logger.info(`Express server listening on PORT ${this.port}`);
    });

    this.io.on("connection", socket => {
      socket.on("chat", data => {
        this.io.sockets.emit("chat", data);
      });

      socket.on("typing", data => {
        socket.broadcast.emit("typing", data);
      });
    });
  }

  private sockets() {
    this.io = socketIO(this.server);
  }

  private middlewares(): void {
    this.app.use(express.static(join(__dirname, "..", "public")));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(compression());
  }
}

export default new App().getApp();

import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";


export class GameManager {
    private game: Game[];
    private pendingUsers: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.game = [];
        this.pendingUsers = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        // Stop the game here as the user left the game
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            // init_game request
            if (message.type === INIT_GAME) {
                if (this.pendingUsers) {
                    // start the game
                    const game = new Game(this.pendingUsers, socket);

                    this.game.push(game);
                    this.pendingUsers = null;

                } else {
                    this.pendingUsers = socket;
                }
            }

            // move request
            if (message.type === MOVE) {
                const game = this.game.find(game => game.player1 === socket || game.player2 === socket);

                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
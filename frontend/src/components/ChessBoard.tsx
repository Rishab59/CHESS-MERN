import { useState } from "react";

import { Color, PieceSymbol, Square } from "chess.js";
import { MOVE } from "../screens/Game";


const ChessBoard = ({ chess, setBoard, board, socket } : {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null) [][];
    socket: WebSocket;
}) => {
    const [ from, setFrom ] = useState<Square | null>(null);
    const [ to, setTo ] = useState<Square | null>(null);


    return (
        <div className = "text-white-200">
            {
                board.map((row, i) => {
                    return (
                        <div
                            key = { i }
                            className = "flex"
                        >
                            {
                                row.map((square, j) => {
                                    const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                                    return (
                                        <div
                                            key = { j }
                                            onClick = {
                                                () => {
                                                    if (!from) {
                                                        setFrom(squareRepresentation);
                                                    } else {
                                                        // setTo(square?.square ?? null);

                                                        socket.send(JSON.stringify({
                                                            type: MOVE,
                                                            payload: {
                                                                move: {
                                                                    from,
                                                                    to: squareRepresentation,
                                                                }
                                                            }
                                                        }));
                                                        
                                                        setFrom(null);
                                                        chess.move({
                                                            from,
                                                            to: squareRepresentation,
                                                        });
                                                        setBoard(chess.board());

                                                        // console.log("From: " + from + " To: " + to);
                                                    }
                                                }
                                            }
                                            className = { `w-16 h-16 ${ (i + j) % 2 === 0 ? "bg-green-500" : "bg-slate-500" }` }
                                        >
                                            <div className = "w-full h-full flex justify-center">
                                                <div className = "h-full flex flex-col justify-center">
                                                    {
                                                        square
                                                        ?
                                                            <img
                                                                src = {
                                                                    `/${square?.color === "b"
                                                                    ?
                                                                        square?.type
                                                                    :
                                                                        `${square?.type?.toUpperCase()}-white`
                                                                }.png`}
                                                                alt = "icon"
                                                                className = "w-5"
                                                            />
                                                        :
                                                            null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    );
                })
            }
        </div>
    );
};


export default ChessBoard;

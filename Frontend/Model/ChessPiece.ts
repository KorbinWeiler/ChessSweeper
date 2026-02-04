class ChessPiece{
    movePair: number[];
    color: "white" | "black" = "white";
    type: string = "ChessPiece";

    constructor(movePair: number[], color: "white" | "black" = "white"){
        this.movePair = movePair;
        this.color = color;

        if(this.calculateMoves === ChessPiece.prototype.calculateMoves){
            throw new Error("Abstract method not implemented: calculateMoves");
        }
    }

    calculateMoves(currentX: number, currentY: number): [number, number][]{
        return [];
    }
}

export { ChessPiece };
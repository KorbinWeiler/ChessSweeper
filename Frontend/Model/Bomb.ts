class Bomb{
    isActive: boolean;

    constructor(isActive: boolean = true){
        this.isActive = isActive;
    }

    detonate(): boolean{
        if ( this.isActive ){
            this.isActive = false;
            return true;
        }
        else{
            return false;
        }
    }
}

export { Bomb };
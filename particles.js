import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {

    }
}

/**
 * Sand particle
 */
export class Sand extends Particle {
    constructor() {
        super();
        const sandShades = ["#FFA500", "#FFB347", "#FFCC66", "#FFD27F", "#FFE0A3"];
        const randomShade = Math.floor(Math.random() * sandShades.length);
        this.color = sandShades[randomShade];
        this.type = "sand";
    }

    swap(other) {
        return other.type == 'water';
    }
    
    update(row, col) {
        let newRow = row + 1

        if (!moveParticle(row,col,row+1, col, this.swap)){
            if (!moveParticle(row, col, newRow, col - 1, this.swap)) {
                moveParticle(row, col, newRow, col + 1, this.swap)
            }
        }
    }
}

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */

export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } 
    
    else if (value == "Water") {
        return new Water();
    }

    else if (value == "Stone") {
        return new Stone();
    }

    else if (value == "Dirt") {
        return new Dirt();
    }

    else if (value == "Fire") {
        return new Fire();
    }
    else if (value == "Wood") {
        return new Wood();
    }
    else if (value == "Steam") {
        return new Steam();
    }
    return null;
}
// Water Particle
export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    swap(other) {
        return other.type == "steam";
    }
    

    update(row, col) {
        if (getParticle(row+1, col)?.type == "Dirt") {
            setParticle(row+1, col, new Grass());
            setParticle(row, col, null);
            return;
        }


        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, this.swap);
        }

        if (getRandomInt(0,1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, this.swap);
        }

        if (!getRandomInt(0, 4) && !getParticle(row+1, col+1)) {
            moveParticle(row, col, row+1, col+1, this.swap);   
        }

        if (!getRandomInt(0, 4) && !getParticle(row+1, col-1)) {
            moveParticle(row, col, row+1, col-1, this.swap);      
        }

        if (!getRandomInt(0,10) && !getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, this.swap);
        }

        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, this.swap);
        }
    }
}

// Stone Particle
export class Stone extends Particle {
    constructor() {
        super();
        this.color = "gray";
        this.type = "stone";
    }
}

// Dirt Particle
export class Dirt extends Sand {
    constructor() {
        super();
        const dirtShades = ["#5D4037","#6D4C41","#795548","#8D6E63","#804422cb","#272626ff"];
        const randomShade = Math.floor(Math.random() * dirtShades.length);
        this.color = dirtShades[randomShade];
        this.type = "dirt";
    }
}

// Grass Particle
export class Grass extends Sand {
    constructor() {
        super();
        this.color = "green";
        this.type = "grass"
    }
}

// Fire Particle
export class Fire extends Particle {
    constructor() {
        super();
        const fireShades = ["#FF4500","#FF6347","#FF7F50","#FF8C00","#FFA500","#FFD700","#FFFF33","#FF3333","#FF6666","#FF9900"];
        const randomShade = Math.floor(Math.random() * fireShades.length);
        this.color = fireShades[randomShade];
        this.type = "fire";
        this.duration = 0;
        this.maxDuration = 10;
    }

    update(row, col) {
    const directions = [
        [ -1, 0 ], [ -1, -1 ], [ -1, 1 ], [ 0, -1 ], [ 0, 1 ]];

    for (let [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        const target = getParticle(newRow, newCol);

        if (target?.type === "wood" && Math.random() < 0.1) { 
            setParticle(newRow, newCol, new Fire());
        }

    }

        this.duration++;

        if (this.duration >= this.maxDuration) {
            setParticle(row, col, null);
            return;
        }

        if (!getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, this.swap);
        }
    }

}

// Wood Particle
export class Wood extends Stone {
    constructor() {
        super();
        this.color = "saddlebrown";
        this.type = "wood";
    }
}

// Steam Particle
export class Steam extends Particle {
    constructor() {
        super();
        this.color = "gray";
        this.type = "steam";
        this.duration = 0;
        this.maxDuration = 850;
    }

    swap(other) {
        return other.type == 'water';
    }

    update(row, col) {
        this.duration++;
        if (this.duration >= this.maxDuration) {
            setParticle(row, col, new Water());
            return;
        }

        if (!getRandomInt(0,3) && !getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, this.swap);
        }
        if (!getRandomInt(0,3) && !getParticle(row-1, col-1)) {
            moveParticle(row, col, row-1, col-1, this.swap);
        }
        if (!getRandomInt(0,3) && !getParticle(row-1, col+1)) {
            moveParticle(row, col, row-1, col+1, this.swap);
        }
        if (!getRandomInt(0,2) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, this.swap);
        }
        if (!getRandomInt(0,2) && !getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, this.swap);
        }
    }
}
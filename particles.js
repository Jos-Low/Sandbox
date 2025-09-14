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
        const randomIndex = Math.floor(Math.random() * sandShades.length);
        this.color = sandShades[randomIndex];
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
    return null;
}
// Water Particle
export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        if (getParticle(row+1, col)?.type == "Dirt") {
            setParticle(row+1, col, new Grass());
            setParticle(row, col, null);
            return;
        }


        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, super.swap);
        }

        if (getRandomInt(0,1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }

        if (!getRandomInt(0, 4) && !getParticle(row+1, col+1)) {
            moveParticle(row, col, row+1, col+1, super.swap);       // Diagonal right
        }

        if (!getRandomInt(0, 4) && !getParticle(row+1, col-1)) {
            moveParticle(row, col, row+1, col-1, super.swap);       // Diagonal left
        }

        if (!getRandomInt(0,10) && !getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, super.swap);
        }

        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
    }
}

// Stone Particle
export class Stone extends Particle {
    constructor() {
        super();
        this.color = "gray";
        this.type = "Stone";
    }
}

// Dirt Particle
export class Dirt extends Sand {
    constructor() {
        super();
        const dirtShades = ["#5D4037","#6D4C41","#795548","#8D6E63","#804422cb","#272626ff"];
        const randomIndex = Math.floor(Math.random() * dirtShades.length);
        this.color = dirtShades[randomIndex];
        this.type = "Dirt";
    }
}

// Grass Particle
export class Grass extends Sand {
    constructor() {
        super();
        this.color = "green";
        this.type = "Grass"
    }
}

// Fire Particle
export class Fire extends Particle {
    constructor() {
        super();
        this.color = "red";
        this.type = "Fire";
        this.duration = 0;
        this.maxDuration = 10;
    }

    update(row, col) {
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
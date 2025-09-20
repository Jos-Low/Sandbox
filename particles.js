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
        return other.type == 'water' || other.type == 'oil';
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
    else if (value == "Oil") {
        return new Oil();
    }
    else if (value == "Explosive") {
        return new Explosive();
    }
    else if (value == "Lava") {
        return new Lava();
    }
    else if (value == "Basalt") {
        return new Basalt();
    }
    else if (value == "Eraser") {
        return new Eraser();
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

        if (getParticle(row+1, col)?.type === "steam") {
            moveParticle(row, col, row+1, col, () => true);
            return;
        }

        if (!getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, this.swap);
            return;
        }

        if (Math.random() <= .5) {
            if (!getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, this.swap);
            return;
            }
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, this.swap);
            return;
        }

        if (!getParticle(row+1, col+1)) {
            moveParticle(row, col, row+1, col+1, this.swap);   
            return;
        }

        if (!getParticle(row+1, col-1)) {
            moveParticle(row, col, row+1, col-1, this.swap);      
            return;
        }

        if (Math.random() < 0.1 && !getParticle(row-1, col)) {
            moveParticle(row, col, row-1, col, this.swap);
            return;
        }
    }
}


// Stone Particle
export class Stone extends Particle {
    constructor() {
        super();
        let stoneShade
        if (Math.random() < .8) {
            stoneShade = "gray";
        }
        else {
            stoneShade = "darkgray";
        }
        this.color = stoneShade;
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
        this.growth = 0;
        this.maxGrowth = 50; 
    }

    update(row, col) {
        if (getParticle(row-1, col)?.type === "water") {
            this.growth += 1;
        }

        if (this.growth >= this.maxGrowth) {
            setParticle(row, col, new Grass());
        }

        super.update(row, col);
    }
}


// Grass Particle
export class Grass extends Sand {
    constructor() {
        super();
        let grassShade = "green";
        if (Math.random() <= 0.5) {
            grassShade = "limegreen";
        }
        this.color = grassShade;
        this.type = "grass";
    }

    update(row, col) {
        if (row > 0) {
            const above = getParticle(row - 1, col);

            if (above && above.type !== "water" && above.type !== "steam" && above.type !== "oil") {
                setParticle(row, col, new Dirt());
                return;
            }
        }

        super.update(row, col);
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
        const directions = [[-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [1, -1], [1, 1]];

        for (let [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (!checkBounds(newRow, newCol)) continue; 

            const target = getParticle(newRow, newCol);

            if (target?.type === "wood" && Math.random() < 0.09) { 
                setParticle(newRow, newCol, new Fire());
            }

            if (target?.type === "oil") {
                setParticle(newRow, newCol, new Fire());
            }

            if (target?.type === "water") {
                setParticle(newRow, newCol, new Steam());
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
        let woodShade = "rgba(117, 67, 27, 0.82)";
        if (Math.random() < 0.5) {
            woodShade = "#5A381E";
        }
        else if (Math.random() < 0.1) {
            woodShade = "burlywood";
        }
        this.color = woodShade;
        this.type = "wood";
    }
}

// Steam Particle
export class Steam extends Particle {
    constructor() {
        super();
        this.color = "lightgray";
        this.type = "steam";
        this.duration = 0;
        this.maxDuration = 1000;
    }

    update(row, col) {
        this.duration++;
        if (this.duration >= this.maxDuration && Math.random() <= 0.8) {
            setParticle(row, col, new Water());
            return;
        }
        if (getParticle(row-1, col)?.type === "water") {
            moveParticle(row, col, row-1, col, () => true);
            return;
        }
        else if (getParticle(row-1, col-1)?.type === "water") {
            moveParticle(row, col, row-1, col-1, () => true);
            return;
        }
        else if (getParticle(row-1, col+1)?.type === "water") {
            moveParticle(row, col, row-1, col+1, () => true);
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

// Oil Particle
export class Oil extends Water {
    constructor() {
        super();
        this.color = "black";
        this.type = "oil";
    }

    update(row, col) {
        if (getParticle(row-1, col)?.type === "water") {
            moveParticle(row, col, row-1, col, () => true);
            return;
        }
        if (Math.random() <= .5) {
            if (getParticle(row, col+1)?.type === "water") {
                moveParticle(row, col, row, col+1, () => true);
                return;
            }
        }
        else if (getParticle(row, col-1)?.type === "water") {
                moveParticle(row, col, row, col-1, () => true);
                return;
            }

        super.update(row, col);
    }
}

// Explosive
export class Explosive extends Particle {
    constructor() {
        super();
        let explosiveShade = "red";
        if (Math.random() <= 0.3) {
            explosiveShade = "firebrick";
            if (Math.random() <= 0.1) {
                explosiveShade = "black";
            }
        }
        this.color = explosiveShade;
        this.type = "explosive";
    }

update(row, col) {
        const directions = [
            [-1, 0], [-1, -1], [-1, 1],
            [0, -1], [0, 1],
            [1, 0], [1, -1], [1, 1]
        ];

        let touchingFire = false;
        for (let [dRow, dCol] of directions) {
            const nRow = row + dRow;
            const nCol = col + dCol;
            if (!checkBounds(nRow, nCol)) continue;
            const neighbor = getParticle(nRow, nCol);
            if (neighbor?.type === "fire") {
                touchingFire = true;
                break;
            }
        }

        if (!touchingFire) return; 

        const radius = 15;

        // Loop over square radius
        for (let dRow = -radius; dRow <= radius; dRow++) {
            for (let dCol = -radius; dCol <= radius; dCol++) {
                const nRow = row + dRow;
                const nCol = col + dCol;

                if (!checkBounds(nRow, nCol)) continue;

                // Create circle radius
                const distance = Math.sqrt(dRow * dRow + dCol * dCol);
                const randomness = Math.random() * 1.5; 
                if (distance + randomness <= radius) {
                    const target = getParticle(nRow, nCol);

                    // Destroy other blocks (anything that is not an explosive)
                    if (!target || (target.type !== "explosive" && target.type !== "basalt")) {
                        setParticle(nRow, nCol, new Fire());
                        setParticle(row, col, null);
                    }
                }
            }
        }
    }
}

// Lava
export class Lava extends Water {
    constructor() {
        super()
        this.color = "orangered";
        this.type = "lava"
    }

    update(row, col) {
        const directions = [[-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [1, -1], [1, 1]];

        for (let [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (!checkBounds(newRow, newCol)) continue; 

            const target = getParticle(newRow, newCol);

            if (target?.type === "wood" || target?.type === "oil" || target?.type === "explosive") { 
                setParticle(newRow, newCol, new Fire());
            }

            if (target?.type === "water") {
                setParticle(newRow, newCol, new Basalt());
                if (!getParticle(newRow-1, newCol)) {
                    setParticle(newRow, newCol, new Steam())
                }
            }

        }

        super.update(row, col)
    }
}

// Basalt
export class Basalt extends Stone {
    constructor() {
        super()
        let basaltShade = "#1E1E1E";
        if (Math.random() < 0.4) {
            basaltShade = "black";
        }
        else if (Math.random() < 0.2) {
            basaltShade = "#2B2B2B";
        }
        else if (Math.random() < 0.4) {
            basaltShade = "darkslategray";
        }
        this.color = basaltShade;
        this.type = "basalt";
    }
}

// Eraser
export class Eraser extends Particle {
    constructor() {
        super()
        this.color = "red";
        this.type = "eraser";
    }

    update(row, col) {
        setParticle(row, col, null)
    }
}
class Bygning {
    constructor(type) {
        this.type = type; // "hus" eller "hotel"

        // Grafikstørrelse
        this.bredde = 10;
        this.højde = 10;
    }

    tegn(x, y, vinkel = 0) {
        push();
        translate(x, y);
        rotate(vinkel);
        rectMode(CENTER);
    
        if (this.type === "hus") {
            fill("green");
            stroke(0);
            strokeWeight(1);
            rect(-this.bredde/2-2, -this.højde/2-2, this.bredde, this.højde);
        }
        else if (this.type === "hotel") {
            fill("red");
            stroke(0);
            strokeWeight(1);
            rect(0, 0, this.bredde + 5, this.højde + 5);
            // evt. lille tag:
            fill(255);
            triangle(-10, -5, 10, -5, 0, -15);
        }
        pop();
    }
    
}

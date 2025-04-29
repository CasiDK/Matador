class BryggeriFelt extends Felt{
    constructor(id,brætDiameter,midtX,midtY){
        super(id,brætDiameter,midtX,midtY);
        this.navn="Bryggeri";
        this.pantsat=false;
        this.pantsatVærdi=0;
        this.pris=0;
        this.leje={
            etBryggeri:100,
            toBryggerier:200
        }
        this.aktivLejeSats="etBryggeri";
        this.ejer =null;
    }
    købGrund(nyEjer){
        if(this.ejer!=null){ //hvis det ikke er banken der ejer, så fjern grunden fra den gamle spiller
            this.ejer.grunde.splice(this,1);
        }
        this.ejer=nyEjer;
        this.ejer.grunde.push(this);
    }
    visSkøde(posX, posY) {
        let indentPosX = 5;
        let indentPosY = 5;
        let linjeAfstand = 20;
        push();
            // Tegner rammen
            fill("lightblue");
            strokeWeight(2);
            rect(posX, posY, 200, 300);
            
            // Farvefeltet
            fill(this.farve); // evt. anden farve hvis du vil
            rect(indentPosX + posX, indentPosY + posY, 190, 70);
    
            // Skriver navn
            fill('black');
            textSize(20);
            textAlign(CENTER, CENTER);
            text(this.navn, posX + indentPosX + (190-indentPosX)/2, posY + indentPosY +(70-indentPosY)/2);
    
            // Pris
            textSize(15);
            text("Pris: " + this.pris + " kr.", posX + indentPosX + (190-indentPosX)/2, posY + indentPosY + (70-indentPosY)/2+ linjeAfstand);
    
            // Lejeafsnit
            textAlign(LEFT, BOTTOM);
            //textSize(14);
            //let keys = Object.keys(this.leje);
            let startY = posY + indentPosY + 150;
            text("Hvis 1 virksomhed ejes,\nbetales 100 gange så\nmeget som terningerne\nviser.", posX + 2 * indentPosX, startY);
            //textAlign(RIGHT, BOTTOM);
            //text(this.leje.etBryggeri + " kr.", posX + indentPosX + 190, startY);
    
            textAlign(LEFT, BOTTOM);
            text("Hvis både Faxe & Harboe\nejes, betales 200 gange så\nmeget som terningerne viser", posX + 2 * indentPosX, startY + 3*linjeAfstand);
            //textAlign(RIGHT, BOTTOM);
           // text(this.leje.toBryggerier + " kr.", posX + indentPosX + 190, startY + linjeAfstand);
    
            // Pantsætningsværdi
            stroke('black');
            line(posX + indentPosX, startY + 3 * linjeAfstand + 10, posX + 195, startY + 3 * linjeAfstand + 10);
            noStroke();
            textAlign(LEFT, BOTTOM);
            text("Pantsætningsværdi", posX + 2 * indentPosX, startY + 5 * linjeAfstand);
            textAlign(RIGHT, BOTTOM);
            text(this.pantsatVærdi + "kr.", posX + indentPosX + 190, startY + 5 * linjeAfstand);
    
            // Ejer-info
            textStyle(BOLD);
            textAlign(LEFT, BOTTOM);
            if (this.ejer != null) {
                text("Ejes af: " + this.ejer.navn, posX + 2 * indentPosX, startY + 7 * linjeAfstand);
            } else {
                text("Ejes af: Banken", posX + 2 * indentPosX, startY + 7 * linjeAfstand);
            }
    
            // Pantsat-overlay
            if (this.pantsat){
                push();
                    fill(169,169,169,170); //gråt overlay
                    rect(posX,posY,200,300);
                    translate((posX+200)/2,(posY+300)/2); //sætter 0,0 i midten af skødet
                    push();
                        rotate(2*PI/8);
                        fill('red');
                        textSize(25);
                        textAlign(CENTER,CENTER);
                        text("PANTSAT",-10,-40);
                    pop();
                    fill('red');
                    stroke("yellow");
                    textSize(17);
                    textAlign(CENTER,CENTER);
                    text("Køb fri for \n"+Math.floor(this.pantsatVærdi*1.1)+"kr.",10,40+3*linjeAfstand);
                pop();
            }
        pop();
    }
    
}
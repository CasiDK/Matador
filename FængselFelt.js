class FængselFelt extends Felt{
    constructor(id,brætDiameter,midtX,midtY){
        super(id,brætDiameter,midtX,midtY);
        this.navn="Fængsel";
        
    }
    visSkøde(posX,posY){
        let indentPosX=5;
        let indentPosY=5;
        let linjeAfstand=20;
        push();
            //tegner rammen
            fill("lightblue");
            strokeWeight(2);
            rect(posX,posY,200,300);
            fill(this.farve);
            rect(indentPosX+posX,indentPosY+posY,190,70);
            //skriver navn
            fill('black')
            textSize(20);
            textAlign(CENTER,CENTER);
            text(this.navn,(posX+indentPosX+(190-indentPosX)/2),posY+indentPosY+(70-indentPosY)/2);
            
            for(let i=0;i<this.spillere.length;i++){
                let spiller = this.spillere[i];
                if(spiller.fængslet){
                    textSize(12);
                    textAlign(LEFT,BOTTOM);
                    text(spiller.navn,posX+2*indentPosX,posY+indentPosY+(i+5)*linjeAfstand);
                    textAlign(RIGHT,BOTTOM);
                    text(spiller.venteRunder+" runder tilbage",posX+indentPosX+190,posY+indentPosY+(5+i)*linjeAfstand);
                } 
            }

        pop();
    }
}
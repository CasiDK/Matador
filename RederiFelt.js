class RederiFelt extends Felt{
    constructor(id,brætDiameter,midtX,midtY){
        super(id,brætDiameter,midtX,midtY);
        this.navn="REDERI";
        this.farve="coral";
        this.ejer=null;
        this.pris=0;
        this.leje ={
            enBåd:500,
            toBåde:1000,
            treBåde:2000,
            fireBåde:4000
        }
        this.pantsat=false;
        this.pantsatVærdi=0;
        this.pris=0;
        this.aktivLejeSats="enBåd";
    }
    købGrund(nyEjer){
        if(this.ejer!=null){ //hvis det ikke er banken der ejer, så fjern grunden fra den gamle spiller
            this.ejer.grunde.splice(this,1);
        }
        this.ejer=nyEjer;
        this.ejer.grunde.push(this);
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
            //Skriver prisen
            textSize(15);
            text("Pris: "+this.pris+"kr.",posX+indentPosX+(190-indentPosX)/2,posY+indentPosY+(70-indentPosY)/2+linjeAfstand);
            //Skriver lejepriserne
            let keyArray=Object.keys(this.leje);
            for(let i=0;i<keyArray.length;i++){
                let tekst;
                if(i==0){
                    tekst=" Rederi";
                }
                else{
                    tekst=" Rederier"
                }
                textAlign(LEFT,BOTTOM);
                text((1+i)+tekst,posX+2*indentPosX,posY+indentPosY+(i+5)*linjeAfstand);
                textAlign(RIGHT,BOTTOM);
                text(this.leje[keyArray[i]]+"kr.",posX+indentPosX+190,posY+indentPosY+(i+5)*linjeAfstand);
            }
            // Skriver bebyggelsepris
            stroke('black');
            line(posX+indentPosX,posY+indentPosY+12*linjeAfstand,posX+195,posY+indentPosY+12*linjeAfstand);
            noStroke();
            //Pantsættes for
            textAlign(LEFT,BOTTOM);
            text("Pantsætningsværdi",posX+2*indentPosX,posY+indentPosY+13*linjeAfstand);
            textAlign(RIGHT,BOTTOM);
            text(this.pantsatVærdi+"kr.",posX+indentPosX+190,posY+indentPosY+13*linjeAfstand);
            //ejes af:
            textStyle(BOLD);
            textAlign(LEFT,BOTTOM);
            if(this.ejer!=null){
                text("Ejes af: "+this.ejer.navn,posX+2*indentPosX,posY+indentPosY+14*linjeAfstand);
            }
            else{
                text("Ejes af: Banken",posX+2*indentPosX,posY+indentPosY+14*linjeAfstand);
            }
            
            // Pantsat overlay
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
class GrundFelt extends Felt{
    constructor(id,brætDiameter,midtX,midtY){
        super(id,brætDiameter,midtX,midtY);
        this.huse=[];
        this.hoteller=[];
        this.ejer=null;
        this.leje = {
                base:0,
                etHus:0,
                toHuse:0,
                treHuse:0,
                fireHuse:0,
                hotel:0
            };
        this.pantsat=false;
        this.pantsatVærdi=0;
        this.bebyggelsesPris=0;
        this.pris=0;
        this.aktivLejeSats="base";
        this.ubebyggetEjesAlle=false;
    }
    købGrund(nyEjer){
        if(this.ejer!=null){ //hvis det ikke er banken der ejer, så fjern grunden fra den gamle spiller
            this.ejer.grunde.splice(this,1);
        }
        this.ejer=nyEjer;
        this.ejer.grunde.push(this);
    }
    tegnBygninger() {
        push();
        let radiusIndre = this.brætDiameter * 0.6 / 2;
        let radiusYdre = this.brætDiameter / 2;
    
        let antalBygninger = this.huse.length + this.hoteller.length;
        let afstand = (radiusYdre - radiusIndre) / (antalBygninger + 1);
    
        let bygningIndex = 0;
    
        // Først huse
        for (let i = 0; i < this.huse.length; i++) {
            let r = radiusIndre + (bygningIndex + 1) * afstand;
            let x = this.midtX + r * cos(this.vinkelSlut);
            let y = this.midtY + r * sin(this.vinkelSlut);
            this.huse[i].tegn(x, y,this.vinkelSlut);
            bygningIndex++;
        }
    
        // Så hoteller
        for (let i = 0; i < this.hoteller.length; i++) {
            let r = radiusIndre + (bygningIndex + 1) * afstand;
            let x = this.midtX + r * cos(this.vinkelSlut);
            let y = this.midtY + r * sin(this.vinkelSlut);
            this.hoteller[i].tegn(x, y,this.vinkelSlut);
            bygningIndex++;
        }
    
        pop();
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
                if(i==0){
                    textAlign(LEFT,BOTTOM);
                    text("Leje",posX+2*indentPosX,posY+indentPosY+(i+5)*linjeAfstand);
                    textAlign(RIGHT,BOTTOM);
                    text(this.leje.base+"kr.",posX+indentPosX+190,posY+indentPosY+(5+i)*linjeAfstand);
                }
                else if (i==keyArray.length-1){
                    textAlign(LEFT,BOTTOM);
                    text("Hotel",posX+2*indentPosX,posY+indentPosY+(i+5)*linjeAfstand);
                    textAlign(RIGHT,BOTTOM);
                    text(this.leje[keyArray[i]]+"kr.",posX+indentPosX+190,posY+indentPosY+(i+5)*linjeAfstand);
                }
                else {
                    let tekst;
                    if(i==1){
                        tekst=" Hus";
                    }
                    else{
                        tekst=" Huse"
                    }
                    textAlign(LEFT,BOTTOM);
                    text(i+tekst,posX+2*indentPosX,posY+indentPosY+(i+5)*linjeAfstand);
                    textAlign(RIGHT,BOTTOM);
                    text(this.leje[keyArray[i]]+"kr.",posX+indentPosX+190,posY+indentPosY+(i+5)*linjeAfstand);
                }
            }
            // Skriver bebyggelsepris
            stroke('black');
            line(posX+indentPosX,posY+indentPosY+10*linjeAfstand,posX+195,posY+indentPosY+10*linjeAfstand);
            noStroke();
            textAlign(LEFT,BOTTOM);
            text("Bebyggelse",posX+2*indentPosX,posY+indentPosY+12*linjeAfstand);
            textAlign(RIGHT,BOTTOM);
            text(this.bebyggelsesPris+"kr.",posX+indentPosX+190,posY+indentPosY+12*linjeAfstand);
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
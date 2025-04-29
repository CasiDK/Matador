class Felt{
    constructor(id,brætDiameter,midtX,midtY){
        this.farve='lightblue';
        this.navn='Parkering \uD83C\uDD7F\uFE0F';//parkeringssymbol
        //this.pos; // i koordinater
        this.id=id; // id i et array til tegning af bræt (0;39)
        this.spillere=[];
        this.vinkelStart=2*PI/40*(this.id-1);
        this.vinkelSlut=2*PI/40*this.id;
        this.vinkelMidte=(this.vinkelStart+this.vinkelSlut)/2
        this.brætDiameter=brætDiameter;
        this.midtX=midtX;
        this.midtY=midtY;
    }
    erMusOver(){
        // Beregn musens position relativt til centrum
        let dx = mouseX - this.midtX;
        let dy = mouseY - this.midtY;
        let afstand = sqrt(dx * dx + dy * dy);
        let vinkel = atan2(dy, dx);
        if (vinkel < 0) vinkel += 2*PI; // sørg for vinkel er mellem 0 og 2pi i radianer

        let radiusYdre = this.brætDiameter / 2;
        let radiusIndre = this.brætDiameter * 0.6 / 2;

        return (
            vinkel >= this.vinkelStart &&
            vinkel < this.vinkelSlut &&
            afstand >= radiusIndre &&
            afstand <= radiusYdre
        );
    }
    tegnFelt(){
        push();
            //highlight og farve
            let highlight=this.erMusOver();
            let linjeFarve='black';
            if(highlight){
                linjeFarve="yellow";
                //console.log(this);
            }
            else{
                linjeFarve='black';
            }
            strokeWeight(3);
            stroke(linjeFarve);
            //tegner feltet
            fill(this.farve); 
            beginShape();
                //Første bue (indre)
                for(let v=this.vinkelStart;v<=this.vinkelSlut;v+=0.01){ //løber igennem alle vinkler i feltet
                    let x=(this.brætDiameter/2*0.6)*cos(v)+this.midtX;
                    let y=(this.brætDiameter/2*0.6)*sin(v)+this.midtY;
                    vertex(x,y); //tegner punktet
                }
                //Anden bue (ydre)
                for(let v=this.vinkelSlut; v>=this.vinkelStart; v-=0.01){ 
                    let x=(this.brætDiameter/2)*cos(v)+this.midtX;
                    let y=(this.brætDiameter/2)*sin(v)+this.midtY;
                   vertex(x,y);
                }
            endShape(CLOSE);
        //SPILLERNE:
            for (let i=0;i<this.spillere.length;i++){
                let afstand = (this.brætDiameter/2-this.brætDiameter*0.6/2)/5; // max spillere er 4.
                let x = this.midtX+(this.brætDiameter*0.6/2+(i+1)*afstand)*cos(this.vinkelMidte);
                let y = this.midtY+(this.brætDiameter*0.6/2+(i+1)*afstand)*sin(this.vinkelMidte);
                this.spillere[i].tegnBrik(x,y);
            }
            //Tekst på feltet:
            push()
                translate(this.midtX+(this.brætDiameter/2)*cos(this.vinkelMidte),(this.brætDiameter/2)*sin(this.vinkelMidte)+this.midtY)
                rotate(this.vinkelMidte);
                textAlign(RIGHT,CENTER);
                strokeWeight(1);
                if (this.farve!='black'){
                    fill('black');
                }
                else{
                    fill('white');
                }
                textSize(15);
                text(this.navn+' ',0,0);
            pop();
            //tal ud for feltet
            push();
                translate(this.midtX+((this.brætDiameter*0.6)/2)*cos(this.vinkelMidte),((this.brætDiameter*0.6)/2)*sin(this.vinkelMidte)+this.midtY)
                rotate(this.vinkelMidte);
                textAlign(RIGHT,CENTER);
                strokeWeight(1);
                fill('black');
                textSize(15);
                text(this.id+' ',0,0);
            pop();
        pop();
    }
}
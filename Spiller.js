class Spiller {
    constructor(navn,farve,startFelt){
        this.farve=farve;
        //this.brik= new Brik(this.farve,startFelt);
        this.navn=navn;
        this.saldo=30000;
        this.tur=false;
        this.grunde=[];
        this.felt=startFelt;
        this.felt.spillere.push(this);
        this.diameter=20;
        this.fængslet=false;
        this.venteRunder=2;
        this.gemteBenådelseskort=[];

    }
    flytBrik(nytFelt){
        this.felt.spillere.splice(this.felt.spillere.indexOf(this),1) //fjerner sig selv fra det gamle felts array
        nytFelt.spillere.push(this); //lægger sig selv ind på det nye felt
        //console.log("Fjernede sig selv fra felt nr: "+ this.felt.id + " og indsatte sig på felt nr: "+ nytFelt.id);
        this.felt=nytFelt;
    }
    tegnBrik(x,y){
        push();
        stroke('yellow');
        strokeWeight(1);
        fill(this.farve);
        circle(x,y,this.diameter);
        pop();
    }
    visInfo(x,y){
        push();
        fill(this.farve);
        rect(x,y,250,130);
        fill('#272727');
        rect(x,y+35,250,130-35)
        textSize(15);
        textAlign(LEFT);
        fill('white');
        text(this.navn,x+10,y+20);
        textAlign(RIGHT)
        text(this.saldo+"kr.",x+250,y+20);
        strokeWeight(1);
        stroke('black');
        line(x,y+35,x+250,y+35);
        noStroke();
        for (let i=0;i<this.grunde.length;i++){
            textStyle(BOLD);
            textSize(10);
            if(i<6){
                textAlign(LEFT);
                fill(this.grunde[i].farve);
                text(this.grunde[i].navn,x+10,y+45+15*i);
            }
            else{
                textAlign(RIGHT);
                fill(this.grunde[i].farve);
                text(this.grunde[i].navn,x+250-10,y+45+15*i-(6*15));//4*15, da der allerede er skrevet 4 linjer til venstre
                //text(this.grunde[i].navn,)
            }
            
        }
        pop();
    }
    erFallit() {
        let netWorth=this.saldo;
        for (const grund of this.grunde) {
            if(grund instanceof GrundFelt){
                let husLængde = grund.huse.length
                let hotelLængde = grund.hoteller.length
                netWorth+=((grund.bebyggelsesPris/2)*husLængde+(grund.bebyggelsesPris/2)*5*hotelLængde);
            }
            if(!grund.pantsat) netWorth +=grund.pantsatVærdi;
        }
        if (netWorth >= 0) {
            return false;
        } else {
            return true;
        }
    }
}
class HandelsBoks {
    constructor(spiller1, spiller2, alleFelter) {
        this.spiller1 = spiller1;
        this.spiller2 = spiller2;
        this.alleFelter = alleFelter; // listen over ALLE felter på brættet

        this.spiller1HandelbareGrunde = [];
        this.spiller2HandelbareGrunde = [];

        this.knapperGrundeSpiller1 = [];
        this.knapperGrundeSpiller2 = [];

        this.valgteGrundeSpiller1 = [];
        this.valgteGrundeSpiller2 = [];

        this.knapGodkend1 = new Knap(200, windowHeight - 80, "Godkend", "red", 20);
        this.knapGodkend2 = new Knap(windowWidth - 300, windowHeight - 80, "Godkend", "red", 20);
        this.knapAnnuller= new Knap(windowWidth/2-50,windowHeight-80,"Annuller","red",20);

        this.spiller1Godkendt=false;
        this.spiller2Godkendt=false;

        this.slider1=createSlider(0,this.spiller1.saldo,0,50);
        this.slider2=createSlider(0,this.spiller2.saldo,0,50);
       

        this.beregnHandelbareGrunde();
    }

    beregnHandelbareGrunde() {
        // Find alle handelbare grunde for begge spillere
        for (let grund of this.spiller1.grunde) {
            if (this.erHandelbar(grund)) {
                this.spiller1HandelbareGrunde.push(grund);
            }
        }
        for (let grund of this.spiller2.grunde) {
            if (this.erHandelbar(grund)) {
                this.spiller2HandelbareGrunde.push(grund);
            }
        }

        // Lav knapper for grunde
        let offsetY = 200;
        for (let grund of this.spiller1HandelbareGrunde) {
            let knap = new Knap(50, offsetY, grund.navn, "white", 16);
            this.knapperGrundeSpiller1.push({ knap: knap, grund: grund });
            offsetY += 40;
        }

        offsetY = 200;
        for (let grund of this.spiller2HandelbareGrunde) {
            let knap = new Knap(windowWidth - 350, offsetY, grund.navn, "white", 16);
            this.knapperGrundeSpiller2.push({ knap: knap, grund: grund });
            offsetY += 40;
        }
    }

    erHandelbar(grund) {
        if(grund instanceof GrundFelt){
            if (grund.huse.length > 0 || grund.hoteller.length > 0) return false;
    
            // Ingen andre grunde i samme farvegruppe må være bebygget
            for (let andetFelt of this.alleFelter) {
                if (andetFelt.farve === grund.farve) {
                    if (andetFelt.huse.length > 0 || andetFelt.hoteller.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true; 
    }

    tegn() {
        // Baggrund
        fill(0, 0, 0, 150);
        rect(0, 0, windowWidth, windowHeight);

        fill("white");
        rect(30, 30, windowWidth - 60, windowHeight - 60, 20);

        textAlign(CENTER, TOP);
        textSize(24);
        fill(0);
        text("Handel",windowWidth/2,50);
        stroke(4);
        line(windowWidth/2,100,windowWidth/2,windowHeight - 100);
        noStroke();
        text(this.spiller1.navn, 150, 50);
        text(this.spiller2.navn, windowWidth - 150, 50);
        //tegn sliders
        this.slider1.position(50,100);
        this.slider2.position(windowWidth - 350,100);
        textAlign(LEFT);
        text(this.slider1.value()+"kr.",50,140);
        text(this.slider2.value()+"kr.",windowWidth - 350,140);
        // Tegn grund-knapper
        for (let obj of this.knapperGrundeSpiller1) {
            if (this.valgteGrundeSpiller1.includes(obj.grund)) {
                obj.knap.farve = "lightgreen";
            } else {
                obj.knap.farve = "white";
            }
            obj.knap.tegn();
        }

        for (let obj of this.knapperGrundeSpiller2) {
            if (this.valgteGrundeSpiller2.includes(obj.grund)) {
                obj.knap.farve = "lightgreen";
            } else {
                obj.knap.farve = "white";
            }
            obj.knap.tegn();
        }
        this.knapGodkend1.farve = this.spiller1Godkendt? "lightgreen":"red";
        this.knapGodkend2.farve = this.spiller2Godkendt? "lightgreen":"red";
        // Tegn godkend knapper
        this.knapGodkend1.tegn();
        this.knapGodkend2.tegn();
        this.knapAnnuller.tegn();
    }

    klik() {
        // Tjek klik på spiller1s grunde
        for (let obj of this.knapperGrundeSpiller1) {
            if (obj.knap.erMusOver()) {
                let index = this.valgteGrundeSpiller1.indexOf(obj.grund);
                if (index === -1) { //hvis grunden ikke allerede er godkendt
                    this.valgteGrundeSpiller1.push(obj.grund);
                } else {
                    this.valgteGrundeSpiller1.splice(index, 1); //fjerner grunden igen
                }
                return;
            }
        }

        // Tjek klik på spiller2s grunde
        for (let obj of this.knapperGrundeSpiller2) {
            if (obj.knap.erMusOver()) {
                let index = this.valgteGrundeSpiller2.indexOf(obj.grund);
                if (index === -1) { //samme som før :D
                    this.valgteGrundeSpiller2.push(obj.grund);
                } else {
                    this.valgteGrundeSpiller2.splice(index, 1);
                }
                return;
            }
        }

        // Tjek klik på godkend knapper
        if (this.knapGodkend1.erMusOver()) {
            this.spiller1Godkendt= !this.spiller1Godkendt;
            //console.log(`${this.spiller1.navn} godkendte handlen.`);
            if(this.færdiggørHandel()) return true;
        }

        if (this.knapGodkend2.erMusOver()) {
            
            //console.log(`${this.spiller2.navn} godkendte handlen.`);
            this.spiller2Godkendt= !this.spiller2Godkendt;
            if(this.færdiggørHandel()) return true;
            
        }
        //tjek på annuller
        if (this.knapAnnuller.erMusOver()){
            this.slider1.remove(); //fjerner sliders, de er p5.elements ligesom canvas er.
            this.slider2.remove();
            return true;
        }
        return false;
    }
    færdiggørHandel(){
        if(this.spiller1Godkendt && this.spiller2Godkendt){
            for (const valgtGrund of this.valgteGrundeSpiller1) {
                valgtGrund.købGrund(this.spiller2);
                console.log(this.spiller2.grunde);
            }
            for (const valgtGrund of this.valgteGrundeSpiller2) {
                valgtGrund.købGrund(this.spiller1);
                console.log(this.spiller1.grunde);
            }
            this.spiller1.saldo+=-1*this.slider1.value()+this.slider2.value();
            this.spiller2.saldo+=-1*this.slider2.value()+this.slider1.value();
        


            this.slider1.remove(); //fjerner sliders, de er p5.elements ligesom canvas er.
            this.slider2.remove();
            return true
        }
    }
}

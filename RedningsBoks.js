class RedningsBoks {
    constructor(spiller, kreditor, alleFelter,kredit) {
        this.spiller = spiller;
        this.kreditor = kreditor;
        this.alleFelter = alleFelter;
        this.kredit=kredit;

        this.knapperGrunde = [];
        this.knapperBygninger = [];

        this.valgteGrunde = [];
        this.valgteBygninger =[];
        this.knapBekræft = new Knap(windowWidth/2 - 100, windowHeight - 100, "Bekræft", "red", 20);
        this.knapFallit = new Knap(windowWidth/2 + 100, windowHeight - 100, "Giv op", "red", 20);

        this.lavKnapper();
    }

    lavKnapper() {
        let offsetY = 200;
        let offsetX = 50;
        for (let grund of this.spiller.grunde) {
            // Lav en knap for selve grunden
            offsetX=50;
            let knapGrund = new Knap(offsetX, offsetY, grund.navn, "white", 16);
            this.knapperGrunde.push({ knap: knapGrund, grund: grund });

            offsetY += 40;

            // Lav knapper for bygninger (huse/hoteller)
            for (let i = 0; i < grund.huse.length; i++) {
                let knapByg = new Knap(offsetX, offsetY, "Hus", grund.farve, 12);
                this.knapperBygninger.push({ knap: knapByg, grund: grund, type: "hus" });
                offsetX += 30;
            }
            for (let i = 0; i < grund.hoteller.length; i++) {
                let knapByg = new Knap(offsetX, offsetY, "Hotel", grund.farve, 12);
                this.knapperBygninger.push({ knap: knapByg, grund: grund, type: "hotel" });
                offsetX += 30;
            }
        }
    }

    tegn() {
        // Baggrund
        fill(0, 0, 0, 150);
        rect(0, 0, windowWidth, windowHeight);

        fill("white");
        rect(30, 30, windowWidth - 60, windowHeight - 60, 20);

        fill(0);
        textAlign(CENTER, TOP);
        textSize(24);
        text(this.spiller.navn + " er i pengenød!", windowWidth / 2, 50);
        text(this.spiller.navn + " mangler kr. "+(this.kredit-this.spiller.saldo),windowWidth/2,140);
        textSize(16);
        text("Klik på huse/hoteller for at sælge. Klik på grunde for at pantsætte.", windowWidth / 2, 90);
        
        

        // Tegn grund-knapper
        for (let obj of this.knapperGrunde) {
            if (this.valgteGrunde.includes(obj.grund)) {
                obj.knap.farve = "lightgreen";
            } else {
                obj.knap.farve = "white";
            }
            obj.knap.tegn();
        }
        // Tegn bygning-knapper
        for (let obj of this.knapperBygninger) {
            if (this.valgteBygninger.includes(obj.grund)) {
                obj.knap.farve = "lightgreen";
            } else {
                obj.knap.farve = "white";
            }
            obj.knap.tegn();
        }

        this.knapBekræft.tegn();
        this.knapFallit.tegn();
    }

    klik() {
        // Klik på bygninger
        for (let obj of this.knapperBygninger) {
            if (obj.knap.erMusOver()) {
                if (obj.type === "hus") {
                    obj.grund.huse.pop();
                    this.spiller.saldo += Math.floor(obj.grund.bebyggelsesPris / 2);
                } 
                else if (obj.type === "hotel") {
                    obj.grund.hoteller.pop();
                    obj.grund.huse.push(new Bygning("hus"));
                    obj.grund.huse.push(new Bygning("hus"));
                    obj.grund.huse.push(new Bygning("hus"));
                    obj.grund.huse.push(new Bygning("hus"));
                    this.spiller.saldo += Math.floor(obj.grund.bebyggelsesPris / 2);
                }
                this.refresh();
                return;
            }
        }

        // Klik på grunde
        for (let obj of this.knapperGrunde) {
            if (obj.knap.erMusOver()) {
                let grund = obj.grund;
                if (!grund.pantsat && grund.huse.length === 0 && grund.hoteller.length === 0) {
                    grund.pantsat = true;
                    this.spiller.saldo += grund.pantsatVærdi;
                }
                return;
            }
        }

        if (this.knapBekræft.erMusOver()) {
            if (this.spiller.saldo >= 0) {
                // Spilleren reddede sig
                //console.log(this.spiller.navn + " reddede sig selv!");
                return true;
            }
            else if (this.spiller.erFallit()) {
                // Spilleren er fallit
                //console.log(this.spiller.navn + " er gået fallit!");
                this.overdragEjendele();
                // Fjern spiller fra spil eller giv aktiver til kreditor
                return "fallit";
            }
            else {
                // Spilleren skal fortsætte redningsforsøg
                return false;
            }            
        }
        if (this.knapFallit.erMusOver()) {
            this.overdragEjendele();
            return "fallit";
        }

    }

    refresh() {
        this.knapperBygninger = [];
        this.knapperGrunde = [];
        this.lavKnapper();
    }

    overdragEjendele() {
        if (this.kreditor) {
            for (let grund of this.spiller.grunde) {
                grund.pantsat=true;
                grund.købGrund(this.kreditor);
            }
        } else {
            for (let grund of this.spiller.grunde) {
                grund.ejer = null; // tilbage til banken
            }
        }
        this.spiller.grunde = [];
    }
}

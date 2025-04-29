class Spil{
    constructor(antalSpillere, spillerNavne, spillerFarver){
        this.antalSpillere=antalSpillere;
        this.spillerNavne=spillerNavne; // [string,string,string]
        this.spillere=[];
        this.spillerFarver=spillerFarver
        this.centerX=windowWidth/2-100;
        this.centerY=windowHeight/2;
        this.diameter=windowHeight-50;
        this.terninger=[new Terning(20,windowHeight-90), new Terning(110,windowHeight-90)];
        this.knapper=[
            new Knap(20,windowHeight-160,"Rul Terninger","white",30),
            new Knap(20,windowHeight-220,"Næste tur","white",30)
        ];
        this.handelsKnapper=[];
        this.aktivHandel;
        this.felter=[];
        this.prøvLykkenKort=[];
        this.turIndex=0;
        this.slagTilladt=true;
        this.musTrykTilladt=true;
        this.terningerRullet=false;
        this.trukketPrøvLykkenKort=[];
        this.popup=null; //Popup
        this.købsPopupFelt=null; //Felt
        this.pendingFelt=null; //Felt
        this.pendingSkatFelt=null; //Felt
        this.konsol=new Konsol(windowWidth-370, windowHeight - 240, 350, 220);
        this.farveTæller={}; //{"white":3,"purple":2} osv.
        this.feltTilPantsætning=null; //Felt
        this.aktivRedningsBoks;

        for (let i=1;i<41;i++){
            //alle GrundFelter bliver dannet ud fra deres plads på brættet (id)
            if([2,4,7,9,10,12,14,15,17,19,20,22,24,25,27,28,30,32,33,35,38,40].includes(i)){
                this.felter.push(new GrundFelt(i,this.diameter,this.centerX,this.centerY)); 
              
            }
            else if([3,8,18,23,34,37].includes(i)){ //prøv lykken
                this.felter.push(new LykkeFelt(i,this.diameter,this.centerX,this.centerY));
            }
            else if([5,39].includes(i)){ //skatfelter
                this.felter.push(new SkatFelt(i,this.diameter,this.centerX,this.centerY));
            }
            else if([6,16,26,36].includes(i)){
                this.felter.push(new RederiFelt(i,this.diameter,this.centerX,this.centerY));
            }
            else if([13,29].includes(i)){
                this.felter.push(new BryggeriFelt(i,this.diameter,this.centerX,this.centerY));
            }
            else if(i==11){
                this.felter.push(new FængselFelt(i,this.diameter,this.centerX,this.centerY));
                
            }
            else{ //TODO: find index til de andre typer af felter.
                this.felter.push(new Felt(i,this.diameter,this.centerX,this.centerY));
    
            }
            
        }
        fetch('./Grunde.json')
            .then((response) => response.json())
            .then(data => {
                //GRUNDE
                for(let i=0;i<data.grunde.length;i++){
                    let id = data.grunde[i].id;
                    let felt = this.felter[id-1];
                    felt.navn=data.grunde[i].navn;
                    felt.farve=data.grunde[i].farve;
                    felt.leje=data.grunde[i].leje;
                    felt.pantsatVærdi=data.grunde[i].pantsatVærdi;
                    felt.bebyggelsesPris=data.grunde[i].bebyggelsespris;
                    felt.pris=data.grunde[i].pris;
                    felt.pantsat=data.grunde[i].pantsat;
                }
                //REDERIER
                for(let i=0;i<data.rederier.length;i++){
                    let id = data.rederier[i].id;
                    let felt = this.felter[id-1];
                    felt.navn=data.rederier[i].navn;
                    //felt.farve=data.rederier[i].farve;
                    felt.pantsatVærdi=data.rederier[i].pantsatVærdi;
                    felt.pris=data.rederier[i].pris;
                    felt.pantsat=data.rederier[i].pantsat;
                }
                //BRYGGERIER
                for(let i=0;i<data.bryggerier.length;i++){
                    let id = data.bryggerier[i].id;
                    let felt = this.felter[id-1];
                    felt.navn=data.bryggerier[i].navn;
                    felt.farve=data.bryggerier[i].farve;
                    felt.pantsatVærdi=data.bryggerier[i].pantsatVærdi;
                    felt.pris=data.bryggerier[i].pris;
                    felt.pantsat=data.bryggerier[i].pantsat;
                }
                //SKAT
                for(let i=0;i<data.skat.length;i++){
                    let id = data.skat[i].id;
                    let felt = this.felter[id-1];
                    felt.navn=data.skat[i].navn;
                    felt.skat=data.skat[i].skat;
                }
                //START
                this.felter[0].navn="START";
                this.felter[0].farve="rgb(133, 32, 44)";
                //gå i fængsel
                this.felter[30].navn="De fængsles \uD83D\uDC6E\u200D\u2642\uFE0F";
                //Farvetæller
                for (const felt of this.felter) {
                    if(felt instanceof GrundFelt){
                        if(this.farveTæller[felt.farve]==undefined){
                            this.farveTæller[felt.farve]=1;
                        }
                        else{
                            this.farveTæller[felt.farve]++;
                        }
                    }
                }
            });
            fetch('./Lykken.json')
            .then((response) => response.json())
            .then(data => {
              this.prøvLykkenKort = [];
          
              // BØDE
              for (let kortData of data.BØDE) {
                for (let i = 0; i < kortData.antal; i++) {
                  let kort = new BødeKort(kortData.id,this.centerX,this.centerY);
                  kort.tekst = kortData.tekst;
                  kort.straf = kortData.gevinst;
                  this.prøvLykkenKort.push(kort);
                }
              }
          
              // GEVINST
              for (let kortData of data.GEVINST) {
                for (let i = 0; i < kortData.antal; i++) {
                  let kort = new GevinstKort(kortData.id,this.centerX,this.centerY);
                  kort.tekst = kortData.tekst;
                  kort.gevinst = kortData.gevinst;
                  if (kortData.id == 14) {
                    kort.gevinst *= (this.antalSpillere - 1); // fødselsdag
                  }
                  this.prøvLykkenKort.push(kort);
                }
              }
          
              // PRISSTIGNING
              for (let kortData of data.PRISSTIGNING) {
                for (let i = 0; i < kortData.antal; i++) {
                  let kort = new StigningsKort(kortData.id,this.centerX,this.centerY);
                  kort.tekst = kortData.tekst;
                  kort.stigninger = kortData.stigninger;
                  this.prøvLykkenKort.push(kort);
                }
              }
          
              // RYK
              for (let kortData of data.RYK) {
                for (let i = 0; i < kortData.antal; i++) {
                  let kort = new RykKort(kortData.id,this.centerX,this.centerY);
                  kort.tekst = kortData.tekst;
                  kort.pengeOverStart = kortData.modtag_penge_over_start;
                  kort.destination = kortData.destination;
                  this.prøvLykkenKort.push(kort);
                }
              }
          
              // BENÅDELSE
              for (let kortData of data.BENÅDELSE) {
                for (let i = 0; i < kortData.antal; i++) {
                  let kort = new Kort(kortData.id,this.centerX,this.centerY); // evt. BenådelsesKort klasse
                  kort.tekst = kortData.tekst;
                  this.prøvLykkenKort.push(kort);
                }
              }
              this.kopiPrøvLykkenKort =this.prøvLykkenKort.map((x) => x); //gemmer en kopi til hvis alle kort bliver trukket
              this.blandKort(); //blander bunken af kortene
            });
            for (let i=0;i<this.antalSpillere;i++){
                this.spillere.push(new Spiller(this.spillerNavne[i],this.spillerFarver[i],this.felter[0]));
                this.handelsKnapper.push(new Knap(windowWidth-340,i*150+51,"\uD83E\uDD1D",this.spillere[i].farve,30));
            }
        this.spillere[this.turIndex].tur=true;
        
        
    }
    blandKort(){ //Fischer-Yates implementation i JS fra Stack-Overflow
        let currentIndex = this.prøvLykkenKort.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [this.prøvLykkenKort[currentIndex], this.prøvLykkenKort[randomIndex]] = [
            this.prøvLykkenKort[randomIndex], this.prøvLykkenKort[currentIndex]];
        }
    }
    
    tegnBræt(){
        if (this.spillere.length === 1) {
            const vinder = this.spillere[0];
            background("#484A47");
            fill("white");
            textAlign(CENTER, CENTER);
            textSize(48);
            text(vinder.navn +" vandt spillet!", windowWidth / 2, windowHeight / 2);
            noLoop(); // Stop p5.js draw-loop
            return;
        }
        this.konsol.tegn();
        this.terninger[0].tegnTerning();
        this.terninger[1].tegnTerning();
        for (const knap of this.knapper) {
            knap.tegn();
        }
        this.knapper[0].farve=this.slagTilladt? "lightgreen":"red";
        fill(this.spillere[this.turIndex].farve);
        textAlign(LEFT);
        textSize(24);
        text(this.spillere[this.turIndex].navn+"s tur",20, windowHeight - 240);
        //indre cirkel:
        fill("green");
        noStroke();
        circle(this.centerX,this.centerY,this.diameter*0.6);
        //Tekst på midten af cirkel
        fill("black");
        textAlign(CENTER);
        textSize(30);
        text("MATADOR",this.centerX,this.centerY);
        //tegn hvert felt
        for (let felt of this.felter){
            felt.tegnFelt();
            if(felt instanceof GrundFelt ||felt instanceof BryggeriFelt || felt instanceof RederiFelt || felt instanceof FængselFelt){
                if(felt.erMusOver()){
                    felt.visSkøde(20,20);
                }
            }
            if(felt instanceof GrundFelt){
                felt.tegnBygninger();
            }
        }
        //Spiller info
        for (let i=0;i<this.spillere.length;i++) {
            this.spillere[i].visInfo(windowWidth-270,i*150+10);
            if(this.turIndex!=i){
                this.handelsKnapper[i].tegn();
            }
        }

        // Fjern fallit-spillere
        for (let i = this.spillere.length - 1; i >= 0; i--) {
            if (this.spillere[i].erFallit()) {
                this.spillere.splice(i, 1);
                this.handelsKnapper.splice(i, 1);
            }
        }
        //spiller/felt håndtering 
        if (this.pendingFelt !== null) {
            let aktivSpiller = this.spillere[this.turIndex];
            //console.log(aktivSpiller);
            this.håndterFelt(aktivSpiller);
            this.pendingFelt = null; // nulstil efter brug
        }
        //hvis der er trukket et prøv lykken kort
        for (const trukketKort of this.trukketPrøvLykkenKort){
            trukketKort.vis();
        }
        //handelsBoks
        if (this.aktivHandel!=undefined) {
            this.aktivHandel.tegn();
        }
        //popups
        if(this.popup != undefined){
            this.popup.tegn();
        }
        //redningsboks
        if (this.aktivRedningsBoks != undefined) {
            this.aktivRedningsBoks.tegn();
        }
        

    }
    håndterFelt(aktivSpiller){
        this.musTrykTilladt=false;
        let aktivtFelt = aktivSpiller.felt;
        this.konsol.skriv(aktivSpiller.navn+" landede på "+aktivtFelt.navn+" ("+aktivSpiller.felt.id+")");
        if (aktivtFelt instanceof GrundFelt || aktivtFelt instanceof BryggeriFelt || aktivtFelt instanceof RederiFelt) {
            if (aktivtFelt.ejer == null || aktivtFelt.pantsat) {
                
                this.købsPopupFelt=aktivtFelt;
                this.popup= new Popup(
                    "Ledig ejendom til salg!",
                    "Ønsker du at købe "+aktivtFelt.navn+ " for \n"+aktivtFelt.pris+"kr. ?"

                )
            }
            else {
                    if(aktivtFelt.ejer!=aktivSpiller){
                        let ejer = aktivtFelt.ejer;
                        let leje = aktivtFelt.leje[aktivtFelt.aktivLejeSats];
    
                        if (aktivtFelt instanceof BryggeriFelt) {
                            leje = (this.terninger[0].talVærdi + this.terninger[1].talVærdi)*leje;
                        }
                        if(aktivtFelt instanceof GrundFelt && aktivtFelt.ubebyggetEjesAlle){
                            leje*=2; //dobbelt leje på ubebyggede grunde, hvor alle i samme gruppe ejes
                        }
                        aktivSpiller.saldo -= leje;
                        if(aktivSpiller.saldo<0){
                            console.log(aktivSpiller.navn+" skal førsøge at redde sig selv");
                            this.aktivRedningsBoks = new RedningsBoks(aktivSpiller, ejer, this.felter);
                    }
                        
                        ejer.saldo += leje;
                        this.konsol.skriv(`${aktivSpiller.navn} betalte leje kr. ${leje} til ${ejer.navn}`);
                    }
                   

            }
        }

        else if (aktivtFelt instanceof LykkeFelt) {
            if(this.prøvLykkenKort.length==0){
                this.prøvLykkenKort=this.kopiPrøvLykkenKort;
                this.blandKort();
            }
            let kort = this.prøvLykkenKort.shift();
            this.trukketPrøvLykkenKort.push(kort);

            if (kort instanceof RykKort) {
                if (kort.destination >= 0) {
                    let destinationIndex= kort.destination==0 ? 0: kort.destination-1;
                    if(kort.pengeOverStart){
                        if (destinationIndex < aktivSpiller.felt.id) { 
                            aktivSpiller.saldo += 4000;
                            this.konsol.skriv(aktivSpiller.navn + " passerede START og modtog 4000 kr.");
                        }
                    }
                    if(kort.destination==11||destinationIndex==31) aktivSpiller.fængslet=true;
                    aktivSpiller.flytBrik(this.felter[destinationIndex]);
                    this.konsol.skriv(aktivSpiller.navn+" rykkede til "+this.felter[destinationIndex].navn);
                    this.pendingFelt = aktivSpiller.felt;
                } 
                else {
                    let nyFeltIndex = kort.destination + aktivSpiller.felt.id;
                    if (nyFeltIndex < 0) nyFeltIndex += 40;
                    if(nyFeltIndex==0) nyFeltIndex++; //hvis man skal stå på start. ellers går man out of bounds i this.felter
                    aktivSpiller.flytBrik(this.felter[nyFeltIndex-1]);
                    this.konsol.skriv(aktivSpiller.navn+" rykkede til "+this.felter[nyFeltIndex-1].navn);
                    this.pendingFelt = aktivSpiller.felt;
                }
                
            }

            else if (kort instanceof GevinstKort) {
                aktivSpiller.saldo += kort.gevinst;
                if(kort.id===14){//fødselsdagskortet
                    for(let i=0;i<this.spillere.length;i++){
                        if(i != this.turIndex){
                            this.spillere[i].saldo -=kort.gevinst/(this.antalSpillere-1);
                            if(this.spillere[i].saldo<0){
                                console.log("forsøger at redde sig selv.")
                                this.aktivRedningsBoks = new RedningsBoks(this.spillere[i], aktivSpiller, this.felter);
                            }
                            this.konsol.skriv(this.spillere[i].navn+" gav kr. "+kort.gevinst/(this.antalSpillere-1)+ "til "+aktivSpiller.navn);
                        }
                    }
                    this.konsol.skriv(aktivSpiller.navn+" modtog kr. "+kort.gevinst+" af sine medspillere");
                }
                else{
                    this.konsol.skriv(aktivSpiller.navn+" modtog kr. "+kort.gevinst+" af banken.");
                }
    
            }

            else if (kort instanceof BødeKort) {
                aktivSpiller.saldo += kort.straf;
                if(aktivSpiller.saldo<0){
                        console.log(aktivSpiller.navn+" skal førsøge at redde sig selv");
                        this.aktivRedningsBoks = new RedningsBoks(aktivSpiller, null, this.felter);
                }
                this.konsol.skriv(aktivSpiller.navn+" betalte kr. "+kort.straf*-1+" til banken."); //straf er negativ
            }

            else if (kort instanceof StigningsKort) {
                let samlet = 0;
                if(aktivSpiller.grunde.length>0){
                    for (let grund of aktivSpiller.grunde) {
                        if(grund instanceof GrundFelt){
                            samlet += grund.huse.length * kort.stigninger.hus;
                            samlet += grund.hoteller.length * kort.stigninger.hotel;
                        }
                    }
                }
                aktivSpiller.saldo -= samlet;
                if(aktivSpiller.saldo<0){
                    console.log(aktivSpiller.navn+" skal førsøge at redde sig selv");
                    this.aktivRedningsBoks = new RedningsBoks(aktivSpiller, null, this.felter);
                }
                this.konsol.skriv(aktivSpiller.navn+" betalte kr. "+samlet+" til banken for sine huse & hoteller.");
            }

            else { // Benådelse
                aktivSpiller.gemteBenådelseskort.push(kort);
                this.konsol.skriv(aktivSpiller.navn+" modtog en benådelse af Kongen.");
            }
        }

        else if (aktivtFelt instanceof SkatFelt) {
            if(aktivtFelt.id==5){//%sats skatfelt
                this.pendingSkatFelt=aktivtFelt;
                this.popup=new Popup("Skat","Vil du betale 10% af alle dine værdier,\neller 4.000kr i skat?","10%","4.000kr");
            }
            else{
                if (aktivtFelt.skatVærdi == "fast") {
                    aktivSpiller.saldo -= aktivtFelt.skat.fast;
                    this.konsol.skriv(aktivSpiller.navn+" betalte kr. "+ aktivtFelt.skat.fast+ " i skat.");
                } else {
                    aktivSpiller.saldo -= aktivSpiller.saldo * aktivtFelt.skat.procent;
                    
                    
                    this.konsol.skriv(aktivSpiller.navn+" betalte "+aktivtFelt.skat.procent+"% i skat, svarende til "+(aktivSpiller.saldo * aktivtFelt.skat.procent)+" kr.");
                }
            }
            if(aktivSpiller.saldo<0){
                console.log(aktivSpiller.navn+" skal førsøge at redde sig selv");
                this.aktivRedningsBoks = new RedningsBoks(aktivSpiller, null, this.felter);
            }
        }
        else if (aktivtFelt.id==31){ //De Fængsles felt
            aktivSpiller.fængslet=true;
            aktivSpiller.flytBrik(this.felter[10]);
            this.konsol.skriv(aktivSpiller.navn+" røg i fængsel");
            this.pendingFelt = aktivSpiller.felt;

        }
        this.musTrykTilladt=true;
    }

    klik(){
        if (this.aktivHandel!=undefined) {
            if(this.aktivHandel.klik()){
                for(const felt of this.aktivHandel.spiller1.grunde){
                    felt.aktivLejeSats=this.nyLejeSatsTjek(this.aktivHandel.spiller1,felt);
                }
                for(const felt of this.aktivHandel.spiller2.grunde){
                    felt.aktivLejeSats=this.nyLejeSatsTjek(this.aktivHandel.spiller2,felt);
                }
                this.aktivHandel=undefined;
            }
            return;
        }
        if (this.aktivRedningsBoks != undefined) {
            if (this.aktivRedningsBoks.klik()) {
                this.aktivRedningsBoks = undefined; // luk redningsboksen når spilleren er færdig
            }
            if(this.aktivRedningsBoks.klik()=="fallit"){
                //fjern spilleren fra spillet
                this.spillere.splice(this.turIndex,1);
                this.aktivRedningsBoks =undefined;
            }
            return; // stop andre klik mens redningsboks er åben
        }        
        else{
            if(this.musTrykTilladt){
                for (let i=0;i<this.knapper.length;i++) {
                    if(this.knapper[i].erMusOver()){
                        if (i==0){ //slå terninger
                            if(this.slagTilladt){
                                this.slagTilladt=false;
                                this.terningerRullet=true;
                                let spiller =this.spillere[this.turIndex];
                                let værdi1=this.terninger[0].slåTerning();
                                let værdi2=this.terninger[1].slåTerning();
                                let gamlefelt=spiller.felt.id;
                                let nyeFelt=gamlefelt+værdi1+værdi2-1;
                                if(nyeFelt>=40){
                                    nyeFelt=nyeFelt-40;
                                    spiller.saldo+=4000;
                                    this.konsol.skriv(spiller.navn+" passerede START og modtog 4.000kr.");
                                    
                                }
                                if (spiller.fængslet) {
                                    if (værdi1 == værdi2) {
                                        // Spilleren slog to ens ⇒ bliver frigivet
                                        spiller.fængslet = false;
                                        this.terningerRullet=false;
                                        this.slagTilladt=true;
                                        spiller.venteRunder = 0;
                                        this.konsol.skriv(spiller.navn + " slog to ens og blev frigivet fra fængslet!");
                            
                                        // Flyt spilleren normalt!
                                        spiller.flytBrik(this.felter[nyeFelt]);
                                    }
                                    else {
                                        spiller.venteRunder--;
                            
                                        if (spiller.venteRunder <= 0) {
                                            spiller.saldo -= 1000; // Betaler for at komme fri
                                            spiller.fængslet = false;
                                            this.konsol.skriv(spiller.navn + " betalte 1000 kr. og blev frigivet fra fængslet!");
                                            spiller.flytBrik(this.felter[nyeFelt]);
                                        }
                                        else {
                                            this.konsol.skriv(spiller.navn + " slog ikke to ens og skal blive i fængsel " + spiller.venteRunder + " tur(e) mere.");
                                            this.slagTilladt = false;
                                            this.terningerRullet = true;
                                        }
                                    }
                                }
                                else{
                                    spiller.flytBrik(this.felter[nyeFelt]);
                                    if(værdi1==værdi2){
                                        this.slagTilladt=true;
                                        this.terningerRullet=false;
                                    }
                                    let terning1symbol = String.fromCharCode((9855 + værdi1).toString());
                                    let terning2symbol = String.fromCharCode((9855 + værdi2).toString());
                                    this.konsol.skriv(spiller.navn+" slog "+terning1symbol+ " "+terning2symbol);
                                    this.pendingFelt = this.felter[nyeFelt]; 
                                }
                                
                            }
                        }
                        if (i==1){ //Næste tur
                            if(this.terningerRullet){
                                this.terningerRullet=false;
                                let spiller=this.spillere[this.turIndex];
                                spiller.tur=false;
                                if (this.turIndex<this.spillere.length-1){
                                    this.turIndex++;
                                }
                                else{
                                    this.turIndex=0
                                }
                                this.konsol.skriv("__________________________________________");
                                //den næste spillers tur
                                spiller=this.spillere[this.turIndex];
                                spiller.tur=true;
                                this.håndterFængsel(spiller);
                            }
                            else{
                                alert(this.spillere[this.turIndex].navn+" skal slå før turen kan gives videre.");
                            }
                            
                        }
                    }
                }
                for (const felt of this.felter) {
                    if (felt instanceof GrundFelt) {
                        if (felt.erMusOver() && felt.ejer === this.spillere[this.turIndex]) {
                            this.feltTilPantsætning = felt;
                            
                            let spiller = this.spillere[this.turIndex];
                            let ejerAlleFarveGruppe = false;
                
                            // Tjek om spilleren ejer alle i farvegruppen
                            let spillerFarveTæller = 0;
                            for (const grund of spiller.grunde) {
                                if (grund instanceof GrundFelt && grund.farve === felt.farve) {
                                    spillerFarveTæller++;
                                }
                            }
                            if (spillerFarveTæller === this.farveTæller[felt.farve]) {
                                ejerAlleFarveGruppe = true;
                            }
                
                            if (!felt.pantsat) {
                                if (felt.huse.length === 0 && felt.hoteller.length === 0) {
                                    if (ejerAlleFarveGruppe) {
                                        this.popup = new Popup(
                                            "Ejendomshåndtering",
                                            "Vil du bygge på " + felt.navn + " eller pantsætte den?","Byg","Pantsæt"
                                        );
                                    } else {
                                        this.popup = new Popup(
                                            "Pantsætning",
                                            "Ønsker du at pantsætte " + felt.navn + " og modtage " + felt.pantsatVærdi + " kr.?"
                                        );
                                    }
                                } else {
                                    this.popup = new Popup(
                                        "Ejendomshåndtering",
                                        "Vil du bygge flere bygninger på " + felt.navn + " eller sælge eksisterende?","Byg","Sælg"
                                    );
                                }
                            }
                            else {
                                this.popup = new Popup(
                                    "Frikøb ejendom",
                                    "Vil du købe " + felt.navn + " tilbage for " + Math.floor(felt.pantsatVærdi * 1.1) + " kr.?"
                                );
                            }
                        }
                    }
                }
                
            }
            if (this.popup!=null) {
                if (this.popup.klik()) {
                    if (this.popup.resultat === true) {
                        //køb feltet
                        if (this.købsPopupFelt != null) {
                            let spiller = this.spillere[this.turIndex];
                            if (spiller.saldo >= this.købsPopupFelt.pris) {
                                spiller.saldo -= this.købsPopupFelt.pris;
                                this.købsPopupFelt.købGrund(spiller);
                                this.købsPopupFelt.aktivLejeSats = this.nyLejeSatsTjek(spiller, this.købsPopupFelt);
                            }
                            this.konsol.skriv(spiller.navn + " købte " + this.købsPopupFelt.navn + " for: " + this.købsPopupFelt.pris + " kr.");
                            this.købsPopupFelt = null;
                        }

                    }
                        //spilleren ejer allerede feltet
                    if (this.feltTilPantsætning != null) {
                        let felt = this.feltTilPantsætning;
                        let spiller = this.spillere[this.turIndex];
                    
                        if (this.popup.jaTekst === "Byg" && this.popup.resultat === true) {
                            this.håndterBygSalg(felt, spiller, "Byg");
                        }
                        else if (this.popup.nejTekst === "Sælg" && this.popup.resultat === false) {
                            this.håndterBygSalg(felt, spiller, "Sælg");
                        }
                        else {
                            // Pantsætning/frikøb hvis ikke byg/sælg
                            if (felt.pantsat) {
                                if (spiller.saldo >= Math.floor(felt.pantsatVærdi * 1.1)) {
                                    spiller.saldo -= Math.floor(felt.pantsatVærdi * 1.1);
                                    felt.pantsat = false;
                                    this.konsol.skriv(spiller.navn + " købte " + felt.navn + " tilbage for " + Math.floor(felt.pantsatVærdi * 1.1) + " kr.");
                                }
                            }
                            else {
                                felt.pantsat = true;
                                spiller.saldo += felt.pantsatVærdi;
                                this.konsol.skriv(spiller.navn + " pantsatte " + felt.navn + " for " + felt.pantsatVærdi + " kr.");
                            }
                        }
                        this.feltTilPantsætning = null;
                    }
                    if (this.feltTilPantsætning == null && this.købsPopupFelt == null && this.spillere[this.turIndex].fængslet) {
                        let spiller = this.spillere[this.turIndex];
                        if (this.popup.resultat === true) {
                            // Spilleren vælger at slå for at komme fri
                            this.slagTilladt = true;
                            spiller.vilForsøgeSlåToEns = true;
                        }
                        else if (this.popup.resultat === false) {
                            // Spilleren vælger at betale
                            if (spiller.saldo >= 1000) {
                                spiller.saldo -= 1000;
                                spiller.fængslet = false;
                                this.konsol.skriv(spiller.navn + " betalte 1000 kr. og er fri!");
                                this.slagTilladt = true;
                            } else {
                                this.konsol.skriv(spiller.navn + " kunne ikke betale 1000 kr.");
                                this.aktivRedningsBoks = new RedningsBoks(spiller, null, this.felter);
                            }
                        }
                    }
                    //SKAT
                    if (this.pendingSkatFelt != null && this.popup.resultat !== null) {
                        let spiller = this.spillere[this.turIndex];
                        if (this.popup.resultat === false) {
                            spiller.saldo -= 4000;
                            this.konsol.skriv(spiller.navn+" betalte 4000 kr i skat.");
                        } 
                        else {
                            let netWorth=spiller.saldo;
                            for (const grund of spiller.grunde) {
                                
                                if(grund instanceof GrundFelt){
                                    let husLængde = grund.huse.length;
                                    let hotelLængde = grund.hoteller.length;
                                    netWorth+=((grund.bebyggelsesPris/2)*husLængde+(grund.bebyggelsesPris/2)*5*hotelLængde);
                                }
                                     
                                if(!grund.pantsat) netWorth +=grund.pantsatVærdi;
                            }
                            let skat = Math.floor(netWorth* 0.10);
                            spiller.saldo -= skat;
                            this.konsol.skriv(spiller.navn+" betalte 10% i skat: "+skat+" kr.");
                        }
                        this.pendingSkatFelt = null;
                    }              
                    this.popup=null;   
                }
                return; // stop andet klik mens popup er åben
            }
            
            for (let i=0;i<this.handelsKnapper.length;i++) {
                if(this.handelsKnapper[i].erMusOver()){
                    this.aktivHandel=new HandelsBoks(this.spillere[this.turIndex],this.spillere[i],this.felter); 
                }
            }
            //Hvis der trykkes på prøvlykkenkort.
            if (this.trukketPrøvLykkenKort.length > 0) {
                let øversteKort = this.trukketPrøvLykkenKort[this.trukketPrøvLykkenKort.length - 1];
                if (øversteKort.erMusOver()) {
                    this.trukketPrøvLykkenKort.pop(); // Fjern kortet fra bunken
                }
            }
            // if (keyIsDown(SHIFT)) { // hvis du holder SHIFT nede
            //     console.log("Debug: rykker spiller  til fængsel");
            //     this.spillere[this.turIndex].flytBrik(this.felter[4]);
            //     this.pendingFelt = this.spillere[this.turIndex].felt;
                
            // }
        }
    }
    nyLejeSatsTjek(spiller,ejendom){
        let nyLejeSats="";
        if(ejendom instanceof GrundFelt){
            if(ejendom.huse.length>0 ||ejendom.hoteller.length>0){
                if(ejendom.hoteller.length==1) nyLejeSats="hotel";
                else if(ejendom.huse.length==1) nyLejeSats="etHus";
                else if(ejendom.huse.length==2) nyLejeSats="toHuse";
                else if(ejendom.huse.length==3) nyLejeSats="treHuse";
                else if(ejendom.huse.length==4) nyLejeSats="fireHuse";
                ejendom.ubebyggetEjesAlle=false;
            }
            else{
                let spillerFarveTæller={};
                for (const felt of spiller.grunde) {
                    if(felt instanceof GrundFelt){
                        if(spillerFarveTæller[felt.farve]==undefined){
                            spillerFarveTæller[felt.farve]=1;
                        }
                        else{
                            spillerFarveTæller[felt.farve]++;
                        }
                    }
                }
                if(spillerFarveTæller[ejendom.farve]==this.farveTæller[ejendom.farve]){ //spiller ejer alle i en farvegruppe
                    if(ejendom.huse.length==0 && ejendom.hoteller.length==0){
                        ejendom.ubebyggetEjesAlle=true;
                    }
                    else{
                        ejendom.ubebyggetEjesAlle=false; 
                    }
                    nyLejeSats="base";
                }
                else{
                    ejendom.ubebyggetEjesAlle=false;
                    nyLejeSats="base";
                }
            }
        }
        else if(ejendom instanceof RederiFelt || ejendom instanceof BryggeriFelt){
            let rederiTæller=0;
            let bryggeriTæller=0;
            for (const andenEjendom of spiller.grunde) {
                if(andenEjendom instanceof RederiFelt) rederiTæller++;
                else if(andenEjendom instanceof BryggeriFelt) bryggeriTæller++;
            }
            if(ejendom instanceof RederiFelt){
                if(rederiTæller==1) nyLejeSats="enBåd";
                else if(rederiTæller==2) nyLejeSats="toBåde";
                else if(rederiTæller==3) nyLejeSats="treBåde";
                else if(rederiTæller==4) nyLejeSats="fireBåde";
            }
            else if(ejendom instanceof BryggeriFelt){
                if(bryggeriTæller==1) nyLejeSats="etBryggeri";
                else if(bryggeriTæller==2) nyLejeSats="toBryggerier";
            }
        }
    
        return nyLejeSats //fx. "etHus", "toBåde","toBryggerier"
    } 
    håndterBygSalg(felt, spiller, valg) {
        let grundeISammeFarve = [];
        // Saml alle felter i samme farvegruppe som spilleren ejer
        for (const grund of spiller.grunde) {
            if (grund instanceof GrundFelt && grund.farve === felt.farve) {
                grundeISammeFarve.push(grund);
            }
        }
        // Find det mindste antal bygninger i gruppen
        let minAntalBygninger = Infinity; //alle tal er mindre
        let maxAntalBygninger = -1; //alle tal er større
        for (const grund of grundeISammeFarve) {
            minAntalBygninger = Math.min(minAntalBygninger, grund.huse.length+(grund.hoteller.length*5)); //løber igennem grund.huse og finder den mindste værdi
            maxAntalBygninger = Math.max(maxAntalBygninger,grund.huse.length+(grund.hoteller.length*5));
        }
        if (valg === "Byg") {
            if(felt.hoteller.length<1){
                // Tjek om man må bygge på feltet (det skal have færrest huse eller samme antal)
                if (felt.huse.length <= minAntalBygninger) {
                    if (spiller.saldo >= felt.bebyggelsesPris) {
                        spiller.saldo -= felt.bebyggelsesPris;
                        if(felt.huse.length<4){
                            felt.huse.push(new Bygning("hus"));
                            for (const andenEjendom of grundeISammeFarve) {
                                andenEjendom.aktivLejeSats = this.nyLejeSatsTjek(spiller,andenEjendom); //beregn for alle grunde. pga ubebyggetEjesAlle
                            }
                            
                            this.konsol.skriv(spiller.navn + " byggede et hus på " + felt.navn + ".");
                        }
                        else{
                            felt.huse=[];
                            felt.hoteller.push(new Bygning("hotel"));
                            for (const andenEjendom of grundeISammeFarve) {
                                andenEjendom.aktivLejeSats = this.nyLejeSatsTjek(spiller,andenEjendom); //beregn for alle grunde. pga ubebyggetEjesAlle
                            }
                            this.konsol.skriv(spiller.navn + " byggede et hotel på " + felt.navn + ".");
                        }
                    }
                    else {
                        alert(spiller.navn + " har ikke råd til at bygge på " + felt.navn + ".");
                    }
                }
                else {
                    alert("Du skal bygge jævnt! Byg på felterne med færrest huse først.");
                }
            }
            else alert("Der kan ikke bygges mere på "+felt.navn);
        }
        else if (valg === "Sælg") {
            if (felt.hoteller.length > 0) {
                felt.hoteller.pop();
                spiller.saldo += Math.floor(felt.bebyggelsesPris / 2);
                // Erstat med 4 huse
                felt.huse.push(new Bygning("hus"));
                felt.huse.push(new Bygning("hus"));
                felt.huse.push(new Bygning("hus"));
                felt.huse.push(new Bygning("hus"));
                this.konsol.skriv(spiller.navn + " solgte et hotel på " + felt.navn + " for " + Math.floor(felt.bebyggelsesPris / 2) + " kr.");
            }
            else if (felt.huse.length > 0) {
                //tjek om man må sælge
                if(maxAntalBygninger-(felt.huse.length-1)<2){
                    felt.huse.pop();
                    spiller.saldo += Math.floor(felt.bebyggelsesPris / 2);
                    this.konsol.skriv(spiller.navn + " solgte et hus på " + felt.navn + " for " + Math.floor(felt.bebyggelsesPris / 2) + " kr.");
                }
                else alert("Du skal sælge en bygning fra en anden grund først.");
                
            }
        }
    }
    håndterFængsel(spiller) {
        if (!spiller.fængslet) {
            this.slagTilladt = true;
            return;
        }
        if(spiller.gemteBenådelseskort.length>0){
            spiller.gemteBenådelseskort.pop();
            this.slagTilladt = true;
            spiller.fængslet = false;
            this.konsol.skriv(spiller.navn+ "blev benådet af kongen.");
            return;
        }
        if (spiller.venteRunder <= 0) {
            // Spilleren SKAL betale sig fri efter 3 runder
            if (spiller.saldo >= 1000) {
                spiller.saldo -= 1000;
                spiller.fængslet = false;
                this.konsol.skriv(spiller.navn + " betalte 1000 kr. for at slippe fri fra fængsel.");
                this.slagTilladt = true;
            } else {
                // Spilleren kan ikke betale → start redningsboks
                this.konsol.skriv(spiller.navn + " kunne ikke betale 1000 kr. for at slippe fri!");
                this.aktivRedningsBoks = new RedningsBoks(spiller, null, this.felter);
            }
        }
        else {
            // Spilleren skal vælge: slå for at komme fri eller betale
            this.popup = new Popup(
                "Fængsel",
                spiller.navn + " er i fængsel! Vil du forsøge at slå to ens eller betale 1000 kr?",
                "Slå", "Betal"
            );
        }
    }
    
}
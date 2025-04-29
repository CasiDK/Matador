class Konsol {
    constructor(x, y, bredde, højde, maxLinjer = 8) {
        this.x = x;
        this.y = y;
        this.bredde = bredde;
        this.højde = højde;
        this.maxLinjer = maxLinjer;
        this.beskeder = [];
    }

    skriv(tekst) {
        textSize(14);
        let nyTekst='';
        let linje='';
        for(const ord of tekst.split(' ')){
            if(tekst.split(' ').length>1){
                let testLinje=linje+ord+' ';
                if(textWidth(testLinje)<this.bredde+50){
                    linje=testLinje;
                }
                else{
                    nyTekst += linje + '\n'; // afslut linjen og tilføj til nyTekst
                    linje = ord + ' '; 
                }
            }
            else{
                linje=tekst;
            }
        }
        
        nyTekst+=linje;
        nyTekst=nyTekst.trim();
        this.beskeder.push(nyTekst);
        if (this.beskeder.length > this.maxLinjer) {
            this.beskeder.shift(); // fjern ældste
        }
    }

    tegn() {
        // baggrund
        fill(0, 0, 0, 180);
        noStroke();
        rect(this.x, this.y, this.bredde, this.højde, 10);

        // tekst
        fill(255);
        textSize(14);
        textAlign(LEFT, TOP);
        let linjeHøjde = 20;

        for (let i = 0; i < this.beskeder.length; i++) {
            text(this.beskeder[i], this.x + 10, this.y + 10 + i * linjeHøjde);
        }
    }
}

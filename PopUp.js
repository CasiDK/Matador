class Popup {
    constructor(overskrift, besked, jaTekst = "Ja", nejTekst = "Nej") {
        this.overskrift = overskrift; // fx "Vil du købe?"
        this.besked = besked;          // fx "Vil du købe Grønningen for 3200 kr?"
        this.jaTekst = jaTekst;
        this.nejTekst = nejTekst;

        this.bredde = 650;
        this.højde = 250;
        this.x = windowWidth / 2 -100- this.bredde / 2;
        this.y = windowHeight / 2 - this.højde / 2;

        this.knapJa = new Knap(this.x + 150, this.y + this.højde - 70, this.jaTekst, "lightgreen", 20);
        this.knapNej = new Knap(this.x + this.bredde - 200, this.y + this.højde - 70, this.nejTekst, "lightcoral", 20);

        this.resultat = null; // null = venter, true = ja, false = nej
    }

    tegn() {
        fill(255);
        stroke(0);
        strokeWeight(2);
        rect(this.x, this.y, this.bredde, this.højde, 20);

        textAlign(CENTER, TOP);
        textSize(24);
        noStroke();
        fill(0);
        text(this.overskrift, this.x + this.bredde / 2, this.y + 20);

        textSize(18);
        text(this.besked, this.x + this.bredde / 2, this.y + 80);

        this.knapJa.tegn();
        this.knapNej.tegn();
    }

    klik() {
        if (this.knapJa.erMusOver()) {
            this.resultat = true;
            return true;
        }
        if (this.knapNej.erMusOver()) {
            this.resultat = false;
            return true;
        }
        return false;
    }
}

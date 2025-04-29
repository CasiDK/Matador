class Kort{
    constructor(id,midtX,midtY){
        this.tekst="Ikke indlæst endnu.";
        this.id=id;
        this.bredde=155;
        this.højde=130;
        this.farve=color(" #F28C28");
        this.x=midtX-this.bredde/2;
        this.y=midtY+this.højde/2;
        this.tekstStørrelse=12;
        this.antal=1;

    }
    vis(){
        
        push();
        translate(this.x,this.y);
        textSize(this.tekstStørrelse);
        textAlign(CENTER,CENTER);
        fill(this.farve);
        if (this.erMusOver()) {
            stroke('red');
            strokeWeight(3);
        } else {
            noStroke();
        }
        rect(0,0,this.bredde,this.højde);
        let nyTekst='\n';
        let linje='';
        for(const ord of this.tekst.split(' ')){
            let testLinje=linje+ord+' ';
            if(textWidth(testLinje)<this.bredde-40){
                linje=testLinje;
            }
            else{
                nyTekst += linje + '\n'; // afslut linjen og tilføj til nyTekst
                linje = ord + ' '; 
            }
        }
        nyTekst+=linje;
        fill('black');
        noStroke();
        text(nyTekst,this.bredde/2,this.højde/2);
        pop();
        

    }
    erMusOver(){
        return (
            mouseX > this.x &&
            mouseX < this.x + this.bredde &&
            mouseY > this.y &&
            mouseY < this.y + this.højde
          );
    }
}

class Knap {
    constructor(posX, posY, tekst, farve, tekstStørrelse) {
      this.x = posX;
      this.y = posY;
      this.tekst = tekst;
      this.farve = farve;
      this.tekstStørrelse = tekstStørrelse;
      // Knapstørrelse baseret på tekststørrelse
      textSize(this.tekstStørrelse);
      let tekstBredde = textWidth(this.tekst);
      this.bredde = tekstBredde + 20;
      this.højde = this.tekstStørrelse + 20;
    }
  
    tegn() {
        let strokefarve='black';
        if(this.erMusOver()){
            strokefarve="yellow";
        }
     // Baggrund
        fill(this.farve);
        stroke(strokefarve);
        strokeWeight(2);
        rect(this.x, this.y, this.bredde, this.højde, 5);
  
      // Tekst
        fill(0);
        noStroke();
        textSize(this.tekstStørrelse);
        textAlign(CENTER, CENTER);
        text(this.tekst, this.x + this.bredde / 2, this.y + this.højde / 2);
    }
  
    erMusOver() {
      return (
        mouseX > this.x &&
        mouseX < this.x + this.bredde &&
        mouseY > this.y &&
        mouseY < this.y + this.højde
      );
    }
  }
  
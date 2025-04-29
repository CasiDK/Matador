class SkatFelt extends Felt{
    constructor(id,brætDiameter,midtX,midtY){
        super(id,brætDiameter,midtX,midtY);
        this.navn="SKAT";
        this.skatVærdi="fast"; //enten er det bare en flad skat eller en variabel med %sats
        this.skat={
            sats:0.1,
            fast:4000
        };
        this.farve="#FFE5B4"; //peach

    }
}
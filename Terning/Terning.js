class Terning{
    constructor(posX,posY){
        this.posX=posX;
        this.posY=posY;
        this.størrelse=140; //billederne er 140x140
        this.billeder=[];
        for (let i = 1; i <= 6; i++) {
            let img = loadImage(`./Terning/terning${i}.png`, (billede) => {
                billede.resize(70, 70); // nedskalerer billede til halv størrelse.
            });
            this.billeder.push(img);
        }
        
        this.aktivtBillede=this.billeder[5];
        this.talVærdi=6;
    }
    tegnTerning(){
        //TODO hvis jeg gider, så lav en sej animation :D
        push();
            imageMode(CORNER);
            image(this.aktivtBillede,this.posX,this.posY);
        pop();
    }
    slåTerning(){
        let værdi = random(this.billeder);
        this.talVærdi=this.billeder.indexOf(værdi)+1;
        this.aktivtBillede=værdi;
        return this.talVærdi; //number
    }
}
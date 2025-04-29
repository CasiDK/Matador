let spil;
let farver = ["Lilla", "Grøn", "Rød", "Blå"];
let farveRGB = {
  "Lilla": "rgb(243, 0, 243)",
  "Grøn": "rgb(26, 255, 0)",
  "Rød": "rgb(128, 0, 41)",
  "Blå": "rgb(6, 6, 133)"
};
let overskrift;
let billede;
function preload(){
  billede=loadImage('./Spilleplade.png',(billede) => {
    billede.resize(800,0); // nedskalerer billede til halv størrelse.
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  overskrift=createElement('h5','Matador'); //styles af style.css
  //overskrift.style('color',"rgb(6, 6, 133)");
  //overskrift.style('font-size',400);
  overskrift.position(50,40);
  inputFelter = [];
  farveValg = [];
  
  // Lav inputfelter og dropdowns
  for (let i = 0; i < 4; i++) {
    let input = createInput("Navn " + (i + 1));
    input.position(50, 300 + i * 60);
    input.size(200);
    inputFelter.push(input);

    let dropdown = createSelect();
    dropdown.position(300, 300 + i * 60);
    for (let f of farver) {
      dropdown.option(f);
    }
    dropdown.selected(farver[i]); // Sæt standardvalg
    farveValg.push(dropdown);
  }

  // Start knap
  startKnap = createButton("Start spil");
  startKnap.position(50, 600);
  startKnap.size(200, 50);
  startKnap.mousePressed(startSpil);
}

function startSpil() {
  let spillernavne = [];
  let spillerfarver = [];
  let valgteFarver = new Set();

  for (let i = 0; i < inputFelter.length; i++) {
    let navn = inputFelter[i].value().trim();
    let farve = farveValg[i].value();
    if (navn === "") {
      alert("Alle spillere skal have et navn!");
      return;
    }
    if (valgteFarver.has(farve)) {
      alert("Hver spiller skal vælge en unik farve!");
      return;
    }
    valgteFarver.add(farve);
    spillernavne.push(navn);
    spillerfarver.push(farveRGB[farve]);
  }

  // Fjern inputfelter og knap
  for (let input of inputFelter) input.remove();
  for (let dropdown of farveValg) dropdown.remove();
  overskrift.remove();
  startKnap.remove();

  // Start Matador-spillet direkte
  spil = new Spil(spillernavne.length, spillernavne, spillerfarver);
}

function draw() {
  background("#484A47");
  
  if(spil!=undefined){
    spil.tegnBræt();
  }
  else{
    textSize(24);
    fill('white');
    textAlign(LEFT);
    text("Indtast navne og vælg farver.\nTryk derefter på 'Start spil'",50,250);
    imageMode(CENTER);
    image(billede,windowWidth/2+200,windowHeight/2);
    textSize(12);
    fill(6, 6, 133);
    text("Udviklet af Isac Sepstrup Hansen",50,windowHeight-20);
    textAlign(RIGHT);
    text("Programmering C Eksamensprojekt 2025 H. C. Ørsted Gymnasiet Lyngby",windowWidth-50,windowHeight-20);
  }
  
}
function mousePressed(){

  if(spil != undefined){
    spil.klik();
  }
}

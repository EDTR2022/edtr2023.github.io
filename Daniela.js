const fps=30;
const duracionAnimacion=2*fps;
const Lienzo = document.getElementById("idLienzo");
const pincel = Lienzo.getContext("2d");
const diagonalIni = 2045;
const anchoLienzoInicial=1824;
const alturaLienzoInicial=924;
const logo =new Image();
logo.src = "Logo.png";
logo.onload = function(){
}
var animacion=1;
var continuar = true;
var incremento=0;
var factorX,factorY;

function onRoundRect(ctx,x,y,width,height,radius,txt,color1,color2){
    ctx.strokeStyle = color1;
    ctx.fillStyle = color2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x,y+radius);
    ctx.lineTo(x,y+height-radius);
    ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
    ctx.lineTo(x+width-radius,y+height);
    ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    ctx.lineTo(x+width,y+radius);
    ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
    ctx.lineTo(x+radius,y);
    ctx.quadraticCurveTo(x,y,x,y+radius);
    ctx.fill();

    if(txt!=""){
        ctx.fillStyle="white";
        ctx.font = fuente;
        ctx.textAlign ="center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, x+ width/2,y+height/2);
    }
    ctx.stroke();
    ctx.closePath();
 }
function onRedimensionar(){
    //division.height=Math.floor(window.innerHeight);
    Lienzo.width=Math.floor(0.95*window.innerWidth);
    Lienzo.height=Math.floor(0.95*window.innerHeight);
    //let diagonalActual=Math.floor(Math.sqrt(Math.pow(Lienzo.width,2)+Math.pow(Lienzo.height,2)));

    factorX=Lienzo.width/anchoLienzoInicial;
    factorY=Lienzo.height/alturaLienzoInicial;
    
    
        
}

window.addEventListener("resize", onRedimensionar);

function graficar_P(){
    var anchoLogo=logo.width*factorX/2;
    var alturaLogo=logo.height*factorY/2;
    var logoX=Lienzo.width/2-anchoLogo;
    var logoY=Lienzo.height/2-alturaLogo;

    var anchoBarraProgreso=Lienzo.width*0.5;
    var divAnimacion=(anchoBarraProgreso/duracionAnimacion);
    
    var barraProgresoX=Lienzo.width/2-anchoBarraProgreso/2;
    var alturaBarraProgreso=20*factorY;
    var barraProgresoY=(Lienzo.height+logoY+logo.height*factorY)/2;
        
    pincel.drawImage(logo,logoX,logoY,logo.width*factorX,logo.height*factorY);
    onRoundRect(pincel,barraProgresoX,barraProgresoY,anchoBarraProgreso,alturaBarraProgreso,5*factorY,"","white","black");
    onRoundRect(pincel,barraProgresoX,barraProgresoY,(animacion*divAnimacion),alturaBarraProgreso,5*factorY,"","white","blue");
    
}
function graficar(){
    Lienzo.style.display="none";
    EdT.style.display="inline"
    EdT.style.position="absolute"
    EdT.style.top="0%"
    EdT.style.left="0%"
    EdT.style.width="100%"
    EdT.style.height="100%"
    EdT.style.color = "white"

}
function Dibujo(){
    if(animacion<=duracionAnimacion){
        graficar_P();
        animacion++;
    }
    else{
        graficar();
        incremento=continuar?++incremento:incremento;
        }
    
    setTimeout(
        function(){
            let idIntervalo = window.requestAnimationFrame(Dibujo);
        }, 1000 / fps);
}

function onInicio(){
    onRedimensionar();
    Dibujo();
}
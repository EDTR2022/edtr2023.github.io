const conversion = 1;//Math.PI/180;
const circunferencia= 2*Math.PI;
const fps=30;
var fuente;//="bold 20px Serif";
var factor,factorH,factorV,TamanoFuente;
const TamanoFuenteIni=85;
const diagonalIni = 2255;
const raj=-15;
var vPantallaNo1=true,vPantallaNo2=false,vPantallaNo3=false;
var index=0,repeticion=0,pos,posX=25,posY=raj,
    grmm=0,VectoresClick=false,MasClick=false,GravedadClick=false,colorFondo,
    fuente1,fuente2,anchoAnimacion,altoAnimacion,
    AnchoEncabezado,AltoEncabezado,EncabezadoX,
    AnimacionY,AnimacionX,centro,
    contador=false,mirador=false,ing=false,
    AnchoBoton,AltoBoton,CentroBotonY,AnimacionEntrada=true;

const Animacion=[];
var pos=25;

const PheT1 = document.getElementById("idPheT1");
const PheT2 = document.getElementById("idPheT2");
const PheT3 = document.getElementById("idPheT3");
const Lienzo = document.getElementById("idLienzo");
const pincel = Lienzo.getContext("2d");

const Encabezado = new Image();
        Encabezado.src = "Raj.svg";
        Encabezado.onload = function(){
        }

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

    Lienzo.width=Math.floor(window.innerWidth);
    Lienzo.height=Math.floor(window.innerHeight);
    
    let diagonalActual=Math.floor(Math.sqrt(Math.pow(Lienzo.width,2)+Math.pow(Lienzo.height,2)));
    factor= diagonalActual/diagonalIni;
    
    
    if(factor>=0.8 && factor<=1){
        factor=0.9;
    }
      
    
    if(fPantallaNo1){
        centro = Lienzo.width/2;
        //TamanoFuente= factor*TamanoFuenteIni;
        fuente="bold "+30*factor+"px Serif";
        //fuente1 ="bold "+TamanoFuente+"px Times new Roman";
        //fuente2 ="bold "+0.45*TamanoFuente+"px Montserrat";
                
        AnchoEncabezado=Math.floor(Lienzo.width/2);
        AltoEncabezado=Math.floor(AnchoEncabezado/4);
        
        anchoAnimacion=Math.floor(Lienzo.width/3);
        altoAnimacion=Math.floor(Lienzo.height/3)//anchoAnimacion/1.72);
        AnimacionY =//Math.floor(Lienzo.height/2-altoAnimacion/2);
                    Math.floor(AltoEncabezado+100*factor);
                    //Lienzo.height/3)//factor*350;
        AnimacionX= Lienzo.width/2-anchoAnimacion/2;
        
        
        AnchoBoton=0.12*Lienzo.width;
        AltoBoton=AnchoBoton/4;//Lienzo.height/24.325;
        CentroBotonY=AnimacionY+altoAnimacion+100*factor;

        EncabezadoX=Lienzo.width/2-AnchoEncabezado/2;

        //console.log(Lienzo.height, Lienzo.width)
    }
}

window.addEventListener("resize", onRedimensionar);

Lienzo.addEventListener("mousemove",function(evt){
    ing=onArea(Lienzo,evt,3*centro/2,CentroBotonY,AnchoBoton/2,AltoBoton/2)
    contador=onArea(Lienzo,evt,centro,CentroBotonY,AnchoBoton/2,AltoBoton/2)
    mirador=onArea(Lienzo,evt,centro/2,CentroBotonY,AnchoBoton/2,AltoBoton/2);
    (contador||mirador||ing)?Lienzo.style.cursor = "pointer":Lienzo.style.cursor = "default";
    
}, false);
Lienzo.addEventListener("click",function(){
    if(contador || mirador||ing){
        vPantallaNo1=false;
        vPantallaNo2=true;
    }
    
}, false);



function oMousePos(pLienzo,evt) {
    var rect = pLienzo.getBoundingClientRect();
    return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    }
}
function onArea(Lienzo,evt,Cx,Cy,espacioX,espacioY){
    CxyRaton = oMousePos(Lienzo,evt);
    return( ( CxyRaton.x>(Cx-espacioX) && CxyRaton.x<(Cx+espacioX) )
        &&  ( CxyRaton.y>(Cy-espacioY) && CxyRaton.y<(Cy+espacioY) )
    ? true:false );
}

function fPantallaNo1(){
           
    pincel.clearRect(0,0,Lienzo.width,Lienzo.height);
    pincel.drawImage(Encabezado,EncabezadoX-pos,40*factor,AnchoEncabezado,AltoEncabezado);
    pincel.drawImage(Animacion[index],AnimacionX+pos,AnimacionY,anchoAnimacion,altoAnimacion);
    
    
    let AnchoBoton1=AnchoBoton,AltoBoton1=AltoBoton;
    let AnchoBoton2=AnchoBoton,AltoBoton2=AltoBoton;
    let AnchoBoton3=AnchoBoton,AltoBoton3=AltoBoton;
        
    if(contador){
        AnchoBoton1=1.5*AnchoBoton;
        AltoBoton1=AnchoBoton1/4;
      }
      else{
        if(mirador){
            AnchoBoton2=1.5*AnchoBoton;
            AltoBoton2=AnchoBoton2/4;
        }
        else{
            if(ing){
                AnchoBoton3=1.5*AnchoBoton;
                AltoBoton3=AnchoBoton3/4;
            }
        }
      }

    onRoundRect(pincel,centro/2-AnchoBoton2/2-pos,CentroBotonY-AltoBoton2/2-pos,AnchoBoton2,AltoBoton2,10*factor,"Vectores","blue","blue");
    onRoundRect(pincel,centro-AnchoBoton1/2-pos,CentroBotonY-AltoBoton1/2-pos,AnchoBoton1,AltoBoton1,10*factor,"M.a.s","blue","blue");
    onRoundRect(pincel,3*centro/2-AnchoBoton3/2-pos,CentroBotonY-AltoBoton3/2-pos,AnchoBoton3,AltoBoton3,10*factor,"Fuerza","blue","blue");
}
function fPantallaNo2(){
    
    if(grmm==0){
        VectoresClick=mirador
        MasClick=contador
        GravedadClick=ing
        colorFondo=MasClick?"#FCF3CF":"black"
    }
    
    pincel.beginPath()
    pincel.rect(centro-grmm,0,2*grmm,Lienzo.height);
    pincel.fillStyle=colorFondo
    pincel.fill()
    pincel.closePath()
    
    if(grmm>centro){
        Lienzo.style.display="none";
        
        if(MasClick){
            PheT1.style.display="inline"
            PheT1.style.position="absolute"
            PheT1.style.top="0%"
            PheT1.style.left="0%"
            PheT1.style.width="100%"
            PheT1.style.height="100%"           
        }
        else{
            if(VectoresClick){
                PheT2.style.display="inline"
                PheT2.style.position="absolute"
                PheT2.style.top="0%"
                PheT2.style.left="0%"
                PheT2.style.width="100%"
                PheT2.style.height="100%" 
                
            }
            else{
                if(GravedadClick){
                    PheT3.style.display="inline"
                    PheT3.style.position="absolute"
                    PheT3.style.top="0%"
                    PheT3.style.left="0%"
                    PheT3.style.width="100%"
                    PheT3.style.height="100%" 
                }
            }
            
        }

    }

    
}
function graficar(){
    if(vPantallaNo1){
        fPantallaNo1();
        if(index<4){
            if(repeticion<3){
                ++repeticion;
            }
            else{
                repeticion=0;
                ++index
            }
            
        }
        else{
            index=0;
        }
        pos=posX>raj?--posX:(posY<0?++posY:0)
    }
    else{
        if(vPantallaNo2){
            if(grmm<=centro ){
                fPantallaNo2();
                grmm=grmm+25;
            }
            else{
                fPantallaNo2();
            }
            
        }
    }
}    
    
function Dibujo(){
    
    graficar();
    setTimeout(
        function(){
            let idIntervalo = window.requestAnimationFrame(Dibujo);
        }, 1000 / fps);
}

function onInicio(){
    for(let i=0;i<4;i++){
        Animacion[i] = new Image();
        Animacion[i].src = i+1+".png";
        //Animacion[i].onload = function(){
        //}
        
    }
    Animacion[4] =Animacion[0]
    Animacion[5] =Animacion[1] 
    onRedimensionar();
    Dibujo();
}
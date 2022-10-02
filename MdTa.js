const conversion = 1;//Math.PI/180;
const circunferencia= 2*Math.PI;
const fps=30;
const divisiones=12;
//const Hora_Inicial=performance.now();
const diagonalIni = 1074;

const Lienzo = document.getElementById("idLienzo");
const pincel = Lienzo.getContext("2d");

const fuente="bold 14px Serif";
const texto=["Desplazamiento vs tiempo","Velocidad vs tiempo","Aceleracion vs tiempo","Mostrar opciones","Ocultar opciones",
                "Amplitud","Periodo","Frecuencia","Velocidad Angular","Detener","Continuar","Docente: Edgar del Toro"] ;
const medidaTxt=[];
for(let i=0;i<12;i++){
    medidaTxt[i]=Math.round(pincel.measureText(texto[i]).width+40);
}

const logo1 = new Image();
logo1.src = "logo1.svg";
logo1.onload = function(){
}
const logo2 = new Image();
logo2.src = "logo2.svg";
logo2.onload = function(){
}

const desplazamientoTrue = new Image();
desplazamientoTrue.src = "desplazamientoTrue.png";
desplazamientoTrue.onload = function(){
}

const desplazamientoFalse = new Image();
desplazamientoFalse.src = "desplazamientoFalse.png";
desplazamientoFalse.onload = function(){
}

const velocidadTrue = new Image();
velocidadTrue.src = "velocidadTrue.png";
velocidadTrue.onload = function(){
}

const velocidadFalse = new Image();
velocidadFalse.src = "velocidadFalse.png";
velocidadFalse.onload = function(){
}

const aceleracionTrue = new Image();
aceleracionTrue.src = "aceleracionTrue.png";
aceleracionTrue.onload = function(){
}

const aceleracionFalse = new Image();
aceleracionFalse.src = "aceleracionFalse.png";
aceleracionFalse.onload = function(){
}

var Ancho;
var over;
var InicioBarraHerramientas;
var Margen;
var CentroControl;
var factor;
var LineaBase;
var AnimacionBsSalida=0;
var seccion;//=Math.floor(Lienzo.height/12);
var Tclick=false;
var contador=0;

const NoRect=4;
const escala =[5,0.5,60,8];

var continuar = true;
var incremento=0;
var BarraSuperiorVisible=false;
var BarraInferiorVisible=true;
var AnimacionBs=0;

var boton1=true;
var boton2=false;
var boton3=false;

var iAmplitud=100;
var parametro=[0,10,0];
var AmplitudMax;
var PeriodoMax;

var RatonAbajo=false;
var CxyRaton;//Coordenadas del raton;
var CxyDesplazamiento={x:0,y:0}, CxyVelocidad={x:0,y:0},CxyAceleracion={x:0,y:0}, CxyMenu={x:0,y:0};
var CxyMenu2={x:20,y:20};
var CxyLogo={x:0,y:0};

var sobre=[false,false,false,false];
const Title=["A","T","f","w"];
const SubTitle =[" cm"," s"," hz"," rad/s"];

var XRect=[InicioBarraHerramientas+Ancho,0,0,0];
var DesY1=[0,,0,0,0];
var Altura=[0,0,0,0];

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
    let diagonalActual=Math.floor(Math.sqrt(Math.pow(Lienzo.width,2)+Math.pow(Lienzo.height,2)));
    factor= diagonalActual/diagonalIni;
    if(factor>=0.75){
        factor=1;
    }
    //console.log(factor);
    
    AmplitudMax=Math.round(200*factor);
    PeriodoMax=Math.round(200*factor);
    parametro[0]=Math.round(factor*iAmplitud);
        
}

window.addEventListener("resize", onRedimensionar);

Lienzo.addEventListener("mousedown",function(evt){
    RatonAbajo=true;
    
}, false);

Lienzo.addEventListener("mouseup",function(evt){
    RatonAbajo=false;
}, false);

Lienzo.addEventListener("click",function(){
    switch(contador){
        case 1:
            boton1=boton1?false:true;
            break;
        case 2:
            boton2=boton2?false:true;
            break;
        case 3:
            boton3=boton3?false:true;
            break;
        case 4:
            if(BarraSuperiorVisible){
                BarraSuperiorVisible=false;
                AnimacionBsSalida=LineaBase;
            }
            else{
                BarraSuperiorVisible=true;
                AnimacionBs=0;
            }
            break;
        case 5:
            continuar=continuar?false:true;
            break;
    }
},false);

Lienzo.addEventListener("mousemove",function(evt){
    contador=0;
    if(onArea(Lienzo,evt,CxyDesplazamiento.x,CxyDesplazamiento.y,seccion/2))
    {
        contador=1;
    }
    else{
        if(onArea(Lienzo,evt,CxyVelocidad.x,CxyVelocidad.y,seccion/2)){
            contador=2;
        }
        else{
            if(onArea(Lienzo,evt,CxyAceleracion.x,CxyAceleracion.y,seccion/2)){
                contador=3;
            }
            else{
                if(onArea(Lienzo,evt,CxyMenu.x,CxyMenu.y,3*over)){
                    contador=4;
                }
                else{
                    if(onArea(Lienzo,evt,CxyMenu2.x,CxyMenu2.y,3*over)){
                        contador=5;
                    }
                    else{
                        if(onArea(Lienzo,evt,CxyLogo.x,CxyLogo.y,3*over)){
                            contador=6;
                            
                        }
                        else{
                            if(BarraSuperiorVisible){
                                for(let i=0;i<NoRect;++i){
                                    if(onArea(Lienzo,evt,XRect[i],DesY1[i],3*over)){
                                        contador=7+i;
                                        if (RatonAbajo) {
                                            Altura[i]= LineaBase - CxyRaton.y;
                                            let JPdTa;
                                            switch(i){
                                                case 0:
                                                    JPdTa=escala[i]*Altura[i];
                                                    iAmplitud=JPdTa<=10?10:(JPdTa<AmplitudMax/factor ?JPdTa:AmplitudMax/factor);
                                                    parametro[i]=iAmplitud*factor;
                                                    break;
                                                case 1:
                                                    JPdTa=PeriodoMax/(10*escala[i]);
                                                    Altura[i]=Altura[i]<2?2:(Altura[i]>JPdTa?JPdTa:Altura[i]);
                                                    parametro[i]=escala[i] *Altura[i];
                                                    break;
                                                case 2:
                                                    parametro[1]=escala[i]*(1/(Altura[i]));
                                                    break;
                                                case 3:
                                                    parametro[1]=escala[i]*(2*Math.PI/(Altura[i]));
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    (contador>0 ) ? Lienzo.style.cursor = "pointer":Lienzo.style.cursor = "default";
}, false);
      
Lienzo.addEventListener("mouseout",function(evt){
    //RatonAbajoA=false;
    Lienzo.style.cursor = "default"; 
    contador=0;
}, false); 
      
function onArea(Lienzo,evt,Cx,Cy,espacio){
    CxyRaton = oMousePos(Lienzo,evt);
    return( ( CxyRaton.x>(Cx-espacio) && CxyRaton.x<(Cx+espacio) )
        &&  ( CxyRaton.y>(Cy-espacio) && CxyRaton.y<(Cy+espacio) )
    ? true:false );
}

function oMousePos(pLienzo,evt) {
    var rect = pLienzo.getBoundingClientRect();
    return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    }
}
function onBarraSuperior(frecuencia,angular,Base){
        Altura=[iAmplitud/escala[0],parametro[1]/escala[1],escala[2]*frecuencia,escala[3]*angular];
        let valores=[iAmplitud/10,parametro[1],frecuencia,angular];
       
        XRect=[InicioBarraHerramientas+Ancho,0,0,0];
        for(let i=1;i<NoRect;++i){
            XRect[i]=Math.round(XRect[i-1]+Ancho+Margen);
        }
        
        let BaseP=Base+5;
        let Anchor=XRect[3]+Ancho-InicioBarraHerramientas;
        pincel.lineWidth = 3;
        pincel.beginPath();
        onRoundRect(pincel,InicioBarraHerramientas,5,Anchor,Base,7,"","black","rgba(0,0,0,0.9)");
        pincel.closePath();
    
        pincel.lineWidth = 1;
        for(let i=0;i<NoRect;++i){
            DesY1[i]=Math.round([Base-Altura[i]]);
            //console.log(factor,Base,Altura[0],DesY1[0]);
            pincel.beginPath();
            //pincel.fillStyle = "#a8cefd";
            //pincel.strokeStyle="black";
            onRoundRect(pincel,XRect[i] -Ancho/2,DesY1[i],Ancho,Altura[i],3,"","black","#a8cefd");
            //pincel.fillRect(XRect[i] -Ancho/2,DesY1[i],Ancho,Altura[i]);
            //pincel.strokeRect(XRect[i] -Ancho/2,DesY1[i],Ancho,Altura[i]);
            pincel.closePath();
    
            pincel.beginPath();
            pincel.fillStyle = "yellow";
            pincel.arc(XRect[i]-3*over,DesY1[i],over,0,circunferencia);
            pincel.fill();
            pincel.closePath();

            pincel.beginPath();
            pincel.fillStyle = "red";
            pincel.arc(XRect[i],DesY1[i],over,0,circunferencia);
            pincel.fill();
            pincel.closePath();
        
            pincel.beginPath();
            pincel.fillStyle = "green";
            //pincel.strokeStyle="green";
            pincel.arc(XRect[i]+3*over,DesY1[i],over,0,circunferencia);
            pincel.fill();
            pincel.closePath();

}
}
function graficar(){
    var espaciado=5;
                        
    Margen=Math.round(50*factor);//Debería ser una division horizontal;
    Ancho=Math.round(75*factor);
    
    LineaBase=45;
    
    over=Math.round(7*factor);//radio de los circulos y distancia entre ellos
    CentroControl = Math.round((NoRect*Ancho+(NoRect-1)*Margen)/2);

    var Centro={x:AmplitudMax+espaciado,y:Lienzo.height/2};
    var PosY1=Math.floor(Centro.y-AmplitudMax);//parametro[0];
    var PosY2=Math.floor(Centro.y+AmplitudMax);//parametro[0];
    var PosX = Math.floor(Centro.x+AmplitudMax);//parametro[0];
    //var ini=Centro.x-AmplitudMax;
    
    var PosX1= Math.floor(PosX+espaciado);//separación del mcu y mas
    var ciclo= Math.floor(Lienzo.width-PosX1-espaciado);
    var PosX2= PosX1+ciclo;
    var AnchoGrafico=Math.floor(Lienzo.width/2);
    InicioBarraHerramientas= AnchoGrafico-CentroControl;

    let angular= (2*Math.PI/parametro[1]);
    let Angulo_Fase=(angular*incremento/fps+parametro[2]);
    let frecuencia= (1/parametro[1]);
                
    //Borra la lienzo
    pincel.clearRect(0,0,Lienzo.width,Lienzo.height);
    
    //Define los ejes de la circúnferencia
    
    pincel.lineWidth = 2;
    pincel.beginPath();
    pincel.moveTo(Centro.x,Centro.y + parametro[0]);
    pincel.lineTo(Centro.x,Centro.y-parametro[0]);
    pincel.moveTo(Centro.x - parametro[0],Centro.y);
    pincel.lineTo(Centro.x + parametro[0],Centro.y);
    pincel.strokeStyle = "#d3d3d3";
    pincel.stroke();
    pincel.closePath();
    //pincel.scale(1,1);
    
    //Define los ejes del M.A.S
    pincel.beginPath();
    pincel.moveTo(PosX1,PosY1);
    pincel.lineTo(PosX1,PosY2);
    pincel.moveTo(PosX1,Centro.y);
    pincel.lineTo(PosX2,Centro.y);
    pincel.strokeStyle = "black";
    pincel.stroke();
    pincel.closePath();

    //pincel.drawImage(IconsAmplitud,PosX1,Centro.y-parametro[0]);
    
    pincel.setLineDash([]);
    pincel.beginPath();
    pincel.fillStyle = "black";
    pincel.fillRect(PosX2-4,Centro.y-4,8,8);
    pincel.fillRect(PosX1-4,PosY1-4,8,8);
    //pincel.strokeStyle
    //pincel.stroke();
    pincel.closePath();

    if(boton1){
        let amplitud=parametro[0];
        let abscisa =  Math.floor(amplitud*Math.cos(Angulo_Fase));
        let ordenada = Math.floor(amplitud*Math.sin(Angulo_Fase));
            
        let x1=Math.floor(Centro.x + abscisa);
        let y1=Math.floor(Centro.y - ordenada);

        pincel.beginPath();
        pincel.arc(Centro.x,Centro.y,amplitud,0,circunferencia);
        pincel.moveTo(Centro.x,Centro.y);
        pincel.lineTo(x1,y1);
        pincel.moveTo(x1,y1);
        pincel.lineTo(PosX1,y1);
        pincel.arc(PosX1,y1,3,0,circunferencia);
        pincel.strokeStyle = "green";//"#800000";
        pincel.stroke();
        pincel.closePath();

        pincel.setLineDash([4, 4]);
        pincel.beginPath();
        pincel.moveTo(x1,Centro.y);
        pincel.lineTo(x1,y1);
        pincel.moveTo(Centro.x,y1);
        pincel.lineTo(x1,y1);
        
        pincel.lineWidth = 1;
        pincel.stroke();
        pincel.closePath();
        pincel.setLineDash([]);
                
        let val= (incremento<ciclo)?0:incremento - ciclo;
        let DdTa=PosX1;
        let SdTa= Math.floor(Centro.y - amplitud*Math.sin(Angulo_Fase));
        pincel.beginPath();
        pincel.lineWidth = 3;
        pincel.moveTo(DdTa,SdTa);
        let j;
        for( let t=incremento;t>=val;t=t-1){
            j=t/fps;
            SdTa = Math.floor(Centro.y - amplitud*Math.sin(angular*j+parametro[2]));
            pincel.lineTo(DdTa++,SdTa);
        }
        pincel.stroke();
        pincel.closePath();
    }

    if(boton2){
        let amplitud=angular*parametro[0];
        let abscisa2 = -Math.floor(amplitud*Math.sin(Angulo_Fase));
        let ordenada2 = -Math.floor(amplitud*Math.cos(Angulo_Fase));
    
        let x2=Math.floor(Centro.x + abscisa2);
        let y2=Math.floor(Centro.y - ordenada2);
        
        pincel.beginPath();
        pincel.arc(Centro.x,Centro.y,amplitud,0,circunferencia);
        pincel.moveTo(Centro.x,Centro.y);
        pincel.lineTo(x2,y2);
        pincel.moveTo(x2,y2);
        pincel.lineTo(PosX1,y2);
        pincel.arc(PosX1,y2,3,0,circunferencia);
        pincel.strokeStyle = "#0000FF";
        pincel.stroke();
        pincel.closePath();

        let val= (incremento<ciclo)?0:incremento - ciclo;
        let SdTa = Math.floor(Centro.y + amplitud*Math.cos(Angulo_Fase));
        
        let DdTa=PosX1;
        pincel.beginPath();
        pincel.lineWidth = 3;
        pincel.moveTo(DdTa,SdTa);
        let j;
        for( let t=incremento;t>=val;t=t-1){   
            j=t/fps;     
            SdTa= Math.floor(Centro.y + amplitud*Math.cos(angular*j+parametro[2]));
            pincel.lineTo(DdTa++,SdTa);                
        }
        pincel.stroke();
        pincel.closePath();
    }

    if(boton3){
        let amplitud=Math.pow(angular,2)*parametro[0];
        let abscisa3 = -Math.floor(amplitud*Math.cos(Angulo_Fase));
        let ordenada3 = -Math.floor(amplitud*Math.sin(Angulo_Fase));
    
        let x3=Math.floor(Centro.x + abscisa3);
        let y3=Math.floor(Centro.y - ordenada3);
        
        pincel.beginPath();
        pincel.arc(Centro.x,Centro.y,amplitud,0,circunferencia);
        pincel.moveTo(Centro.x,Centro.y);
        pincel.lineTo(x3,y3);
        pincel.moveTo(x3,y3);
        pincel.lineTo(PosX1,y3);
        pincel.arc(PosX1,y3,3,0,circunferencia);
        pincel.strokeStyle = "#FF0000";
        pincel.stroke();
        pincel.closePath();
        
        let val= (incremento<ciclo)?0:incremento - ciclo;
        let SdTa = Math.floor(Centro.y + amplitud*Math.sin(Angulo_Fase));
        let DdTa=PosX1;
        //pincel.strokeStyle = "red";
        pincel.beginPath();
        pincel.lineWidth = 3;
        pincel.moveTo(DdTa,SdTa);
        let j;
        for( let t=incremento;t>=val;t-=1){
            j=t/fps;
            SdTa= Math.floor(Centro.y + amplitud*Math.sin(angular*j+parametro[2]));
            pincel.lineTo(DdTa++,SdTa);                
        }
        pincel.stroke();
        pincel.closePath();

    }

    var AltoY;
    if(BarraInferiorVisible){
        seccion=(Lienzo.height/divisiones);
        AltoY=(divisiones-1)*seccion;
        
        pincel.beginPath();
        pincel.fillStyle = "black";//"#a8cefd";
        pincel.fillRect(0,AltoY,Lienzo.width,AltoY);

        let A=AltoY+0.125*seccion,B=1.25*seccion,C=0.75*seccion;
        CxyLogo.x=B/2;
        CxyLogo.y=A+C/2;

        (contador==6)?pincel.drawImage(logo2,0,A+0.125*C,0.75*B,0.75*C):pincel.drawImage(logo1,0,A,B,C);

        CxyDesplazamiento={x:Lienzo.width/2,y:AltoY+seccion/2};
        if(boton1){
            pincel.drawImage(desplazamientoTrue,CxyDesplazamiento.x-seccion/2,CxyDesplazamiento.y-seccion/2,seccion,seccion);
        }
        else{
            pincel.drawImage(desplazamientoFalse,CxyDesplazamiento.x-seccion/2+2,CxyDesplazamiento.y-seccion/2+2,seccion,seccion);
        }
        
        CxyVelocidad={x:Lienzo.width/2-(Margen+seccion),y:AltoY+seccion/2};
        if(boton2){
            pincel.drawImage(velocidadTrue,CxyVelocidad.x-seccion/2,CxyVelocidad.y-seccion/2,seccion,seccion);
        }
        else{
            pincel.drawImage(velocidadFalse,CxyVelocidad.x-seccion/2+2,CxyVelocidad.y-seccion/2+2,seccion,seccion);
        }
        
        CxyAceleracion={x:Lienzo.width/2+Margen+seccion,y:AltoY+seccion/2};
        if(boton3){
            pincel.drawImage(aceleracionTrue,CxyAceleracion.x-seccion/2,CxyAceleracion.y-seccion/2,seccion,seccion);
        }
        else{
            pincel.drawImage(aceleracionFalse,CxyAceleracion.x-seccion/2+2,CxyAceleracion.y-seccion/2+2,seccion,seccion);
        }
        pincel.closePath();
    }
    
    CxyMenu2.x;animacion=CxyMenu2.x +2;
    let Rxy=10;
    if(continuar){
        pincel.beginPath();
        pincel.fillStyle = "black";
        pincel.arc(CxyMenu2.x,CxyMenu2.y,20,0,circunferencia);
        pincel.fill();
        pincel.fillStyle = "yellow";
        pincel.fillRect(Rxy,Rxy,7,20);
        pincel.fillStyle = "yellow";
        pincel.fillRect(CxyMenu2.x+3,Rxy,7,20);
        pincel.closePath();
    }
    else{
        pincel.beginPath();
        pincel.fillStyle = "black";
        pincel.arc(animacion,animacion,20,0,circunferencia);
        pincel.fill();
        pincel.closePath();

        pincel.beginPath();
        pincel.fillStyle = "yellow";
        pincel.moveTo(animacion-7,animacion-10);
        pincel.lineTo(animacion-7,animacion +10);
        pincel.lineTo(animacion+12,animacion);
        pincel.fill();
        pincel.closePath();
    }

    let C=[],D,E=[15,20,15],colorMenu=[];
    if(BarraSuperiorVisible){

        if(AnimacionBs<LineaBase){
            onBarraSuperior(frecuencia,angular,AnimacionBs=AnimacionBs+2);
        }
        else{
            onBarraSuperior(frecuencia,angular,LineaBase);
        }

        CxyMenu={x:Lienzo.width-30,y:22};
        colorMenu=["black","black","black"];
        C=[Lienzo.width-43,Lienzo.width-33,Lienzo.width-23];
        D=12;
    }
    else{

        if(AnimacionBsSalida>0){
            onBarraSuperior(frecuencia,angular,AnimacionBsSalida=AnimacionBsSalida-2);
        }

        CxyMenu={x:Lienzo.width-32,y:20};
        colorMenu=["blue","red","green"];
        C=[Lienzo.width-45,Lienzo.width-35,Lienzo.width-25];
        D=10;
    }
    
    pincel.beginPath();
    for(let i=0;i<3;i++){
        pincel.fillStyle = colorMenu[i];
        pincel.fillRect(C[i],D,6,E[i]);
    }
    pincel.closePath();    
    
    if(contador>0){
        let descuento=seccion+5;
        let TipX=[CxyDesplazamiento.x,CxyVelocidad.x,CxyAceleracion.x,CxyMenu.x-70,CxyMenu2.x+50];
        let TipY =[CxyDesplazamiento.y-descuento,CxyVelocidad.y-descuento,CxyAceleracion.y-descuento,CxyMenu.y+25,CxyMenu2.y+30];
        
        let j=contador-1;
        let q=j;
        let A=TipX[j]-medidaTxt[q]/2;
        let B=TipY[j];        

        if(contador>3){
            switch (contador){
                case 4:
                    q=BarraSuperiorVisible?j+1:j;
                    A=TipX[j]-medidaTxt[q]/2;
                    break;
                case 5:
                    q=continuar?j+5:j+6;
                    A=TipX[j]-medidaTxt[q]/2;
                    break;
                case 6:
                    q=11;
                    A=CxyLogo.x;
                    B=CxyLogo.y-seccion;
                    break;
                default:
                    q=j-1;
                    A=XRect[contador-7]-medidaTxt[j]/2;
                    B=LineaBase+10;
                    break;
            }
        
        }
        onRoundRect(pincel,A,B,medidaTxt[q],20,3,texto[q],"blue","blue");
    }
}

function Dibujo(){
    graficar();
    incremento=continuar?++incremento:incremento;
    setTimeout(
        function(){
            let idIntervalo = window.requestAnimationFrame(Dibujo);
        }, 1000 / fps);
}

function onInicio(){
    onRedimensionar();
    Dibujo();
}
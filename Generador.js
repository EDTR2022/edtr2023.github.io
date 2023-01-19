const conversion = Math.PI / 180;
const circunferencia = 2 * Math.PI;
const fps = 30;
const divisiones = 12;
//const Hora_Inicial=performance.now();
const diagonalIni = 1074;

const Lienzo = document.getElementById("idLienzo");
const pincel = Lienzo.getContext("2d");

const fuente = "bold 14px Serif";
const texto = ["Amplitud", "Periodo", "Desfase", "Mostrar opciones", "Ocultar opciones",
    "Amplitud ", "Periodo ", "Desfase ", "Velocidad Angular", "Detener", "Continuar", "Docente: Edgar del Toro"];
const medidaTxt = [];
for (let i = 0; i < 12; i++) {
    medidaTxt[i] = Math.round(pincel.measureText(texto[i]).width + 40);
}

const formas=["Por defecto","Senosoidal","Triangular","Cuadrada","Forma de sierra","Paquete de ondas"];
const detalles=["Crestas y valles","Elongación","Puntos máximos","Puntos mínimos","Amplitud","Período","Frecuencia","Velocidad angular"]
const CoefLineas = [1, 0.75, 0.5, 0.25, 0, -0.25, -0.5, -0.75, -1];
var NoCurvas = 12;
const NoDatos = 4;
const anchoLienzoInicial = 1824;//1297;//980;//1824;
const alturaLienzoInicial = 924;//627;//480;//924;
const Porcent = 95;
const scool1 = alturaLienzoInicial / Porcent;
//const scool2=anchoLienzoInicial/300;

var AmplitudMax = alturaLienzoInicial / scool1;
var PeriodoMax = 10;
var DesfaseMax = 90;

var CxyDesplazamiento = { x: 0, y: 0 }, CxyVelocidad = { x: 0, y: 0 }, CxyAceleracion = { x: 0, y: 0 }, CxyMenu = { x: 0, y: 0 };

const desplazamientoTrue = new Image();
desplazamientoTrue.src = "A.svg";
desplazamientoTrue.onload = function () {
}

const desplazamientoFalse = new Image();
desplazamientoFalse.src = "Afalse.svg";
desplazamientoFalse.onload = function () {
}
const velocidadTrue = new Image();
velocidadTrue.src = "T.svg";
velocidadTrue.onload = function () {
}

const velocidadFalse = new Image();
velocidadFalse.src = "Tfalse.svg";
velocidadFalse.onload = function () {
}

const aceleracionTrue = new Image();
aceleracionTrue.src = "d.svg";
aceleracionTrue.onload = function () {
}

const aceleracionFalse = new Image();
aceleracionFalse.src = "dfalse.svg";
aceleracionFalse.onload = function () {
}
//Inicializaciones para graficar y dibujar curvas
const espaciado = 5;
const PosX1 = (3 * espaciado);

var eje1_Y, eje2_Y;//ordenada=[];
var Ancho;
var over;
var InicioBarraHerramientas;
var Margen;
var CentroControl;
var factorX, factorY;

var AnimacionBsSalida = 0;
var seccion;//=Math.floor(Lienzo.height/12);
var Tclick = false;
var contador = 0;

var continuar = true;
var incremento = PosX1;
var BarraSuperiorVisible = true;
var BarraInferiorVisible = false;
var AnimacionBs = 0;
var vSJAmplitud = true, vSJPeriodo = false, vSJDesfase = false;
var curvaSeleccionada = false;
var curvaClick = [];
var Td = [];
var pMenuFormas=false,pMenu2=false;
var pdetalles=false,pMinimos=false;
var pCrestas=false, pElongacion=false;
var pAmplitud=false;

var boton1 = true;
var parametro = [1.5, 5, 0, "green",
                -1.0, 5, 0, "red",
                1.0,5, 0, "blue ",
                0, 0, 0, "#D35400",
                0, 0, 0, "chartreuse",
                0, 0, 0, "darkmagenta",
                0, 0, 0, "darkred",
                0, 0, 0, "lightgreen",
                0, 0, 0, "khaki",
                0, 0, 0, "lightsalmon",
                0, 0, 0, "magenta",
                0, 0, 0, "orange"];
var rParametro=[];
var rNoCurvas;

const FcToPixeles=Porcent/2;
const FcToGr=2.0/1.5
for (let i = 0; i < NoCurvas; i++) {
    curvaClick[i] = false;
    Td[i] = 0;
    parametro[NoDatos*i]=parametro[NoDatos*i]*FcToPixeles;
}

const LineaBase = 65;//*factorY
const AnchoP = 25;//*factorY

const FactorEscala = (LineaBase - AnchoP);
var escala = [FactorEscala / AmplitudMax,
PeriodoMax / FactorEscala, DesfaseMax / FactorEscala];

var CoefAmplitud=1;
var RatonAbajo = false;
var CxyRaton;//Coordenadas del raton;
var CxyDesplazamiento = { x: 0, y: 0 }, CxyVelocidad = { x: 0, y: 0 }, CxyAceleracion = { x: 0, y: 0 }, CxyMenu = { x: 0, y: 0 };
var CxyMenu2 = { x: 20, y: 20 };
var CxyLogo = { x: 0, y: 0 };

var sobre = [false, false, false, false];
const Title = ["A", "T", "f", "w"];
const SubTitle = [" cm", " s", " hz", " rad/s"];

var XRect = [], YRect = [];
var DesY1 = [];
var Altura = [];

function onRoundRect(ctx, x, y, width, height, radius, txt, color1, color2) {
    ctx.strokeStyle = color1;
    ctx.fillStyle = color2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.fill();

    if (txt != "") {
        ctx.fillStyle = "white";
        ctx.font = fuente;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, x + width / 2, y + height / 2);
    }
    ctx.stroke();
    ctx.closePath();
}

function onRedimensionar() {
    //division.height=Math.floor(window.innerHeight);
    Lienzo.width = (0.95 * window.innerWidth);
    Lienzo.height = (0.95 * window.innerHeight);

    factorX = Lienzo.width / anchoLienzoInicial;
    factorY = Lienzo.height / alturaLienzoInicial;

    let Am = AmplitudMax;
    AmplitudMax = Lienzo.height / scool1;
    let Coef=AmplitudMax / Am;
    CoefAmplitud *=Coef;

    escala = [FactorEscala / AmplitudMax,
    PeriodoMax / FactorEscala, DesfaseMax / FactorEscala];

    for (let i = 0; i < NoCurvas; ++i) {
        parametro[NoDatos * i] = (parametro[NoDatos * i] * Coef);

    }

    eje1_Y = Lienzo.height / 3;
    eje2_Y = 2 * Lienzo.height / 3 + 20 * factorY;
    //console.log(Lienzo.width)
}

window.addEventListener("resize", onRedimensionar);

Lienzo.addEventListener("mousedown", function (evt) {
    RatonAbajo = true;

}, false);

Lienzo.addEventListener("mouseup", function (evt) {
    RatonAbajo = false;
}, false);

Lienzo.addEventListener("click", function () {
    if (contador < 7) {
        switch (contador) {
            case 0:
                pMenuFormas=false;
                pMenu2=false;
                
                break
            case 1:
                if (!vSJAmplitud) {
                    vSJAmplitud = true;
                    vSJPeriodo = false;
                    vSJDesfase = false;
                }

                break;
            case 2:
                if (!vSJPeriodo) {
                    vSJAmplitud = false;
                    vSJPeriodo = true;
                    vSJDesfase = false;
                }
                break;
            case 3:
                if (!vSJDesfase) {
                    vSJAmplitud = false;
                    vSJPeriodo = false;
                    vSJDesfase = true;
                }
                //boton3=boton3?false:true;
                break;
            case 4:
                if(pMenuFormas){
                    pMenuFormas=false;
                }
                else{
                    pMenuFormas=true;
                    rNoCurvas=NoCurvas;
                    rParametro=parametro.slice();
                }
                break;
            case 5:
                if(pMenu2){
                    pMenu2=false;
                }
                else{
                    pMenu2=true;
                    
                }
                break;
        }
    }
    else {
        if (!(contador < 20)&&(contador<30)) {
            curvaClick[contador - 20] = curvaClick[contador - 20] ? false : true;
            curvaSeleccionada = false;
            for (let i = 0; i < NoCurvas; i++) {
                if (curvaClick[i]) {
                    curvaSeleccionada = true;
                }
            }
            if(!curvaSeleccionada){
                pdetalles=false;
                pMinimos=false;
                pCrestas=false;
                pElongacion=false;
                pAmplitud=false;
                //incremento=PosX1; 
            }    
        }
        else {
            if(!(contador < 30)&&(contador<40)){
                switch(contador-30){
                    case 0:
                        onFormaDefault();
                        break;
                    case 1:
                        onFormaSenoidal();
                        break;
                    case 2:
                        onFormaTriangulo();
                        break;
                    case 3:
                        onFormaCuadrada();
                        break;
                    case 4:
                        onFormaSierra();
                        break;
                    case 5:
                        onFormaPaquete();
                        break;
                }
                pMenuFormas=false;
                contador=0;
            }
            else{
                if(!(contador < 40)&&(contador<50)){
                    incremento=PosX1;
                    switch(contador-40){
                        case 0:
                            pdetalles=false;
                            pMinimos=false;
                            pCrestas=true;
                            pElongacion=false;
                            pAmplitud=false;                            
                            break;
                        case 1:
                            pdetalles=false;
                            pMinimos=false;
                            pCrestas=false;
                            pElongacion=true;
                            pAmplitud=false;
                            break;
                        case 2:
                            pdetalles=true;
                            pMinimos=false;
                            pCrestas=false;
                            pElongacion=false; 
                            pAmplitud=false;
                            break;
                        case 3:
                            pdetalles=false;
                            pMinimos=true;
                            pCrestas=false;
                            pElongacion=false;
                            pAmplitud=false; 
                            break;
                        case 4:
                            pdetalles=false;
                            pMinimos=false;
                            pCrestas=false;
                            pElongacion=false;
                            pAmplitud=true;
                            
                            break;
                        case 5:
                            
                            break;
                    }
                    pMenu2=false;
                    
                }
            } 
        }
    }
}, false);
//Lienzo.addEventListener("touchmove", function (evt) {
   //pDedo=true; 
//}, false);
Lienzo.addEventListener("mousemove", function (evt) {
    contador = 0;
    if (onArea(Lienzo, evt, CxyDesplazamiento.x, CxyDesplazamiento.y, seccion / 2)) {
        contador = 1;
    }
    else {
        if (onArea(Lienzo, evt, CxyVelocidad.x, CxyVelocidad.y, seccion / 2)) {
            contador = 2;
        }
        else {
            if (onArea(Lienzo, evt, CxyAceleracion.x, CxyAceleracion.y, seccion / 2)) {
                contador = 3;
            }
            else {
                if (onArea(Lienzo, evt, CxyMenu.x, CxyMenu.y, 3 * over)) {
                    contador=pMenu2?0:4;
                    
                }
                else {
                    if (onArea(Lienzo, evt, CxyMenu2.x, CxyMenu2.y, 3 * over)) {
                        contador=pMenuFormas?0:5;
                        
                    }
                    else {
                        if (onArea(Lienzo, evt, CxyLogo.x, CxyLogo.y, 3 * over)) {
                            contador = 0;
                        }
                        else {
                            if(pMenuFormas){
                                let A=CxyMenu.x+10;
                                let B=CxyMenu.y+40;
                                for(let i=0;i<formas.length;++i){
                                    if(onAreaXY(Lienzo,evt,A+pincel.measureText(formas[i]).width/2,B+25*i,pincel.measureText(formas[i]).width/2,7)){
                                        contador=30+i;
                                    }
                                }
                            }
                            else{
                                if(pMenu2){
                                    let A=CxyMenu2.x-140;
                                    let B=CxyMenu2.y+40;
                                    for(let i=0;i<detalles.length;++i){
                                        if(onAreaXY(Lienzo,evt,A+pincel.measureText(detalles[i]).width/2,B+25*i,pincel.measureText(detalles[i]).width/2,7)){
                                            contador=40+i;
                                        }
                                    }
                                }
                                else{
                                    for (let i = 0; i < NoCurvas; ++i) {
                                        if (onArea(Lienzo, evt, XRect[i], DesY1[i], over)) {
                                            if (!curvaSeleccionada || curvaClick[i]) {
                                                contador = 7 + i;
                                                if (RatonAbajo) {
                                                    Altura[i] = LineaBase - CxyRaton.y;//reducido y sin escalar
                                                    if (vSJAmplitud) {
                                                        Altura[i] = Altura[i] <= -FactorEscala ? -FactorEscala : (Altura[i] > FactorEscala ? FactorEscala : Altura[i]);
                                                        parametro[NoDatos * i] = (Altura[i] / escala[0]);
                                                    }
                                                    else {
                                                        if (vSJPeriodo) {
                                                            let periodo=escala[1] *Altura[i];
                                                            periodo = periodo < 1 ? 1 : (Altura[i] > FactorEscala ? escala[1]*FactorEscala : escala[1]*Altura[i]);
                                                            parametro[NoDatos * i + 1] = Math.round(periodo) ;
                                                        }
                                                        else {
                                                            if (vSJDesfase) {
                                                                Altura[i] = Altura[i] <= -FactorEscala ? -FactorEscala : (Altura[i] > FactorEscala ? FactorEscala : Altura[i]);
                                                                parametro[NoDatos * i + 2] = (escala[2] * Altura[i]);
                                                            }
                                                        }
                                                        Td[i] = parametro[NoDatos * i + 2] * conversion * parametro[NoDatos * i + 1] / (2 * Math.PI);
                                                    }

                                                }

                                            }
                                        }
                                        else {
                                            if (onArea(Lienzo, evt, XRect[i], AnchoP / 2, over)) {
                                                contador = 20 + i;
                                            }
                                        }
                                    }

                                }
                            }    
                            //}
                        
                        }
                    }
                }
            }
        }
    }
    (contador > 0) ? Lienzo.style.cursor = "pointer" : Lienzo.style.cursor = "default";
}, false);

Lienzo.addEventListener("mouseout", function (evt) {
    //RatonAbajoA=false;
    Lienzo.style.cursor = "default";
    contador = 0;
}, false);

function onArea(Lienzo, evt, Cx, Cy, espacio) {
    CxyRaton = oMousePos(Lienzo, evt);
    return ((CxyRaton.x > (Cx - espacio) && CxyRaton.x < (Cx + espacio))
        && (CxyRaton.y > (Cy - espacio) && CxyRaton.y < (Cy + espacio))
        ? true : false);
}

function onAreaXY(Lienzo, evt, Cx, Cy, espacioX,espacioY) {
    CxyRaton = oMousePos(Lienzo, evt);
    return ((CxyRaton.x > (Cx - espacioX) && CxyRaton.x < (Cx + espacioX))
        && (CxyRaton.y > (Cy - espacioY) && CxyRaton.y < (Cy + espacioY))
        ? true : false);
}

function oMousePos(pLienzo, evt) {
    var rect = pLienzo.getBoundingClientRect();
    return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    }
}
function onBarraSuperior(Base) {
    for (let i = 0; i < NoCurvas; i++) {
        if (vSJAmplitud) {
            Altura[i] = parametro[NoDatos * i] * escala[0];
        }
        else {
            if (vSJPeriodo) {
                Altura[i] = parametro[NoDatos * i + 1] / escala[1];
            }
            else {
                if (vSJDesfase) {
                    Altura[i] = parametro[NoDatos * i + 2] / escala[2];
                }

            }
        }
    }

    Ancho = (60 * factorX);
    Margen = Ancho / 2;//(50*factorX);
    CentroControl = ((NoCurvas * Ancho + (NoCurvas - 1) * Margen) / 2);
    AnchoGrafico = (Lienzo.width / 2);
    InicioBarraHerramientas = AnchoGrafico - CentroControl;

    XRect = [InicioBarraHerramientas + Ancho, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 1; i < NoCurvas; ++i) {
        XRect[i] = XRect[i - 1] + Ancho + Margen;
    }

    let Anchor = XRect[NoCurvas - 1] + Ancho - InicioBarraHerramientas;

    pincel.lineWidth = 3;
    pincel.beginPath();
    onRoundRect(pincel, InicioBarraHerramientas, AnchoP,
        Anchor, Base - AnchoP, 0, "", "black", "rgba(255,255,255,0.7)");
    pincel.closePath();

    pincel.lineWidth = 1;
    for (let i = 0; i < NoCurvas; ++i) {
        DesY1[i] = Base - Altura[i];
        let color1 = "gray", color2 = "white", color3 = "black", color4 = parametro[NoDatos * i + 3];
        
        pincel.beginPath();

        if (curvaClick[i]) {
            color2 = parametro[NoDatos * i + 3];

        }
        else {
            if (curvaSeleccionada) {
                color3 = "black";
                color4 = "rgba(255,255,255,0.7)";
            }

        }
        onRoundRect(pincel, XRect[i] - 5, Base - 60, 10, 10, 0, "", color1, color2);
        onRoundRect(pincel, XRect[i] - Ancho / 2, DesY1[i], Ancho, Altura[i], 0, "", color3, color4);
        pincel.closePath();

        if(vSJAmplitud){
            onRoundRect(pincel,XRect[i]-0.6*Ancho/2,DesY1[i] -4,0.6*Ancho,8,3,"","black","#FCF3CF");
        }
        else{
            if(vSJPeriodo){
                pincel.beginPath();
                pincel.fillStyle = "black";
                pincel.arc(XRect[i], DesY1[i], over, 0, circunferencia);
                pincel.stroke()
                pincel.fill();
                pincel.closePath();
            }
            else{
                onRoundRect(pincel,XRect[i]-0.6*Ancho/2,DesY1[i] -4,0.6*Ancho,8,3,"","black","#ABEBC6");
                pincel.beginPath();
                pincel.fillStyle = "red";
                pincel.arc(XRect[i], DesY1[i], over, 0, circunferencia);
                pincel.stroke()
                pincel.fill();
                pincel.closePath();

            }
        }
        /*pincel.beginPath();
            pincel.fillStyle = "red";
            pincel.arc(XRect[i]-3*over,DesY1[i],over,0,circunferencia);
            pincel.fill();
        pincel.closePath();*/

        
        
        /*pincel.beginPath();
        pincel.fillStyle = "black";
        //pincel.arc(XRect[i], DesY1[i], over, 0, circunferencia);
        pincel.stroke()
        pincel.fill();
        pincel.closePath();*/

        /*pincel.beginPath();
            pincel.fillStyle = "black";
            pincel.arc(XRect[i]+3*over,DesY1[i],over,0,circunferencia);
            pincel.fill();
        pincel.closePath();*/

    }
}

function onBarraBotones() {
    seccion = (Lienzo.height / divisiones);
    AltoY = (divisiones - 1) * seccion - 5;
    //AltoY=Lienzo.height/2;// Lienzo.height/2-seccion/2;
    let Margen = seccion / 2;

    CxyDesplazamiento = { x: Lienzo.width / 2, y: AltoY + seccion / 2 };
    if (vSJAmplitud) {
        pincel.drawImage(desplazamientoTrue, CxyDesplazamiento.x - seccion / 2, CxyDesplazamiento.y - seccion / 2, seccion, seccion);
    }
    else {
        pincel.drawImage(desplazamientoFalse, CxyDesplazamiento.x - seccion / 2 + 2, CxyDesplazamiento.y - seccion / 2 + 2, seccion, seccion);
    }

    CxyVelocidad = { x: Lienzo.width / 2 - (Margen + seccion), y: AltoY + seccion / 2 };
    if (vSJPeriodo) {
        pincel.drawImage(velocidadTrue, CxyVelocidad.x - seccion / 2, CxyVelocidad.y - seccion / 2, seccion, seccion);
        //console.log(vSJAmplitud)
    }
    else {
        pincel.drawImage(velocidadFalse, CxyVelocidad.x - seccion / 2 + 2, CxyVelocidad.y - seccion / 2 + 2, seccion, seccion);
    }

    CxyAceleracion = { x: Lienzo.width / 2 + Margen + seccion, y: AltoY + seccion / 2 };
    if (vSJDesfase) {
        pincel.drawImage(aceleracionTrue, CxyAceleracion.x - seccion / 2, CxyAceleracion.y - seccion / 2, seccion, seccion);
    }
    else {
        pincel.drawImage(aceleracionFalse, CxyAceleracion.x - seccion / 2 + 2, CxyAceleracion.y - seccion / 2 + 2, seccion, seccion);
    }
    pincel.closePath();
}
function fDibujarCurvas() {
    //var ciclo= (Lienzo.width-2*PosX1);
    //var PosX2= PosX1+ciclo;
    var PosX2 = Lienzo.width - PosX1;
    let angular, j, JPdTa;
    let abscisa = [];
    let ordenada = [];
    let SdTa, colorCurva;

    for (let j = 0; j < NoCurvas; j++) {
        abscisa[j] = PosX1;
        ordenada[j] = eje1_Y - parametro[NoDatos * j] * Math.sin(parametro[NoDatos * j + 2] * conversion);
    }

    for (let t = PosX1; t < PosX2; t += 3) {
        j = (t - PosX1) / fps;
        JPdTa = 0;
        for (let q = 0; q < NoCurvas; q++) {
            pincel.beginPath();
            if (parametro[NoDatos * q] != 0 && parametro[NoDatos * q+1] != 0) {
                angular = 2 * Math.PI / parametro[NoDatos * q + 1];
                if (curvaSeleccionada) {
                    if (curvaClick[q]) {
                        pincel.lineWidth = 3;
                        colorCurva = parametro[NoDatos * q + 3];
                        
                    }
                    else {
                        pincel.lineWidth = 0.3;
                        colorCurva = parametro[NoDatos * q + 3]; "silver";
                    }
                }
                else {
                    if (contador > 6) {
                        if (contador == q + 7 || pMenuFormas) {
                            pincel.lineWidth = 3;
                            colorCurva = parametro[NoDatos * q + 3];
                        }
                        else {
                            if(contador<20){
                                pincel.lineWidth = 0.5;
                                colorCurva = "silver";
                            }
                            else{
                                pincel.lineWidth = 2;
                                colorCurva = parametro[NoDatos * q + 3];
                            }
                        }
                    }
                    else {
                        pincel.lineWidth = 2;
                        colorCurva = parametro[NoDatos * q + 3];
                    }

                }
                
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * j + parametro[NoDatos * q + 2] * conversion));
                JPdTa += SdTa;
                SdTa = (eje1_Y - SdTa);
                pincel.moveTo(abscisa[q], ordenada[q]);
                pincel.lineTo(t, SdTa);
                pincel.strokeStyle = colorCurva;
                abscisa[q] = t;
                ordenada[q] = SdTa;
            }
            pincel.stroke();
            pincel.closePath();
        }
        SdTa = eje2_Y - JPdTa;
        pincel.beginPath();
        pincel.moveTo(abscisa[12], ordenada[12]);
        pincel.lineWidth = 3;
        pincel.strokeStyle = "indigo";
        pincel.lineTo(t, SdTa);
        pincel.stroke();
        pincel.closePath();

        abscisa[12] = t;
        ordenada[12] = SdTa;

    }

}
function onDetalles() {
    var PosX2 = Lienzo.width - PosX1;
    var fuente = "bold 12px Serif";

    for (let q = 0; q < NoCurvas; q++) {
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            let j = parametro[NoDatos * q + 1] / 4;
            let angular = 2 * Math.PI / parametro[NoDatos * q + 1];
            let SdTa, t = j - Td[q], A = t * fps + PosX1;

            while (A < PosX2) {
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * t + parametro[NoDatos * q + 2] * conversion));
                let B = eje1_Y - SdTa;
                pincel.beginPath()
                pincel.fillStyle = parametro[NoDatos * q + 3];
                pincel.strokeStyle = "white";
                pincel.arc(A, B, 3, 0, circunferencia);
                pincel.stroke();
                pincel.fill();
                pincel.closePath();

                if(pAmplitud){
                    pincel.beginPath();
                    pincel.moveTo(A,eje1_Y);
                    pincel.lineTo(A,B);
                    pincel.strokeStyle=SdTa>0?"black":"red";
                    pincel.stroke();
                    pincel.closePath();
                }

                let txt = t.toFixed(2) + " , " + (2 *parametro[NoDatos * q] / AmplitudMax).toFixed(2);
                //let medidaTxt=pincel.measureText(txt).width;
                B = SdTa < 0 ? B + 15 : B - 15;

                pincel.beginPath()
                pincel.fillStyle = "gray";
                pincel.font = fuente;
                pincel.textAlign = "center";
                pincel.textBaseline = "middle";
                pincel.fillText(txt, A, B);
                pincel.closePath();

                j += parametro[NoDatos * q + 1] / 2;
                t = j - Td[q];
                A = t * fps + PosX1;
            }
        }
    }
}
function onMinimos() {
    var PosX2 = Lienzo.width - PosX1;
    var fuente = "bold 12px Serif";
    let j;
    for (let q = 0; q < NoCurvas; q++) {
        j=0;
        if (curvaClick[q] && parametro[NoDatos * q+1] != 0) {
            j= j - Td[q]<0?parametro[NoDatos * q + 1] / 2:0
            let t = j - Td[q], A = t * fps + PosX1;

            while (A < PosX2) {
                let B = eje1_Y;
                pincel.beginPath()
                pincel.fillStyle = parametro[NoDatos * q + 3];
                pincel.strokeStyle = "white";
                pincel.arc(A, B, 3, 0, circunferencia);
                pincel.stroke();
                pincel.fill();
                pincel.closePath();

                let txt = t.toFixed(1) + " , " + "0";
                B = B + 15;

                pincel.beginPath()
                pincel.fillStyle = "gray";
                pincel.font = fuente;
                pincel.textAlign = "center";
                pincel.textBaseline = "middle";
                pincel.fillText(txt, A, B);
                pincel.closePath();

                

                j += parametro[NoDatos * q + 1] / 2;
                t = j - Td[q];
                A = t * fps + PosX1;
            }
        }
    }
}
function onMenuFormas(){
    var fuente = "bold 16px Serif";
    var AnchoMenu=150,AltoMenu=170;
            
    onRoundRect(pincel,CxyMenu.x,CxyMenu.y+20,AnchoMenu,AltoMenu,3,"","lightgray","white");
    pincel.beginPath()
    pincel.font = fuente;
    pincel.textAlign = "left";
    pincel.textBaseline = "middle";
       
    for(let i=0;i<formas.length;i++){
        pincel.fillStyle = "gray";
        if(!(contador<30)){
            if(i==contador-30){
                pincel.fillStyle ="black";
                switch(i){
                    case 0:
                        onFormaDefault();
                        break;
                    case 1:
                        onFormaSenoidal();
                        break;
                    case 2:
                        onFormaTriangulo();
                        break;
                    case 3:
                        onFormaCuadrada();
                        break;
                    case 4:
                        onFormaSierra();
                        break;
                    case 5:
                        onFormaPaquete();
                        break;
                }
            }
        }
        else{
            NoCurvas=rNoCurvas;
            parametro=rParametro.slice();
        }
        pincel.fillText(formas[i], CxyMenu.x+10, CxyMenu.y+40+25*i);
    }
    pincel.closePath();
}
function onBotonXY(C,D,E,colorMenu){
    pincel.beginPath();
        for (let i = 0; i < 3; i++) {
            pincel.fillStyle = colorMenu[i];
            pincel.fillRect(C[i], D, 6, E[i]);
        }
    pincel.closePath();
}
function onBotonFormas(){
    let C = [], D, E = [15, 20, 15], colorMenu = [];
    colorMenu = ["blue", "red", "green"];
    //C = [CxyMenu.x- 13, CxyMenu.x - 3, CxyMenu.x+7];
    C = [23, 33, 43];
    D = 12;
    onBotonXY(C,D,E,colorMenu);
}
function onMenu2(){
    let C = [], D, E = [15, 20, 15], colorMenu = [];
    colorMenu = ["black", "green", "black"];
    C = [CxyMenu2.x- 13, CxyMenu2.x - 3, CxyMenu2.x+7];
    D = eje1_Y-AmplitudMax+ 12;
    onBotonXY(C,D,E,colorMenu);
}
function onMenu2XY(){
    var fuente = "bold 16px Serif";
    var AnchoMenu=150,AltoMenu=210;
            
    onRoundRect(pincel,CxyMenu2.x-AnchoMenu,CxyMenu2.y+20,AnchoMenu,AltoMenu,3,"","lightgray","white");
    pincel.beginPath()
    pincel.font = fuente;
    pincel.textAlign = "left";
    pincel.textBaseline = "middle";
        
    for(let i=0;i<detalles.length;i++){
        pincel.fillStyle = "gray";
        if(!(contador<40)){
            if(i==contador-40){
                pincel.fillStyle ="black";
            }
        }
        pincel.fillText(detalles[i], CxyMenu2.x-AnchoMenu+10, CxyMenu2.y+40+25*i);
    }
    pincel.closePath();
}
function onFormaDefault(){
    //NoCurvas=11;
    parametro = [1.5, 5, 0, "green",
                -1.0, 5, 0, "red",
                1.0,5, 0, "blue",
                0, 0, 0, "#D35400",
                0, 0, 0, "chartreuse",
                0, 0, 0, "darkmagenta",
                0, 0, 0, "darkred",
                0, 0, 0, "lightgreen",
                0, 0, 0, "khaki",
                0, 0, 0, "lightsalmon",
                0, 0, 0, "magenta",
                0, 0, 0, "orange"];
                
                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*parametro[NoDatos*i]*FcToPixeles;
                }

}
function onFormaSenoidal(){
    //NoCurvas=11;
    parametro = [1.7, 5, 0, "green",
                0, 0, 0, "red",
                0,0, 0, "blue",
                0, 0, 0, "#D35400",
                0, 0, 0, "chartreuse",
                0, 0, 0, "darkmagenta",
                0, 0, 0, "darkred",
                0, 0, 0, "lightgreen",
                0, 0, 0, "khaki",
                0, 0, 0, "lightsalmon",
                0, 0, 0, "magenta",
                0, 0, 0, "orange"];
                
                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*parametro[NoDatos*i]*FcToPixeles;
                }

}
function onFormaCuadrada(){
    //NoCurvas=11;
    parametro = [1.27, 10, 0, "green",
                0, 5, 0, "red",
                0.42, 10/3, 0, "blue",
                0, 5, 0, "#D35400",
                0.25, 10/5, 0, "chartreuse",
                0, 5, 0, "darkmagenta",
                0.18, 10/7, 0, "darkred",
                0, 5, 0, "lightgreen",
                0.14, 10/9, 0, "khaki",
                0, 5, 0, "lightsalmon",
                0.12, 10/11, 0, "magenta",
                0, 5, 0, "orange"];

                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*FcToGr*parametro[NoDatos*i]*FcToPixeles;
                }

}
function onFormaSierra(){
    //NoCurvas=11;
    parametro = [0.64, 10, 0, "green",
                -0.32, 10/2, 0, "red",
                0.21, 10/3, 0, "blue",
                -0.16, 10/4, 0, "#D35400",
                0.13, 10/5, 0, "chartreuse",
                -0.11, 10/6, 0, "darkmagenta",
                0.09, 10/7, 0, "darkred",
                -0.08, 10/8, 0, "lightgreen",
                0.07, 10/9, 0, "khaki",
                -0.06, 10/10, 0, "lightsalmon",
                0.06, 10/11, 0, "magenta",
                0, 0, 0, "orange"];

                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*2.0*FcToGr*parametro[NoDatos*i]*FcToPixeles;
                }

}
function onFormaTriangulo(){
    //NoCurvas=11;
    parametro = [0.81, 10, 0, "green",
                0, 0, 0, "red",
                -0.09, 10/3, 0, "blue",
                0, 0, 0, "#D35400",
                0.03, 10/5, 0, "chartreuse",
                0, 0, 0, "darkmagenta",
                -0.02, 10/7, 0, "darkred",
                0, 0, 0, "lightgreen",
                0.01, 10/9, 0, "khaki",
                0, 0, 0, "lightsalmon",
                -0.01, 10/11, 0, "magenta",
                0, 0, 0, "orange"];

                let cont=1;
                for (let i = 0; i < NoCurvas; i++) {
                    cont=i>0?1.5:1.5;
                    parametro[NoDatos*i]=cont*CoefAmplitud*FcToGr*parametro[NoDatos*i]*FcToPixeles;
                }

}
function onFormaPaquete(){
    //NoCurvas=11;
    parametro = [0.08, 10, 0, "green",
                0.19, 10/2, 0, "red",
                0.39, 10/3, 0, "blue",
                0.66, 10/4, 0, "#D35400",
                0.80, 10/5, 0, "chartreuse",
                0.90, 10/6, 0, "darkmagenta",
                0.80, 10/7, 0, "darkred",
                0.66, 10/8, 0, "lightgreen",
                0.39, 10/9, 0, "khaki",
                0.19, 10/10, 0, "lightsalmon",
                0.08, 10/11, 0, "magenta",
                0, 0, 0, "orange"];

                for (let i = 0; i < NoCurvas; i++) {
                    parametro[NoDatos*i]=CoefAmplitud*parametro[NoDatos*i]*FcToPixeles;
                }

}
function onCrestas(PosX2){
    //var PosX2 = Lienzo.width - PosX1;
    let SdTa,angular, j, JPdTa;
        
    for (let t = PosX1; t < PosX2; t += 3) {
        j = (t - PosX1) / fps;
        for (let q = 0; q < NoCurvas; q++) {
            if (curvaClick[q]) {
                angular = 2 * Math.PI / parametro[NoDatos * q + 1];
                SdTa = (parametro[NoDatos * q] * Math.sin(angular * j + parametro[NoDatos * q + 2] * conversion));
                JPdTa=eje1_Y - SdTa;
                //pincel.setLineDash([2,2]);
                pincel.beginPath();
                pincel.lineWidth = 1;
                pincel.strokeStyle =SdTa>0?"#3498DB":"#F1948A";
                pincel.moveTo(t,eje1_Y);
                pincel.lineTo(t,JPdTa);
                pincel.stroke();
                pincel.closePath();
            }
        }
    }
}
function onElongacion(PosX){
    let SdTa,angular, j, JPdTa;
    let t=PosX;
    j = (t - PosX1) / fps;
    for (let q = 0; q < NoCurvas; q++) {
        if (curvaClick[q]) {
            angular = 2 * Math.PI / parametro[NoDatos * q + 1];
            SdTa = (parametro[NoDatos * q] * Math.sin(angular * j + parametro[NoDatos * q + 2] * conversion));
            JPdTa=eje1_Y - SdTa;
                
            pincel.lineWidth = 3;
            pincel.beginPath();
            pincel.strokeStyle =SdTa>0?"black":"red";
            pincel.moveTo(t,eje1_Y);
            pincel.lineTo(t,JPdTa);
            pincel.arc(t,JPdTa,3,0,circunferencia);
            pincel.stroke();
            pincel.closePath();
                                
            pincel.lineWidth = 0.5;
            pincel.strokeStyle ="gray";
            pincel.beginPath();
            pincel.moveTo(PosX1,eje1_Y);
            pincel.lineTo(PosX1,JPdTa);
            pincel.arc(PosX1,JPdTa,3,0,circunferencia);
            pincel.lineTo(t,JPdTa);
            pincel.stroke();
            pincel.closePath();
            }
        }
}
function graficar() {
    over = (7 * factorX);//radio de los circulos y distancia entre ellos
    var PosX2 = Lienzo.width - PosX1;

    //Borra la lienzo
    pincel.clearRect(0, 0, Lienzo.width, Lienzo.height);

    //Define los ejes del M.A.S

    pincel.beginPath();
    pincel.lineWidth = 0.5;
    for (let i = 0; i < 9; i++) {
        pincel.moveTo(PosX1, eje1_Y - CoefLineas[i] * AmplitudMax);
        pincel.lineTo(PosX2, eje1_Y - CoefLineas[i] * AmplitudMax);
    }
    pincel.strokeStyle = "lightblue";
    pincel.stroke();
    pincel.closePath();

    pincel.beginPath();
    pincel.lineWidth = 1.0;
    pincel.moveTo(PosX1, eje1_Y);
    pincel.lineTo(PosX2, eje1_Y);
    pincel.strokeStyle = "black";
    pincel.stroke();
    pincel.closePath();

    pincel.beginPath();
    pincel.lineWidth = 0.5;
    for (let i = 0; i < 9; i++) {
        pincel.moveTo(PosX1, eje2_Y - CoefLineas[i] * AmplitudMax);
        pincel.lineTo(PosX2, eje2_Y - CoefLineas[i] * AmplitudMax);
    }
    pincel.strokeStyle = "lightblue";
    pincel.stroke();
    pincel.closePath();

    pincel.beginPath();
    pincel.lineWidth = 1.0;
    pincel.moveTo(PosX1, eje2_Y);
    pincel.lineTo(PosX2, eje2_Y);
    pincel.strokeStyle = "black";
    pincel.stroke();
    pincel.closePath();

    onBarraSuperior(LineaBase);
       
    //Primer Menú
    CxyMenu = { x: 30, y: 22 };
    onBotonFormas();
    if(pMenuFormas){
        onMenuFormas();
    }
    //Fin del primer Menú
    if (curvaSeleccionada) {
        CxyMenu2={ x: Lienzo.width - 30, y: eje1_Y-AmplitudMax+22 };
        onMenu2();
        if(pMenu2){
            onMenu2XY();
        }
        
        if(pdetalles){
            onDetalles();
        }   
        else{
            if(pMinimos){
                onMinimos();
            }
            else{
                if(pCrestas){
                    onCrestas(incremento=incremento<PosX2?incremento:PosX1);
                    incremento = continuar ? incremento +=3 : incremento;
                }
                else{
                    if(pElongacion){
                        onElongacion(incremento=incremento<PosX2?incremento:PosX1);
                        incremento = continuar ? incremento +=3 : incremento;
                    }
                    else{
                        if(pAmplitud){
                            onDetalles();

                        }
                        
                    }
                }
            }
        }        
    }
    
    fDibujarCurvas();
    onBarraBotones();
       
    if (contador > 0) {
        let descuento = seccion + 5;
        let TipX = [CxyDesplazamiento.x, CxyVelocidad.x, CxyAceleracion.x, CxyMenu.x - 100, CxyMenu2.x + 50];
        let TipY = [CxyDesplazamiento.y - descuento, CxyVelocidad.y - descuento, CxyAceleracion.y - descuento, CxyMenu.y -15, CxyMenu2.y + 30];

        let j = contador - 1;
        let q = j;
        let A = TipX[j] - medidaTxt[q] / 2;
        let B = TipY[j];
        let Amp = "";

        if (contador > 3) {
            switch (contador) {
                case 4:
                    
                    break;
                case 5:
                    
                    break;
                case 6:
                    
                    break;
                default:
                    q = contador - 7;
                    if (vSJAmplitud) {
                        Amp = (2 * parametro[NoDatos * q] / AmplitudMax).toFixed(2);
                        Amp = q + 1 + "=" + Amp + "cms";
                        A = XRect[q] - (pincel.measureText(Amp).width) / 2 - 50;
                        B = LineaBase + 10;
                        q = 5;
                    }
                    else {
                        if (vSJPeriodo) {
                            Amp = q + 1 + "=" + Math.round(parametro[NoDatos * q + 1]) + "s";
                            A = XRect[q] - (pincel.measureText(Amp).width) / 2 - 50;
                            B = LineaBase + 10;
                            q = 6;
                        }
                        else {
                            if (vSJDesfase) {
                                Amp = q + 1 + "=" + Math.round(parametro[NoDatos * q + 2]) + "\u00B0";
                                A = XRect[q] - (pincel.measureText(Amp).width) / 2 - 50;
                                B = LineaBase + 10;
                                q = 7;

                            }
                        }

                    }
                    break;
            }

        }
        onRoundRect(pincel, A, B,
            medidaTxt[q] + (pincel.measureText(Amp).width),
            20, 3, texto[q] + Amp, "blue", "blue");

    }
}

function Dibujo() {
    graficar();
    //incremento = continuar ? ++incremento : incremento;
    setTimeout(
        function () {
            //let idIntervalo = 
            window.requestAnimationFrame(Dibujo);
        }, 1000 / fps);
}

function onInicio() {
    onRedimensionar();
    Dibujo();
}
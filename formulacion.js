window.onload = iniciar;

var puntos = 0;
var operaciones = [];
var notaciones = [];
var tipos = [];
var grupos = [];
var periodos = [];

var respuesta;

var spanPregunta;
var tfRespuesta;
var pResultado;
var spanPuntos;
var cbSustanciasSimples;
var cbOxidosMetales;

function iniciar(){
	spanPregunta = document.getElementById("pregunta");
	tfRespuesta = document.getElementById("respuesta");
	pResultado = document.getElementById("resultado");
	spanPuntos = document.getElementById("puntos");
	//cbFormular = document.getElementById("formular");
	//cbNombrar = document.getElementById("nombrar");
	//cbSustanciasSimples = document.getElementById("sustanciasSimples");
	//cbOxidos = document.getElementById("oxidos");
	
	asignarClickPreguntar('operacion');
	asignarClickPreguntar('notacion');
	asignarClickPreguntar('tipo');
	asignarClickPreguntar('grupo');
	asignarClickPreguntar('periodo');
	
	tfRespuesta.addEventListener("keyup", function(event){
		event.preventDefault();
		if (event.keyCode === 13) {
			comprobar();
		}
	});
	
	verPuntos();
	preguntar();
}

function asignarClickPreguntar(clase){
	var cbs = document.getElementsByClassName('operacion');
	for (let i = 0; i < cbs.length; i++)
		cbs[i].addEventListener("click", preguntar);
}

function preguntar(){
	var formula;
	var nombres = [];
	
	//Vemos la configuración seleccionada
	var cbsOperacion = document.getElementsByClassName('operacion');
	operaciones = [];
	for (let i = 0; i < cbsOperacion.length; i++){
		var cbs = cbsOperacion[i];
		if (cbs.checked)
			operaciones.push(cbs.value);
	}
	
	var cbsNotacion = document.getElementsByClassName('notacion');
	notaciones = [];
	for (let i = 0; i < cbsNotacion.length; i++){
		var cbs = cbsNotacion[i];
		if (cbs.checked)
			notaciones.push(cbs.value);
	}
	
	var cbsTipo = document.getElementsByClassName('tipo');
	tipos = [];
	for (let i = 0; i < cbsTipo.length; i++){
		var cbs = cbsTipo[i];
		if (cbs.checked)
			tipos.push(cbs.value);
	}
	
	var cbsGrupo = document.getElementsByClassName('grupo');
	grupos = [];
	for (let i = 0; i < cbsGrupo.length; i++){
		var cbs = cbsGrupo[i];
		if (cbs.checked)
			grupos.push(parseInt(cbs.value));
	}
	
	var cbsPeriodo = document.getElementsByClassName('periodo');
	periodos = [];
	for (let i = 0; i < cbsPeriodo.length; i++){
		var cbs = cbsPeriodo[i];
		if (cbs.checked)
			periodos.push(parseInt(cbs.value));
	}

	var operacion = elegirAleatorio(operaciones);
	var notacion = elegirAleatorio(notaciones);
	var tipo = elegirAleatorio(tipos);
	
	switch(tipo){
		case 'elementos':
			var elemento = elegir('elemento');
			formula = elemento.simbolo;
			nombres['sistemica'] = elemento.nombre;
			nombres['stock'] = elemento.nombre;
			nombres['tradicional'] = elemento.nombre;
			break;

		case 'naturales':
			var natural = elegirAleatorio(naturales);
			formula = natural.formula;
			var nombre = natural.nombre;
			nombres['sistemica'] = nombre;
			nombres['stock'] = nombre;
			nombres['tradicional'] = nombre;
			break;
			
		case 'oxidos':
			var metal = elegir('oxido');
			var nOxidacion = Math.abs(metal.estadosOxidacionIonica[Math.floor(Math.random() * metal.estadosOxidacionIonica.length)]);
			var divisor = mcd(2, nOxidacion);
			var indiceMetal = 2/divisor;
			if (indiceMetal == 1)
				indiceMetal = '';
			var indiceOxido = nOxidacion/divisor;
			if (indiceOxido == 1)
				indiceOxido = '';
			
			//Fórmula
			formula = metal.simbolo + indiceMetal + 'O' + indiceOxido;
			
			//Nombre Sistémico
			nombres['sistemica'] = prefijoSistemico(indiceOxido) + "óxido de " + prefijoSistemico(indiceMetal) + metal.nombre;
			
			//Nombre de Stock
			nombres['stock'] = 'Óxido de ' + metal.nombre;
			if(metal.estadosOxidacionIonica.length > 1)
					nombres['stock'] += "(" + numRomano(nOxidacion) + ")";
			
			//Nombre Tradicional
			infijos = infijosTradicionales(metal.estadosOxidacionIonica, nOxidacion);
			var nombreTradicional = metal.tradicional;
			if (infijos.sufijo == 'oso')
				nombreTradicional = quitarAcentos(nombreTradicional);
			nombres['tradicional'] = 'Óxido ' + infijos.prefijo + nombreTradicional + infijos.sufijo;
			break;

		case 'peroxidos':
			var metal = elegir('peroxido');
			var nOxidacion = Math.abs(metal.estadosOxidacionIonica[Math.floor(Math.random() * metal.estadosOxidacionIonica.length)]);
			var divisor = mcd(2, nOxidacion);
			var indiceMetal = 2/divisor;
			if (indiceMetal == 1)
				indiceMetal = '';
			var indicePeroxido = nOxidacion/divisor;
			
			//Fórmula
			formula = metal.simbolo + indiceMetal + 'O' + (indicePeroxido * 2);
			
			//Nombre Sistémico
			nombres['sistemica'] = prefijoSistemico(indicePeroxido) + "peróxido de " + prefijoSistemico(indiceMetal) + metal.nombre;
			
			//Nombre de Stock
			nombres['stock'] = 'Peróxido de ' + metal.nombre;
			if(metal.estadosOxidacionIonica.length > 1)
					nombres['stock'] += "(" + numRomano(nOxidacion) + ")";
			
			//Nombre Tradicional
			infijos = infijosTradicionales(metal.estadosOxidacionIonica, nOxidacion);
			var nombreTradicional = metal.tradicional;
			if (infijos.sufijo == 'oso')
				nombreTradicional = quitarAcentos(nombreTradicional);
			nombres['tradicional'] = 'Peróxido ' + infijos.prefijo + nombreTradicional + infijos.sufijo;
			break;

		case 'hidroxidos':
			var metal = elegir('metal');
			var nOxidacion = Math.abs(metal.estadosOxidacionIonica[Math.floor(Math.random() * metal.estadosOxidacionIonica.length)]);
			
			//Fórmula
			if (nOxidacion == 1)
				formula = metal.simbolo + 'OH';
			else
				formula = metal.simbolo + '(OH)' + nOxidacion;
			
			//Nombre Sistémico
			nombres['sistemica'] = prefijoSistemico(nOxidacion) + "hidróxido de " + metal.nombre;
			
			//Nombre de Stock
			nombres['stock'] = 'Hidróxido de ' + metal.nombre;
			if(metal.estadosOxidacionIonica.length > 1)
					nombres['stock'] += "(" + numRomano(nOxidacion) + ")";
			
			//Nombre Tradicional
			infijos = infijosTradicionales(metal.estadosOxidacionIonica, nOxidacion);
			var nombreTradicional = metal.tradicional;
			if (infijos.sufijo == 'oso')
				nombreTradicional = quitarAcentos(nombreTradicional);
			nombres['tradicional'] = 'Hidró	xido ' + infijos.prefijo + nombreTradicional + infijos.sufijo;
			break;

		case 'metalNoMetal':
			var metal = elegir('metal');
			var nOxidacionMetal = Math.abs(metal.estadosOxidacionIonica[Math.floor(Math.random() * metal.estadosOxidacionIonica.length)]);
			var noMetal = elegir('noMetal');
			var nOxidacionNoMetal = Math.abs(noMetal.estadosOxidacionIonica[Math.floor(Math.random() * noMetal.estadosOxidacionIonica.length)]);
			var divisor = mcd(nOxidacionMetal, nOxidacionNoMetal);
			var indiceMetal = nOxidacionNoMetal/divisor;
			if (indiceMetal == 1)
				indiceMetal = '';
			var indiceNoMetal = nOxidacionMetal/divisor;
			if (indiceNoMetal == 1)
				indiceNoMetal = '';

			//Fórmula
			formula = metal.simbolo + indiceMetal + noMetal.simbolo + indiceNoMetal;
			
			//Nombre Sistémico
			nombres['sistemica'] = prefijoSistemico(indiceNoMetal) + quitarAcentos(noMetal.tradicional) + 'uro de ' + prefijoSistemico(indiceMetal) + metal.nombre;
			
			//Nombre de Stock
			nombres['stock'] = quitarAcentos(noMetal.tradicional) + 'uro de ' + metal.nombre;
			if(metal.estadosOxidacionIonica.length > 1)
				nombres['stock'] += "(" + numRomano(nOxidacionMetal) + ")";
			
			//Nombre Tradicional
			infijos = infijosTradicionales(metal.estadosOxidacionIonica, nOxidacionMetal);
			var nombreTradicional = metal.tradicional;
			if (infijos.sufijo == 'oso')
				nombres['tradicional'] = quitarAcentos(nombreTradicional);
			nombres['tradicional'] = quitarAcentos(noMetal.tradicional) + 'uro ' + infijos.prefijo + nombreTradicional + infijos.sufijo;
			break;

		case 'noMetalNoMetal':
			//Vamos a formular AB - 
			var noMetalA; 
			var noMetalB;
			do{
				noMetalA = elegir('noMetal');
				noMetalB = elegir('noMetal');
			}while(noMetalA == noMetalB);
			
			if (ordenNoMetal(noMetalA) < ordenNoMetal(noMetalB)){
				//Cambiamos el orden
				var aux = noMetalA;
				noMetalA = noMetalB;
				noMetalB = aux;
			}
			var nOxidacionA = Math.abs(noMetalA.estadosOxidacionIonica[Math.floor(Math.random() * noMetalA.estadosOxidacionIonica.length)]);
			var nOxidacionB = Math.abs(noMetalB.estadosOxidacionIonica[Math.floor(Math.random() * noMetalB.estadosOxidacionIonica.length)]);
			var divisor = mcd(nOxidacionA, nOxidacionB);
			var indiceA = nOxidacionB/divisor;
			if (indiceA == 1)
				indiceA = '';
			var indiceB = nOxidacionA/divisor;
			if (indiceB == 1)
				indiceB = '';

			//Fórmula
			formula = noMetalA.simbolo + indiceA + noMetalB.simbolo + indiceB;
			
			//Nombre Sistémico
			nombres['sistemica'] = prefijoSistemico(indiceB) + quitarAcentos(noMetalB.tradicional) + 'uro de ' + prefijoSistemico(indiceA) + noMetalA.nombre;
			
			//Nombre de Stock
			nombres['stock'] = quitarAcentos(noMetalB.tradicional) + 'uro de ' + noMetalA.nombre;
			if(noMetalA.estadosOxidacionIonica.length > 1)
				nombres['stock'] += "(" + numRomano(nOxidacionA) + ")";
			
			//Nombre Tradicional
			infijos = infijosTradicionales(noMetalA.estadosOxidacionIonica, nOxidacionA);
			var nombreTradicional = noMetalA.tradicional;
				if (infijos.sufijo == 'oso')
					nombreTradicional = quitarAcentos(nombreTradicional);
			nombres['tradicional'] = quitarAcentos(noMetalB.tradicional) + 'uro ' + infijos.prefijo + nombreTradicional + infijos.sufijo;
			break;

		case 'hidracidos':
			var elemento = elegir('hidracido'); 
			var nOxidacion = Math.abs(elemento.estadosOxidacionIonica[Math.floor(Math.random() * elemento.estadosOxidacionIonica.length)]);
			if (nOxidacion == 1)
				indiceH = '';
			else
				indiceH = nOxidacion;

			//Fórmula
			formula = 'H' + indiceH + elemento.simbolo + '(aq)';
			
			//Nombre Sistémico
			nombres['sistemica'] = quitarAcentos(elemento.tradicional) + 'uro de ' + prefijoSistemico(indiceH) + 'hidrógeno';
			
			//Nombre de Stock
			nombres['stock'] = 'Ácido ' + quitarAcentos(elemento.tradicional) + 'hídrico';
			
			//Nombre Tradicional
			nombres['tradicional'] = 'Ácido ' + quitarAcentos(elemento.tradicional) + 'hídrico';
			
			break;
			
		case 'oxoacidos':
			var noMetal = elegir('oxoacido');
			if (noMetal.estadosOxidacionCovalente == undefined)
				preguntar();
			var nOxidacionNoMetal = Math.abs(noMetal.estadosOxidacionCovalente[Math.floor(Math.random() * noMetal.estadosOxidacionCovalente.length)]);
			var indiceOxigeno = Math.floor(nOxidacionNoMetal / 2) + 1;
			var indiceHidrogeno = indiceOxigeno * 2 - nOxidacionNoMetal;
			if (indiceOxigeno == 1)
				indiceOxigeno = '';
			if (indiceHidrogeno == 1)
				indiceHidrogeno = '';
			//Fórmula
			formula = 'H' + indiceHidrogeno + noMetal.simbolo + 'O' + indiceOxigeno;
			
			//Nombre Sistémico
			nombres['sistemica'] = prefijoSistemico(indiceOxigeno) + 'oxo' + quitarAcentos(noMetal.tradicional) + 'ato de hidrógeno';
			
			//Nombre de Stock
			nombres['stock'] = 'Ácido ' + prefijoSistemico(indiceOxigeno) + 'oxo' + noMetal.tradicional + 'ico';
			if(noMetal.estadosOxidacionCovalente.length > 1)
				nombres['stock'] += "(" + numRomano(nOxidacionNoMetal) + ")";
			
			//Nombre Tradicional
			infijos = infijosTradicionales(noMetal.estadosOxidacionCovalente, nOxidacionNoMetal);
			var nombreTradicional = noMetal.tradicional;
			if (infijos.sufijo == 'oso')
				nombreTradicional = quitarAcentos(nombreTradicional);
			nombres['tradicional'] = 'Ácido ' + infijos.prefijo + nombreTradicional + infijos.sufijo;
			break;
		
		case 'oxosales':
			var noMetal = elegir('oxoacido');
			if (noMetal.estadosOxidacionCovalente == undefined)
				preguntar();
			var nOxidacionNoMetal = Math.abs(noMetal.estadosOxidacionCovalente[Math.floor(Math.random() * noMetal.estadosOxidacionCovalente.length)]);
			var indiceOxigeno = Math.floor(nOxidacionNoMetal / 2) + 1;
			var cargaAnion = indiceOxigeno * 2 - nOxidacionNoMetal;
			var metal = elegir('metal');
			var nOxidacionMetal = Math.abs(metal.estadosOxidacionIonica[Math.floor(Math.random() * metal.estadosOxidacionIonica.length)]);
			var divisor = mcd(nOxidacionMetal, cargaAnion);
			var indiceMetal = cargaAnion/divisor;
			var indiceAnion = nOxidacionMetal/divisor;
			
			if (indiceMetal == 1)
				indiceMetal = '';
			if (indiceAnion == 1)
				indiceAnion = '';
			if (indiceOxigeno == 1)
				indiceOxigeno = '';
			
			//Fórmula
			formula = metal.simbolo + indiceMetal;
			if (indiceAnion != '')
				formula += '(' + noMetal.simbolo + 'O' + indiceOxigeno + ')' + indiceAnion;
			else
				formula += noMetal.simbolo + 'O' + indiceOxigeno;
			
			//Nombre Sistémico
			nombres['sistemica'] = prefijoGriego(indiceAnion) + prefijoSistemico(indiceOxigeno) + 'oxo' + quitarAcentos(noMetal.tradicional) + 'ato de ' + prefijoSistemico(indiceMetal) + metal.nombre;
			
			//Nombre Tradicional
			infijosAnion = infijosTradicionales(noMetal.estadosOxidacionCovalente, nOxidacionNoMetal);
			var nombreTradicionalAnion = noMetal.tradicional;
			if (infijosAnion.sufijo == 'oso')
				infijosAnion.sufijo = 'ito';
			else
				infijosAnion.sufijo = 'ato';
			nombreTradicionalAnion = infijosAnion.prefijo + quitarAcentos(nombreTradicionalAnion) + infijosAnion.sufijo;
			nombres['stock'] = nombreTradicionalAnion; //Para luego
			infijosMetal = infijosTradicionales(metal.estadosOxidacionIonica, nOxidacionMetal);
			var nombreTradicionalMetal = metal.tradicional;
			if (infijosMetal.sufijo == 'oso')
				nombreTradicionalMetal = quitarAcentos(nombreTradicionalMetal);
			nombres['tradicional'] = nombreTradicionalAnion + ' ' + nombreTradicionalMetal + infijosMetal.sufijo;
			
			//Nombre de Stock
			nombres['stock'] += ' de ' + metal.nombre;
			if(metal.estadosOxidacionIonica.length > 1)
				nombres['stock'] += "(" + numRomano(nOxidacionMetal) + ")";
			
			break;

		default:
			//console.error("Tipo desconocido: " + tipo);
			return;
	}
	
	//Buscamos el nombre tradicional
	for(let i = 0; i < tradicionales.length; i++){
		if (tradicionales[i].formula == formula)
			nombres["tradicional"] = tradicionales[i].nombre;
	}
	
	switch(operacion){
		case "formular":
			pregunta = nombres[notacion];
			respuesta = formula;
			break;
		case "nombrar":
			pregunta = "(" + notacion.charAt(0).toUpperCase() + notacion.slice(1) + "): " + formula ;
			respuesta = nombres[notacion];
			break;
		default:
			//console.error("Operacion desconocida: " + operacion);
			return;
	}

	//Elegimos una pregunta
	if (Array.isArray(pregunta))
		pregunta = elegirAleatorio(pregunta);
	//Creamos un array de posibles respuestas
	if (!Array.isArray(respuesta)){
		respuesta = [respuesta];
	}

	//Excepciones y Poner la primera mayúscula
	pregunta = pregunta.replace(/sulfururo/g, "sulfuro");
	pregunta = pregunta.replace(/sulfurato/g, "sulfato");
	pregunta = pregunta.replace(/sulfurito/g, "sulfito");
	pregunta = pregunta.replace(/silicuro/g, "siliciuro");
	pregunta = pregunta.replace(/carbonuro/g, "carburo");
	pregunta = pregunta.replace(/fosforato/g, "fosfato");
	pregunta = pregunta.replace(/fosforito/g, "fosfito");
	pregunta = pregunta.replace(/fosforuro/g, "fosfuro");
	pregunta = pregunta.charAt(0).toUpperCase() + pregunta.slice(1);
	for(let i = 0; i < respuesta.length; i++){
		respuesta[i] = respuesta[i].replace(/sulfururo/g, "sulfuro");
		respuesta[i] = respuesta[i].replace(/sulfurato/g, "sulfato");
		respuesta[i] = respuesta[i].replace(/sulfurito/g, "sulfito");
		respuesta[i] = respuesta[i].replace(/silicuro/g, "siliciuro");
		respuesta[i] = respuesta[i].replace(/carbonuro/g, "carburo");
		respuesta[i] = respuesta[i].replace(/fosforato/g, "fosfato");
		respuesta[i] = respuesta[i].replace(/fosforito/g, "fosfito");
		respuesta[i] = respuesta[i].replace(/fosforuro/g, "fosfuro");
		respuesta[i] = respuesta[i].charAt(0).toUpperCase() + respuesta[i].slice(1);
	}	
	
	spanPregunta.innerHTML = pregunta.replace(/(\d+)/g, "<sub>$1</sub>");
	tfRespuesta.value="";
	tfRespuesta.focus();
}

/**
 * Elige un elemento aleatoriamente de un array
 * */
function elegirAleatorio(array){
	return array[Math.floor(Math.random() * array.length)];
}

function comprobar(){
	var log = document.getElementById('log');
	log.innerHTML = log.innerHTML + '<br />Pregunta: ' + pregunta ;
	log.innerHTML = log.innerHTML + '<br />   Tu Respuesta: ' + tfRespuesta.value;
	if (respuesta.indexOf(tfRespuesta.value) != -1){
		pResultado.innerHTML = "¡Correcto!";
		puntos++;
		log.innerHTML = log.innerHTML + ' -> Correcta';
	}
	else{
		pResultado.innerHTML = "Incorrecto: La respuesta correcta es " + respuesta + " y no " + tfRespuesta.value;
		puntos--;
		if (puntos < 0)
			puntos = 0;
		log.innerHTML = log.innerHTML + ' -> Inorrecta';
		log.innerHTML = log.innerHTML + '<br />   Respuesta Correcta: ' + respuesta;
	}
	
	verPuntos();
	setTimeout(preguntar, 700);
}

function verPuntos(){
	spanPuntos.innerHTML = puntos;
}

/**
 * Cálculo del Máximo Común Divisor por el algoritmo de Euclides
**/
function mcd(a, b){
	//console.log("mcd(" + a + ", " + b +")");
	var _a = Math.abs(a);
	var _b = Math.abs(b);
	var _c;
	if (_a < _b){
		_c = _a;
		_a = _b;
		_b = _c;
	}
	if (_a % _b == 0)
		return _b;
	else
		return mcd(_a - _b, _b);
}

function numRomano(num){
	switch(num){
		case 1:
			return 'I';
		case 2:
			return 'II';
		case 3:
			return 'III';
		case 4:
			return 'IV';
		case 5:
			return 'V';
		case 6:
			return 'VI';
		case 7:
			return 'VII';
		case 8:
			return 'VIII';
		default:
			console.log("numRomano desconocido: " + num);
	}
}

function prefijoSistemico(num){
	switch(num){
		case '':
		case 1:
			//return 'mono';
			return '';
		case 2:
			return 'di';
		case 3:
			return 'tri';
		case 4:
			return 'tetra';
		case 5:
			return 'penta';
		case 6:
			return 'hexa';
		case 7:
			return 'hepta';
		case 8:
			return 'octa';
		case 9:
			return 'nona';
		case 10:
			return 'deca';
		case 11:
			return 'undeca';
		case 12:
			return 'dodeca';
		default:
			return '(prefijo sin determinar:' + num + ')';
	}
}

function prefijoGriego(num){
	switch(num){
		case '':
		case 1:
			return '';
		case 2:
			return 'bis';
		case 3:
			return 'tris';
		case 4:
			return 'tetrakis';
		case 5:
			return 'pentakis';
		case 6:
			return 'hexakis';
		case 7:
			return 'heptakis';
		case 8:
			return 'octakis';
		default:
			return '(prefijo sin determinar:' + num + ')';
	}
}

function infijosTradicionales(estadosOxidacion, estado){
	var infijos = {};
	
	//Buscamos la posición del estado de oxidacion en la lista
	var posicion;
	for(posicion = 0; posicion < estadosOxidacion.length; posicion++)
		if (estadosOxidacion[posicion] == estado)
			break;
	
	switch(estadosOxidacion.length){
		case 1:
			return {'prefijo' : '', 'sufijo' : 'ico'};
		case 2:
			switch(posicion){
				case 0:
					return {'prefijo' : '', 'sufijo' : 'oso'};
				case 1:
					return {'prefijo' : '', 'sufijo' : 'ico'};
			}
		case 3:
		case 4:
			switch(posicion){
				case 0:
					return {'prefijo' : 'hipo', 'sufijo' : 'oso'};
				case 1:
					return {'prefijo' : '', 'sufijo' : 'oso'};
				case 2:
					return {'prefijo' : '', 'sufijo' : 'ico'};
				case 3:
					return {'prefijo' : 'per', 'sufijo' : 'ico'};
			}
		default:
	}
}

function quitarAcentos(nombre){
	var resultado = nombre;
	resultado = resultado.replace(/á/g, "a");
	resultado = resultado.replace(/é/g, "e");
	resultado = resultado.replace(/í/g, "i");
	resultado = resultado.replace(/ó/g, "o");
	resultado = resultado.replace(/ú/g, "u");
	return resultado;
}

/**
 * Elije al azar un elemento según el tipo de formulación.
 * */
function elegir(tipo){
	var elemento;
	var repetir;
	do{
		switch(tipo){
		case 'elemento':
			elemento = elementos[Math.floor(Math.random() * elementos.length)];
			break;
		case 'oxido':
			do {
				elemento = elementos[Math.floor(Math.random() * elementos.length)];
			}while(elemento.simbolo == 'O' || elemento.tipo == 'gas noble');
			break;
		case 'peroxido':
			do {
				elemento = elementos[Math.floor(Math.random() * elementos.length)];
			}while(elemento.tipo != 'metal' && elemento.simbolo != 'H');
			break;
		case 'metal':
			do {
				elemento = elementos[Math.floor(Math.random() * elementos.length)];
			}while(elemento.tipo != 'metal');
			break;
		case 'noMetal':
			do {
				elemento = elementos[Math.floor(Math.random() * elementos.length)];
			}while(elemento.tipo == 'metal' || elemento.tipo == 'gas noble' || elemento.simbolo == 'O');
			break;
		case 'hidracido':
			do {
				elemento = elementos[Math.floor(Math.random() * elementos.length)];
			}while((elemento.grupo != 17 && elemento.grupo != 16) || elemento.simbolo == 'O');
		case 'oxoacido':
			do {
				elemento = elementos[Math.floor(Math.random() * elementos.length)];
			}while( (elemento.tipo != 'no metal' && elemento.simbolo != 'Cr' && elemento.simbolo != 'Mn') || elemento.simbolo == 'O');
			break;
		}
		
		//Gestión de Periodo y grupo
		repetir = true;
		if (grupos.includes(elemento.grupo) || periodos.includes(elemento.periodo))
			repetir = false;
		
	}while(repetir);
				
	return elemento;
}

/**
 * Devuelve el número de orden para la formulación NoMetal-NoMetal
 * */
function ordenNoMetal(elemento){
	var orden;
	orden = Math.abs(elemento.grupo - 17)*6 + elemento.periodo - 1;
	if (elemento.grupo < 16)
		orden++;
	if (elemento.simbolo == 'H')
		orden = 13;
	return orden;
}
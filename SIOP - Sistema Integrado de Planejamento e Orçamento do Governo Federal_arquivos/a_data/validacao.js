/*Fun��o Pai de Mascaras*/
function Mascara(o, f) {
	//alert('chamou Mascara()')
	v_obj = o;
	v_fun = f;
	setTimeout("execmascara()", 1);
}

function validarData(campo) {
	var expReg = /^(([0-2]\d|[3][0-1])\/([0]\d|[1][0-2])\/[1-2][0-9]\d{2})$/;
	var msgErro = 'Data invalida.';
	if (!((campo.value.match(expReg)) && (campo.value!='') && (campo.value != null))) {
		alert(msgErro);
		campo.value = '';
		campo.focus();
	} 
}

/* Fun��o para validar data */
function isDataValida(campo) {
	var elementos = campo.split("/");
	if (elementos.length != 3) return false;
	var ano = new Number(elementos[2]);
	var mes = new Number(elementos[1]);
	var dia = new Number(elementos[0]);
	if (isNaN(ano) || isNaN(mes) || isNaN(dia)) return false;
	if (ano < 1) return false;
	if (mes < 1 || mes > 12) return false;
	if (dia < 1 || dia > 31) return false;
	if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && (dia > 30)) return false;
	if (mes == 2) {
		if ((ano % 4 == 0 && !(ano % 100 == 0)) || (ano % 400 == 0)) {
			if (dia > 29) return false;
		}
		else {
			if (dia > 28) return false;
		}
	}
	return true;
}

/* Fun��o para alterar a apar�ncia do campo enquanto a data � digitada */
function demonstraDataInvalida(campo) {
	var conteudo = campo.value.replace(" ", "");

	if(conteudo.length > 10){
		campo.value = campo.value.substring(0,conteudo.length-1);
	}
	
	if (conteudo.length > 0 && !isDataValida(conteudo)) {
		jQuery(campo).css('background-color', '#FECBCC');
		jQuery(campo).css('color', '#900');
	} else {
		jQuery(campo).css('background-color', '');
		jQuery(campo).css('color', '');
	}
}

/*Fun��o que Executa os objetos*/
function execmascara() {
	v_obj.value = v_fun(v_obj.value);
}

/*Fun��o que Determina as express�es regulares dos objetos*/
function leech(v) {
	v = v.replace(/o/gi, "0");
	v = v.replace(/i/gi, "1");
	v = v.replace(/z/gi, "2");
	v = v.replace(/e/gi, "3");
	v = v.replace(/a/gi, "4");
	v = v.replace(/s/gi, "5");
	v = v.replace(/t/gi, "7");
	return v;
}

/*Fun��o que permite apenas numeros*/
function Integer(v) {
	if (v.replace(/\D/g, "")) {
		if (v <= 2147483647) {
			return v ; 
		} else {
			alert("Valor n�o pode ser maior que 2147483647.");
			return "";
		}
	}
	return "";
}

/*Fun��o que padroniza telefone (11)94184-1241*/
function Telefone(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/^(\d\d)(\d)/g, "($1)$2");
	v=v.replace(/(\d)(\d{4})$/,"$1-$2");
	return v;
}

/*Fun��o que padroniza telefone (11) 41841241*/
function TelefoneCall(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/^(\d\d)(\d)/g, "($1) $2");
	return v;
}

/*Fun��o que padroniza CPF*/
function Cpf(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/(\d{3})(\d)/, "$1.$2");
	v = v.replace(/(\d{3})(\d)/, "$1.$2");

	v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
	return v;
}

/*Fun��o que padroniza CPF*/
function CpfOuLogin(v) {
	v = v.replace(/(^[A-Za-z0-9]{3})(\d)/, "$1.$2");
	v = v.replace(/(\d{3})(\d)/, "$1.$2");
	if (v.length >= 11 && v.charAt(11) == ".") {
		v = v.substring(0,11) + "-" + v.substring(12);
	}
	return v;
}

/*Fun��o que padroniza CEP*/
function Cep(v) {
	v = v.replace(/D/g, "");
	v = v.replace(/^(\d{5})(\d)/, "$1-$2");
	return v;
}

/*Fun��o que padroniza CNPJ*/
function Cnpj(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/^(\d{2})(\d)/, "$1.$2");
	v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
	v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
	v = v.replace(/(\d{4})(\d)/, "$1-$2");
	return v;
}

/*Fun��o que permite apenas numeros Romanos*/
function Romanos(v) {
	v = v.toUpperCase();
	v = v.replace(/[^IVXLCDM]/g, "");

	while (v.replace(
			/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/, "") != "")
		v = v.replace(/.$/, "");
	return v;
}

/*Fun��o que padroniza o Site*/
function Site(v) {
	v = v.replace(/^http:\/\/?/, "");
	dominio = v;
	caminho = "";
	if (v.indexOf("/") > -1)
		dominio = v.split("/")[0];
	caminho = v.replace(/[^\/]*/, "");
	dominio = dominio.replace(/[^\w\.\+-:@]/g, "");
	caminho = caminho.replace(/[^\w\d\+-@:\?&=%\(\)\.]/g, "");
	caminho = caminho.replace(/([\?&])=/, "$1");
	if (caminho != "")
		dominio = dominio.replace(/\.+$/, "");
	v = "http://" + dominio + caminho;
	return v;
}

/*Fun��o que padroniza DATA*/
function Data(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/(\d{2})(\d)/, "$1/$2");
	v = v.replace(/(\d{2})(\d)/, "$1/$2");
	return v;
}

/*Fun��o que padroniza DATA*/
function Hora(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/(\d{2})(\d)/, "$1:$2");
	return v;
}

/*Fun��o que padroniza valor mon�tario*/
function Valor(v) {
	v = v.replace(/\D/g, ""); // Remove tudo o que n�o � d�gito
	v = v.replace(/^([0-9]{3}\.?){3}-[0-9]{2}$/, "$1.$2");
	v = v.replace(/(\d)(\d)$/, "$1.$2");
	//	v = v.replace(/(\d{3})(\d)/g,"$1,$2")
	v = v.replace(/(\d)(\d{2})$/, "$1.$2"); // Coloca ponto antes dos 2 �ltimos
											// digitos
	return v;
}

/*Fun��o que padroniza valor mon�tario*/
function ValorDuasCasasDecimais(v) {
	
	// Remove tudo o que n�o � d�gito
	v = v.replace(/\D/g, "");
	v = v.replace(/^([0-9])$/,"0,0$1");
	v = v.replace(/^([0-9]{2})$/,"0,$1");
	v = v.replace(/^([0]{2})([0-9]{2})$/,"0,$2");
	v = v.replace(/^([0]{1})([0-9]+)$/,"$2");
	v = v.replace(/^([0-9]{3}\.?){3},[0-9]{2}$/, "$1,$2");
	v = v.replace(/(\d)(\d{2})$/, "$1,$2");
	
	return v;
}

/*Fun��o que padroniza valor mon�tario*/
function ValorUmaCasaDecimal(v) {
	
	// Remove tudo o que n�o � d�gito
	v = v.replace(/\D/g, "");
	
	if(v.length == 0) {
		return v;
	}
	v = v.replace(/^([0-9])$/,"0,0$1");
	v = v.replace(/^([0-9]{1})$/,"0,$1");
	v = v.replace(/^([0]{1})([0-9]{1})$/,"0,$2");
	v = v.replace(/^([0]{1})([0-9]+)$/,"$2");
	v = v.replace(/^([0-9]{3}\.?){3},[0-9]{1}$/, "$1,$2");
	v = v.replace(/(\d)(\d{1})$/, "$1,$2");
	
	return v;
}

/*Fun��o que padroniza Area*/
function Area(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/(\d)(\d{2})$/, "$1.$2");
	
	return v;

}

/*Funcao que converte valores para mai�sculo */
function Maiusculo(v) {
	v = v.toUpperCase();
	return v;
}

function Mes(v) {
	v = v.replace(/\D/g, "");
	v = v.replace(/^0$/, "");
	v = v.replace(/^1([3-9])$/, "");
	v = v.replace(/^[2-9][0-9]$/, "");
	return v;

}

function formataNumeroInteiro(fld) {
	fld.value = fld.value.replace(/\D/g, "");
}

function formataNumeroFracionarioIndicandoDecimais(fld, milSep, decSep, qteDec)
{
	var strCheck = '0123456789';
	var aux = '';
	var inteiro = '';
	var decimal = '';

	if (qteDec == 0) decSep = "";

	// extrai somente os n�meros
	for (var i = 0; i < fld.value.length; i++)
		if (strCheck.indexOf(fld.value.charAt(i)) != -1) 
			aux += fld.value.charAt(i);

	if (aux == '') {
		fld.value = aux;
		return;
	}
	
	// elimina os zeros � esquerda
	for (var i = 0; i < aux.length; i++)
		if (aux.charAt(i) != '0') {
			aux = aux.substring(i);
			break;
		}

	// se a quantidade de d�gitos significativos for menor ou igual � quantidade de decimais, acrescenta zeros � esquerda para completar o tamanho das decimais mais um inteiro
	while (aux.length < (qteDec + 1)) {
		aux = "0" + aux;
	}

	// acrescenta o separador de decimais
	inteiro = aux.substring(0, aux.length - qteDec);
	decimal = aux.substring(aux.length - qteDec);
	
	// acrescenta os separadores de milhares
	if (inteiro.length > 3) {
		var posSep = inteiro.length - 3;

		do {
			// adiciona o separador de milhares antes dos 3 �ltimos caracteres
			inteiro = inteiro.substring(0, posSep) + milSep + inteiro.substring(posSep);
			posSep = inteiro.indexOf(milSep) - 3;
		} while (posSep > 0);
}

	fld.value = inteiro + decSep + decimal;
}

function formataNumeroFracionario(fld, milSep, decSep) 
{
	formataNumeroFracionarioIndicandoDecimais(fld, milSep, decSep, 2);
	/*
	var i = j = 0;
	var len = len2 = 0;
	var strCheck = '0123456789';
	var aux = aux2 = '';
	var valorFormatado = '';
	
	len = fld.value.length;
	
	if (len > 1) {
		for(i = 0; i < len; i++)
			if ((fld.value.charAt(i) != '0') && (fld.value.charAt(i) != decSep)) 
				break;		
	}
	aux = '';
	for(; i < len; i++)
		if (strCheck.indexOf(fld.value.charAt(i))!=-1) 
			aux += fld.value.charAt(i);

	len = aux.length;
	if (len == 0)
	    valorFormatado = '';
	if (len == 1)
	    valorFormatado = '0'+ decSep + '0' + aux;
	if (len == 2)
	    valorFormatado = '0'+ decSep + aux;
	if (len > 2) 
	{
		aux2 = '';
		for (j = 0, i = len - 3; i >= 0; i--) 
		{
			if (j == 3) 
			{
				aux2 += milSep;
				j = 0;
			}
			aux2 += aux.charAt(i);
			j++;
		}
		valorFormatado = '';
		len2 = aux2.length;
		for (i = len2 - 1; i >= 0; i--)
			valorFormatado += aux2.charAt(i);
		valorFormatado += decSep + aux.substr(len - 2, len);
	}
		 
	fld.value = valorFormatado;
 	*/		 
}

function formataNumeroFracionarioComSinal(fld, milSep, decSep) 
{
	formataNumeroFracionarioComSinalIndicandoDecimais(fld, milSep, decSep, 2);
}
function formataNumeroFracionarioComSinalIndicandoDecimais(fld, milSep, decSep, qteDec) 
{
	var len = 0;
	var primeiroCaracter = '';
	var ultimoCaracter = '';

	len = fld.value.length;

	// guarda o primeiro caracter para verificar se o sinal de negativo
	if (len > 0) {
		primeiroCaracter = fld.value.charAt(0);
		ultimoCaracter = fld.value.charAt(len-1);

		// se o primeiro caracter for o sinal de negativo, retira-o da express�o para n�o comprometer o restante da formata��o; ao final ele ser� recolocado na express�o formatada
		if (primeiroCaracter == '-' && fld.value != '-') {
			fld.value = fld.value.substring(1, len);
		}
	}

	if (fld.value != '-') formataNumeroFracionarioIndicandoDecimais(fld, milSep, decSep, qteDec);
	
	// se o valor formatado � significativo e o primeiro caracter for sinal de negativo, adiciona o sinal ao valor formatado
	if ((primeiroCaracter == '-' || ultimoCaracter == '-') && isValorSignificativo(fld.value)) {
		fld.value = '-' + fld.value;
	}
}

function isValorSignificativo(valor) {
	var strCheck = '123456789';
	var retorno = false;
	for (var i = 0; i < strCheck.length; i++) {
		if (valor.indexOf(strCheck.charAt(i)) != -1) {
			retorno = true;
			break;
		}
	}
	return retorno;
}

function currencyFormat(fld, milSep, decSep, event) {
	if (!isDeveFormatar(event)){
	   return;
	}
	formataNumeroFracionario(fld, milSep, decSep);
}

function currencyFormatWithSignal(fld, milSep, decSep, event) {
	if (!isDeveFormatar(event)) {
	   return;
	}
	formataNumeroFracionarioComSinal(fld, milSep, decSep);
}

function doubleFormatWithSignal(fld, milSep, decSep, event, qteDec) {
	if (!isDeveFormatar(event)) {
	   return;
	}
	formataNumeroFracionarioComSinalIndicandoDecimais(fld, milSep, decSep, qteDec);
}
	
function isDeveFormatar(event) {
	var keyCode = 0;
	var blFormatar = true; 
	
	// pega o c�digo da tecla pressionada
	if(window.event) {
		keyCode = window.event.keyCode;
	}else if(event.which){
		keyCode = event.which; 
		}

	//testa a tecla pressionada
	if(keyCode >= 9 && keyCode <= 45){
		blFormatar = false;
	}
	
	return blFormatar;
}

function dataFormat(fld, event) 
{
	var i = j = 0;
	var len = len2 = 0;
	var aux = aux2 = '';
	var valorFormatado = '';
	var strCheck = '0123456789';	
	
	var blFormatar = true; 
	
	//Se a tecla n�o altera o valor do campo, ent�o n�o precisa formatar.
	if(window.event) {		
		if (window.event.keyCode >= 9 && window.event.keyCode <= 45){			
			blFormatar = false;			
		}		
	}else{		
		if(event.which){			
			if(event.which >= 9 && event.which <= 45){				
				blFormatar = false;				
			}			
		}	 
	}

	if (!blFormatar){		
	   return;	   
	}
	
	len = fld.value.length;
	aux = fld.value;
	fld.value = aux.toUpperCase();
	
	aux = '';
	
	for(i = 0; i < len; i++)
		if (strCheck.indexOf(fld.value.charAt(i)) != -1) 
			aux += fld.value.charAt(i);
	
	len = aux.length;

	if (len > 2) 
	{
		aux2 = '';
		
		for (j = 0, i = 0; i <= len - 1; i++) 
		{
			//Separa o dia
			if (j == 2){
				aux2 += "/";
			}
			
			//Separa o m�s
			if (j == 4)	{
				aux2 += "/";
			}			

			aux2 += aux.charAt(i);
			j++;
		}
		
		valorFormatado = '';
		len2 = aux2.length;
		
		for (i = 0; i <= len2 - 1; i++){			
			valorFormatado += aux2.charAt(i);			
		}
		
		fld.value = valorFormatado;		
	}		
}

function funcionalProgramaticaFormat(fld, milSep, event) 
{
	var i = j = 0;
	var len = len2 = 0;
	var aux = aux2 = '';
	var valorFormatado = '';
	var strCheck = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';	
	
	var blFormatar = true; 
	
	//Se a tecla n�o altera o valor do campo, ent�o n�o precisa formatar.
	if(window.event) {
		
		if (window.event.keyCode >= 9 && window.event.keyCode <= 45){
			
			blFormatar = false;
			
		}
		
	}else{
		
		if(event.which){
			
			if(event.which >= 9 && event.which <= 45){
				
				blFormatar = false;
				
			}
			
		}	 

	}

	if (!blFormatar){
		
	   return;
	   
	}
	
	len = fld.value.length;
	aux = fld.value;
	fld.value = aux.toUpperCase();
	
	aux = '';
	
	for(i = 0; i < len; i++)
		if (strCheck.indexOf(fld.value.charAt(i))!=-1) 
			aux += fld.value.charAt(i);

	len = aux.length;

	if (len > 3) 
	{
		aux2 = '';
		
		for (j = 0, i = 0; i <= len - 1; i++) 
		{
			//Separa a esfera
			if (j == 2) 
			{
				aux2 += milSep;
			}
			
			//Separa a UO
			if (j == 7) 
			{
				aux2 += milSep;
			}
			
			//Separa a Fun��o
			if (j == 9) 
			{
				aux2 += milSep;
			}
			
			//Separa a Sub-Fun��o
			if (j == 12) 
			{
				aux2 += milSep;
			}
			
			//Separa o Programa
			if (j == 16) 
			{
				aux2 += milSep;
			}
			
			//Separa a A��o
			if (j == 20) 
			{
				aux2 += milSep;
			}

			aux2 += aux.charAt(i);
			j++;
		}
		
		valorFormatado = '';
		len2 = aux2.length;
		
		for (i = 0; i <= len2 - 1; i++){
			
			valorFormatado += aux2.charAt(i);
			
		}
		
		fld.value = valorFormatado.toUpperCase();
		
	}	
	
}

function longFormat(fld, milSep, event) 
{
	var i = j = 0;
	var len = len2 = 0;
	var aux = aux2 = '';
	var valorFormatado = '';
	var strCheck = '0123456789';
	
	
	var blFormatar = true; 
	
	//Se a tecla n�o altera o valor do campo, ent�o n�o precisa formatar.
	if(window.event) {
		if (window.event.keyCode >= 9 && window.event.keyCode <= 45){ 
			blFormatar = false;
		}
	}else if(event.which){
		if(event.which >= 9 && event.which <= 45){
			blFormatar = false;
		}
	}	 

	if (!blFormatar){
	   return;
	}
	
	len = fld.value.length;
	aux = '';
	for(i = 0; i < len; i++)
		if (strCheck.indexOf(fld.value.charAt(i))!=-1) 
			aux += fld.value.charAt(i);

	len = aux.length;

	if (len > 3) 
	{
		aux2 = '';
		for (j = 0, i = len - 1; i >= 0; i--) 
		{
			if (j == 3) 
			{
				aux2 += milSep;
				j = 0;
			}
			aux2 += aux.charAt(i);
			j++;
		}
		valorFormatado = '';
		len2 = aux2.length;
		for (i = len2 - 1; i >= 0; i--)
			valorFormatado += aux2.charAt(i);	
		fld.value = valorFormatado;
	} else {
		fld.value = aux;
	}
}

function longFormatComMenos(fld, milSep, event) 
{
	var i = j = 0;
	var len = len2 = 0;
	var aux = aux2 = '';
	var valorFormatado = '';
	var strCheck = '0123456789';
	

	var blFormatar = true; 
	
	//Se a tecla n�o altera o valor do campo, ent�o n�o precisa formatar.
	if(window.event) {
		if (window.event.keyCode >= 9 && window.event.keyCode <= 45){ 
			blFormatar = false;
		}
	}else if(event.which){
		if(event.which >= 9 && event.which <= 45){
			blFormatar = false;
		}
	}	 

	if (!blFormatar){
	   return;
	}

	len = fld.value.length;
	if (len > 0) {
		primeiroCaracter = fld.value.charAt(0);
		ultimoCaracter = fld.value.charAt(len-1);
		//alert(primeiroCaracter);
		// se o primeiro caracter for o sinal de negativo, retira-o da express�o para n�o comprometer o restante da formata��o; ao final ele ser� recolocado na express�o formatada
		if (primeiroCaracter == '-' && fld.value != '-') {
			fld.value = fld.value.substring(1, len);
		}
	}

	
	len = fld.value.length;
	aux = '';
	for(i = 0; i < len; i++)
		if (strCheck.indexOf(fld.value.charAt(i))!=-1) 
			aux += fld.value.charAt(i);

	len = aux.length;

	if (len > 3) 
	{
		aux2 = '';
		for (j = 0, i = len - 1; i >= 0; i--) 
		{
			if (j == 3) 
			{
				aux2 += milSep;
				j = 0;
			}
			aux2 += aux.charAt(i);
			j++;
		}
		valorFormatado = '';
		len2 = aux2.length;
		for (i = len2 - 1; i >= 0; i--)
			valorFormatado += aux2.charAt(i);	
		fld.value = valorFormatado;
	} else {
		fld.value = aux;
	}

	//alert(primeiroCaracter + " " + ultimoCaracter + " " + isValorSignificativo(fld.value));
	// se o valor formatado � significativo e o primeiro caracter for sinal de negativo, adiciona o sinal ao valor formatado
	if ((primeiroCaracter == '-' || ultimoCaracter == '-') && isValorSignificativo(fld.value)) {
		fld.value = '-' + fld.value;
	}
}

function doubleFormat(fld, milSep, decSep, event) 
{
	var i = j = 0;
	var len = len2 = 0;
	var strCheck = '0123456789';
	var aux = aux2 = '';
	var valorFormatado = '';
	
	var blFormatar = true; 
	
	//Se a tecla n�o altera o valor do campo, ent�o n�o precisa formatar.
	if(window.event) {
		if (window.event.keyCode >= 9 && window.event.keyCode <= 45){ 
			blFormatar = false;
		}
	}else if(event.which){
		if(event.which >= 9 && event.which <= 45){
			blFormatar = false;
		}
	}	 

	if (!blFormatar){
	   return;
	}
	
	len = fld.value.length;
	if (len > 1) {
		for(i = 0; i < len; i++)
			if ((fld.value.charAt(i) != '0') && (fld.value.charAt(i) != decSep))
				break;
		if (i < len) {
			aux = '';
			for(; i < len; i++)
				if (strCheck.indexOf(fld.value.charAt(i))!=-1) 
					aux += fld.value.charAt(i);
		} else {
			aux = '0';
		}
	} else {
		aux = fld.value;
	}

	len = aux.length;
	if (len == 0)
	    valorFormatado = '';
	else if (len == 1)
	    valorFormatado = '0' + decSep + '0' +  '0' + '0' + aux;
	else if (len == 2)
	    valorFormatado = '0'+ decSep + '0' + '0' + aux;
	else if (len == 3)
	    valorFormatado = '0'+ decSep + '0' + aux;
	else if (len == 4)
	    valorFormatado = '0'+ decSep + aux;
	else if (len > 4) 
	{
		aux2 = '';
		for (j = 0, i = len - 5; i >= 0; i--) 
		{
			if (j == 3) 
			{
				aux2 += milSep;
				j = 0;
			}
			aux2 += aux.charAt(i);
			j++;
		}
		valorFormatado = '';
		len2 = aux2.length;
		for (i = len2 - 1; i >= 0; i--)
			valorFormatado += aux2.charAt(i);
		valorFormatado += decSep + aux.substr(len - 4, len);
		 
	}
	fld.value = valorFormatado;
}

function isValidKey(e, strCheck) {
		
	if (window.event) {
		if (strCheck.indexOf(String.fromCharCode(event.keyCode)) == -1) 
			return event.returnValue =  false;
		else
			return event.returnValue = true;
	} else if (e.which) {
		if (e.which == 8)
			return true;
		if (strCheck.indexOf(String.fromCharCode(e.which)) == -1){
			return false;
		} else {
			return true;	
		}
	} else {
    	return true;
  	}
}

function isNumero(e) {
	var keyCode = -1;
	
	if(window.event) {
		keyCode = event.keyCode;
	} else if(e.which) {
		keyCode = e.which;
	} else {
    	return true;
  	}
	
	if (keyCode >= 96 && keyCode <= 105) {
		// 0 a 9 do teclado númerico
		return event.returnValue = true;
	} else if (keyCode == 8 || keyCode == 35 || keyCode == 36 || keyCode == 37 || keyCode == 39 || keyCode == 46) {
		// teclas delete, backspace, <, >, home, end
		// para permitir navegação no campo de edição
		return event.returnValue = true;
	} else if (keyCode < 48 || keyCode > 57) {
		return event.returnValue =  false;
	} else {
		return event.returnValue = true;
	}
}

function isNumeroOuLetra(e) {
	
	if(window.event) {				
		
		if(event.keyCode == 8)
			return true;

		if ( (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)){
			return  event.returnValue =  true;
		}else
			return  event.returnValue = false;
		
	}else if(e.which){
		
		if(e.which == 8)
			return true;
		if( (e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122)){
			return true;
		}else{
			return false;	
		}
	}else {
    	return true;
  	}
}

function isNumeroOuMenos(e) {
	if (window.event) {
		if ( (event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 45) 
			return  event.returnValue =  false;
		else
			return  event.returnValue = true;
	} else if (e.which) {
		if (e.which == 8)
			return true;
		if ((e.which < 48 || e.which > 57) && e.which != 45) {
			return false;
		} else {
			return true;	
		}
	} else {
    	return true;
  	}
}

function isNumeroOuEspaco(e) {
	if (window.event) {
		if ( (event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 32) 
			return  event.returnValue =  false;
		else
			return  event.returnValue = true;
	} else if (e.which) {
		if (e.which == 8)
			return true;
		if ((e.which < 48 || e.which > 57) && e.which != 32) {
			return false;
		} else {
			return true;	
		}
	} else {
    	return true;
  	}
}

function isCaractere(e) {
	
	if(window.event) {		
		
		if ( (event.keyCode < 48) || ((event.keyCode > 90) && (event.keyCode < 97)) || (event.keyCode > 122) ) 
			return  event.returnValue =  false;
		else
			return  event.returnValue = true;	
		
	}else if(e.which){		
		
		if(e.which == 8)
			return true;
		if ( (e.which  < 48) || ((e.which > 90) && (e.which < 97)) || (e.which > 122) ){
			
			return false;
			
		}else{
			
			return true;
			
		}
	}else {
		
    	return true;
    	
  	}
}

function isCaractereOuEnter(e) {
	
	if(window.event) {
		
		if ( (event.keyCode != 13 && event.keyCode < 48) || ((event.keyCode > 90) && (event.keyCode < 97)) || (event.keyCode > 122) ) 
			return  event.returnValue =  false;
		else
			return  event.returnValue = true;
		
	}else if(e.which){
		
		if(e.which == 8)
			return true;
		if ( ( e.which  != 13 && e.which  < 48) || ((e.which > 90) && (e.which < 97)) || (e.which > 122) ){
			
			return false;
			
		}else{
			
			return true;
			
		}
	}else {
		
    	return true;
    	
  	}
}

function isEnter(e) {
	if (window.event) {
		return event.returnValue = (event.keyCode == 13);
	} else if (e.which) {
		return e.which == 13;
	} else {
    	return true;
  	}
}

function AlertaAlteracao(alterado, nome){
	document.getElementById(nome).style.visibility = alterado;
}

function calculaCustoMedio(idCustoMedio, idCustoTotal, idQuantidade){
	var custoTotal, qtd;
	var custoMedio = 0;
	var fldCustoMedio;
	
	fldCustoMedio = document.getElementById(idCustoMedio);
	
	// pega os valores contidos em cada input
	custoTotal = document.getElementById(idCustoTotal).value;
	qtd = document.getElementById(idQuantidade).value;
	
	// retira pontos, virgulas, tudo que n�o for n�mero
	custoTotal = custoTotal.replace(/\./g, '').replace(/,/g, '.');
	qtd = qtd.replace(/\./g, '').replace(/,/g, '.');
	
	if (qtd != '' && custoTotal != '' && qtd > 0) {
		custoMedio = custoTotal / qtd;
		custoMedio = custoMedio.toFixed(2);
	}
	fldCustoMedio.value = custoMedio;		
	formataNumeroFracionario(fldCustoMedio, '.', ',');

	//alert("CustoTotal: " + custoTotal + " Qtd: " + qtd + " CustoMedio: " + custoMedio);
}

function addMascaraMoeda(el, prec) {
	jQuery(el).maskMoney({
		allowZero: true,
		allowNegative: false,
		affixesStay: false,
		thousands: '',
		decimal: '',
		precision: prec
	});
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function removerMascaraMoeda(el) {
	jQuery(el).maskMoney('destroy');
	
	var isValid = /([0-9]+\.)*[0-9]+/.test(jQuery(el).val());
	
	if (!isValid) {
		var val = jQuery(el).val().replace(/\./g, "");
		val = val.replace(/,/g, ".");
		
		console.log(isNumber(val));
		console.log(val);
		
		if (isNumber(val)) {
			jQuery(el).val(parseInt(val));
		} else {
			jQuery(el).val("0");
		}
		
		addMascaraMoeda(el, 0);
		jQuery(el).maskMoney('destroy');
	}
}

function mascaraNaturezaDespesa(el, num) {
	var mask = "";
	
	switch (num) {
	case 5:
		mask = ".99";
	case 4:
		mask = ".99" + mask;
	case 3:
		mask = ".99" + mask;
	case 2:
		mask = ".9" + mask;
	case 1:
		mask = "9" + mask;
	}
	
	jQuery(el).mask(mask);
}

function mascaraCnpj(el) {
	jQuery(el).mask("99.999.999/9999-99");
}

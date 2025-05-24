var MAX_FONTE = 20;
var MIN_FONTE = 10;
var AUMENTAR = 1;
//Vari�vel que armazena o tamanho corrente
var fonteCorrente = 11; //Definir o tamanho inicial com o tamanho da fonte do css padr�o.
var fonteClasse = 11; //Definir o tamanho inicial com o tamanho da fonte do css padr�o.
function zoomClasse(tipoOperacao) { //1 para reduzir, 2 para aumentar
	if (tipoOperacao == AUMENTAR) {
		if (fonteClasse < MAX_FONTE) {
			fonteClasse++;			
		}
	}
	else { //Se n�o for aumentar, reduz.
		if (fonteCorrente > MIN_FONTE) {
			fonteClasse--;
		}				
	}
	jQuery('.siop_miolo *').css({'font-size': fonteClasse + 'px'});
}

var newwindow;
function poptastic(url) {
	newwindow = window.open(url, 'name', 'height=600,width=1004');
	if (window.focus) {
		newwindow.focus();
	}
}

function poptastic2(url) {
	newwindow = window
			.open(url, 'name', 'location=1,status=1,scrollbars=1');
	if (window.focus) {
		newwindow.focus();
	}
}

function mostraModulos() {
	var ArvoreModulos = document.getElementById('divArvoreModulos');
	
	ArvoreModulos.style.display = (ArvoreModulos.style.display == 'none') ? '' : 'none';
}

function ocultaModulos() {
	a = document.getElementById('divArvoreModulos');
	if (a == undefined) return;
	a.style.display = 'none';
}

function imposeMaxLength(Object, MaxLen, event)
{
	// alterado para considerar os c�digos de tabela ascii, a partir do c�digo 32 (espa�o) os caracteres devem ser considerados
	if(window.event) {
		// if (window.event.keyCode == 8 || (window.event.keyCode >= 33 && window.event.keyCode <= 46) ){ 
		if (window.event.keyCode <= 31){
			return true;
			
		}
	} else{
		// if (event.which == 8 || (event.which >= 33 && event.which <= 46) ){
		if (event.which <= 31 ){
			return true;
			
		}

	}

	// faz o teste considerando o tamanho m�ximo-1, porque o campo ainda n�o recebeu o caractere que est� sendo inserido
	return (Object.value.length <= (MaxLen-1));  
}

/**
 * getElementsByTagAndClassName
 * Recupera um array com elementos por uma tag espec�fica e/ou uma classe 
 * espec�fica podendo ou n�o especificar um elemento conteiner
 */
function getElementsByTagAndClassName( tagName, className, parentElement )
{
	var elements = new Array ();
	var parent = ( parentElement ) ? parentElement : document.body;
	var children = parent.getElementsByTagName( tagName );
	for ( var a = 0; a < children.length; a++ )
	{
	  
	  if ( hasClass ( className, children[a] ) )
	    elements.push ( children[a] );
	}
	return elements;
}
  

/**
 * hasClass
 * Retorna se um determinad objeto possui determinada classe
 */
function hasClass (className, obj) {
	if (typeof obj == 'undefined' || obj==null || !RegExp) { return false; }
	var re = new RegExp("(^|\\s)" + className + "(\\s|$)");
	if (typeof(obj)=="string") {
		return re.test(obj);
	}
	else if (typeof(obj)=="object" && obj.className) {
		return re.test(obj.className);
	}
	return false;
}

function todosElementos(){
	var todos_elementos = document.getElementsByTagName('*');
	for (var i=0; i<todos_elementos.length; i++){
		var el = todos_elementos[i];
		alert(todos_elementos[i].id + " - " + todos_elementos[i].type);
		if (todos_elementos[i].type == 'button') alert(todos_elementos[i].id);
	}
}

function conta(msg, chave){
	  i = 0;
	  pos = msg.search(chave);
	  while (pos > -1){
		msg = msg.substr(pos + 1, msg.length - pos);
		pos = msg.search(chave);
		i++;
	  }
	  return i;
}

function todosCheckbox(){
	var todos_elementos = document.getElementsByTagName('*');
	for (var i=0; i<todos_elementos.length; i++){
		if (todos_elementos[i].type == 'checkbox'){
			titulo = todos_elementos[i].title;
			if (titulo.search('Acao') > -1){
				if (todos_elementos[i].checked == 1) todos_elementos[i].checked = 0;
				else todos_elementos[i].checked = 1;
			}
		}
	}
}

/** Fun��es para manter a posi��o do scroll na �rvore ap�s o seu redimensionamento **/

var idContainerArvore = 'form:subTelaArvore:containerArvore';
var arvoreScrollX = 0;
var arvoreScrollY = 0;

function saveScrollContainerArvore() {
	arvoreScrollX = document.getElementById(idContainerArvore).scrollLeft;
	arvoreScrollY = document.getElementById(idContainerArvore).scrollTop;
}

function restoreScrollContainerArvore() {
	document.getElementById(idContainerArvore).scrollLeft = arvoreScrollX;
	document.getElementById(idContainerArvore).scrollTop = arvoreScrollY;
}

function registrarEventosDivisorQualitativo() {
	saveScrollContainerArvore();
	document.getElementById(idContainerArvore).onscroll = saveScrollContainerArvore;
}

function posicionarMenuArvoreQualitativo(idMenu, leftPosition, areaWidth, popupWidth) {
	if (leftPosition > areaWidth - popupWidth) {
		jQuery(document.getElementById(idMenu)).find('.iceMnuBarSubMenu').css('left', (areaWidth-2*popupWidth)+'px');
		document.getElementById(idMenu + ':popupRaiz_sub').style.left = (areaWidth-popupWidth)+'px';
	} else if (leftPosition > areaWidth - 2*popupWidth) {
		var popupRaiz = document.getElementById(idMenu + ':popupRaiz_sub');
		var popupRaizLeft = popupRaiz.style.left;
		jQuery(document.getElementById(idMenu)).find('.iceMnuBarSubMenu').css('left', (popupRaizLeft.replace('px','')-popupWidth)+'px');
		popupRaiz.style.left = popupRaizLeft;
	}
}

function corrigirLarguraDivisor() {
	let dvrCnt = jQuery('.icePnlDvrCnt').width()
	let posicaoDivisor = parseInt(jQuery('.icePnlDvrFst')[0].style.width)
	let dvrFstEsperada = dvrCnt*posicaoDivisor/100;
	let dvrSpt = jQuery('.icePnlDvrSpt').width()
	let dvrSnd = jQuery('.icePnlDvrSnd').width()
	if ((dvrCnt < dvrFstEsperada + dvrSpt + dvrSnd) || (dvrSnd < (80-posicaoDivisor)*dvrCnt/100)) {
		jQuery('.icePnlDvrSnd').css('width', Math.trunc(dvrCnt - dvrFstEsperada - dvrSpt - 5) + 'px');
	}
}

/** Bloqueio da tela **/

function bloquearTela(blockOn) {
	if (document.getElementById('hiddenLayer') != null) {
		var elem = document.getElementById('hiddenLayer');
		elem.className = blockOn ? 'blockScreenLayer' : 'blockScreenLayerNone';
	}
	return true;
} 

/** Bloqueio de cliques **/

clickBlocked = false;
function blockClick(blockOn) {
	clickBlocked = blockOn;
}

/** Scroll com o mouse em cima **/

/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: voidvector | http://www.webdeveloper.com/forum/showthread.php?t=201460 */

var UpdateInterval = 80;
var PixelPerInterval = 24;
var scrollerInterval;
var scrollPanel = null;

function start_scroll_right(panel, pixelInterval) {
	scrollPanel = panel;
	PixelPerInterval = pixelInterval;
	scrollerInterval = setInterval(scroll_left, UpdateInterval);
}

function scroll_right() {
	scrollPanel.scrollLeft -= PixelPerInterval;
}

function start_scroll_left(panel, pixelInterval) {
	scrollPanel = panel;
	PixelPerInterval = pixelInterval;
	scrollerInterval = setInterval(scroll_right, UpdateInterval);
}

function scroll_left() {
	scrollPanel.scrollLeft += PixelPerInterval;
}

function start_scroll_bottom(panel, pixelInterval) {
	scrollPanel = panel;
	PixelPerInterval = pixelInterval;
	scrollerInterval = setInterval(scroll_top, UpdateInterval);
}

function scroll_bottom() {
	scrollPanel.scrollTop -= PixelPerInterval;
}

function start_scroll_top(panel, pixelInterval) {
	scrollPanel = panel;
	PixelPerInterval = pixelInterval;
	scrollerInterval = setInterval(scroll_bottom, UpdateInterval);
}

function scroll_top() {
	scrollPanel.scrollTop += PixelPerInterval;
}

function stop_scrolling() {
	clearInterval(scrollerInterval);
}

/** Anima a div1 transitando para a div2. As divs devem possuir a mesma largura
 * que, neste caso, � 1000px. Deve ser passada a classe do css, n�o o id, devido ao comportamento 
 * do icefaces de mudan�a dos ids.
 * 
 * @param classe1 - String contendo o nome da classe 1
 * @param classe2 - String contendo o nome da classe 2
 * @param ordem   - Inteiro informando a ordem, caso seja passado, altera a ordem da transi��o
 */
function animarTransicaoDivs(classe1, classe2, ordem) {
	if (ordem != undefined) {
		jQuery('.' + classe2).animate({left: '+1000px'}, { queue: false, duration: 400 });
		jQuery('.' + classe1).animate({left: '0px'}, { queue: false, duration: 400 });
	}
	else {
		jQuery('.' + classe1).animate({left: '-1000px'}, { queue: false, duration: 400 });
		jQuery('.' + classe2).animate({left: '0px'}, { queue: false, duration: 400 });
	}	
}

function animar_direita_para_esquerda(div1, div2, ajustar_pai) {
	p = jQuery(div1).parent();

	if (jQuery(div1).css('top') == "auto") {
		jQuery(div2).css('top', -(jQuery(div1).height()) + 'px');
	} else {
		jQuery(div2).css('top', -(jQuery(div1).height())+parseInt(jQuery(div1).css('top')) + 'px');
	}

	jQuery(div1).animate({left: -p.width() + 'px'}, { queue: false, duration: 400 });
	jQuery(div2).animate({left: '0px'}, { queue: false, duration: 400 });
	if (ajustar_pai != false) p.animate({height: jQuery(div2).height() + 'px'}, { queue: false, duration: 400 });
}

function animar_esquerda_para_direita(div1, div2, ajustar_pai) {
	p = jQuery(div1).parent();
	jQuery(div1).animate({left: '0px'}, { queue: false, duration: 400 }); 
	jQuery(div2).animate({left: p.width() + 'px'}, { queue: false, duration: 400 });
	if (ajustar_pai != false) p.animate({height: jQuery(div1).height() + 'px'}, { queue: false, duration: 400 });
}

function incrementar_altura(elem, incremento) {
	e = jQuery(elem);
	e.animate({height: (e.height() + incremento) + 'px'}, { queue: false, duration: 400 });
}

function ajustar_altura(elem, a) {
	//e = jQuery(elem);
	//e.animate({height: a + 'px'}, { queue: false, duration: 200 });
}

function ajustar_altura_pai(elem) {
	//p = jQuery(elem).parent();
	//p.animate({height: jQuery(elem).height() + 'px'}, { queue: false, duration: 200 });
}

function ajusta_posicao_caixa_importacao_exportacao(caixa, tamanho_ajuste) {
	novaPosicao = jQuery(caixa).offset().left - (tamanho_ajuste + ((screen.width - 1024) / 2));
	if (novaPosicao < 0) novaPosicao = 0;
	novaPosicao = novaPosicao * -1;
	jQuery(caixa + ' > div').css('left', novaPosicao + 'px');
}

function ajusta_largura_do_conteudo_da_tab() {
	jQuery('#_conteudo_da_tab > div').css('width', 'auto');
	if (jQuery('#_conteudo_da_tab').outerWidth(true) >= jQuery('#barra_de_tabs').outerWidth(true)) return;
	ow = jQuery('#_conteudo_da_tab > div').outerWidth(true);
	iw = jQuery('#_conteudo_da_tab > div').innerWidth();
	jQuery('#_conteudo_da_tab > div').css('width', (jQuery('#barra_de_tabs').width() - (ow-iw)) + 'px');	
}

function show_mask() {
    var maskHeight = jQuery(document).height();
    var maskWidth = jQuery(window).width();
    jQuery('#mask').css({'width':maskWidth,'height':maskHeight});
    jQuery('#mask').show();    
}

function transicao_animada(elem, direction) {
	var d1 = jQuery(elem);
	var d2;
	if (direction == -1) d2 = d1.next(); else d2 = d1.prev();
	doTransicaoAnimada(d1, d2, direction);
}

function transicao_animada_de_para(elem, nextElem, direction) {
	var d1 = jQuery(elem);
	var d2 = jQuery(nextElem);
	doTransicaoAnimada(d1, d2, direction);
}

function doTransicaoAnimada(d1, d2, direction) {
	var container = d1.parent();
	
	container.css('position','relative');
	d1.css('width', container.width() + 'px');
	d2.css('width', container.width() + 'px');
	d1.css('position','absolute');
	d2.css('position','absolute');

	container.css('height', d1.height() + 'px');
	container.css('width', d1.width() + 'px');
	if (d1.css('left') == d2.css('left')) {
		d2.css('left', d1.width() + 'px');
	}
	d2.css('display', 'block');
	d2.animate({'left': 0}, { 'queue': false, duration: 500 });
	d1.animate({'left': d1.width() * direction}, { 'queue': false, duration: 500 });
	var cf = function() { 
		container.css('height', 'auto');
		container.css('width', 'auto');
		d1.css('display', 'none');
		d1.css('position','static');
		d1.css('width','auto');
		d2.css('position','static');
		d2.css('width','auto');
		container.css('position','static');
	};
	container.animate({'height': d2.height() + 'px'}, { 'queue': false, duration: 500, complete: cf});

}

function altera_display(id) {
	// Op��es para o atributo display - block, inline e none
	if(document.getElementById(id).style.display=="none") {
		document.getElementById(id).style.display = "block";
	} else {
		document.getElementById(id).style.display = "none";
	}
	
	if ($('#siop_conteudo_painel_transicao').css('height') == '560px')
		$('#siop_conteudo_painel_transicao').animate({height: '480px'}, { queue: false, duration: 400 });
	else
		$('#siop_conteudo_painel_transicao').animate({height: '560px'}, { queue: false, duration: 400 });
	$(this).next().slideToggle('slow')
	.siblings('.siop_conteudo_instrucoes_texto:visible').slideToggle('fast');
	// aqui come�a o funcionamento do plugin		
	$(this).toggleText('Exibir','Ocultar')
	.siblings('span').next('.siop_conteudo_instrucoes_texto:visible').prev()
	.toggleText('Exibir','Ocultar')

}

var _height = 'auto';

function mostrar_sheet(numero_painel) {
	_mostrar_sheet('#first_div_sheet');
}

function _mostrar_sheet(id) {
	var sheet = jQuery(id);
	var container = sheet.parent();
	container.css('position','relative');
	sheet.css('width','100%');
	sheet.css('position','absolute');
	sheet.css('display', 'block');
	_height = sheet.height();
	sheet.css('height', '0');
	sheet.animate({ height: '' + _height + 'px' }, { queue: false, duration: 300 });
	//container.animate({ height: sheet.height() + 'px' }, { queue: false, duration: 500 });
}

function esconder_sheet(numero_painel) {
	_esconder_sheet('#first_div_sheet');
}

function _esconder_sheet(id) {
	var sheet = jQuery(id);
	var container = sheet.parent();
	sheet.animate({ height: 0 }, { queue: false, duration: 300, 
		complete: function() { 	
			container.css('position','static'); 
			sheet.css('display', 'none');
			sheet.css('height', '' + _height + 'px');
		} 
	});
	//container.animate({ height: body.height() + 'px' }, { queue: false, duration: 500 });
}

function togglePosicaoAviso() {
	jQuery('.containerMensagem').toggleClass('siop_aviso_scrolling',
			document.getElementById("iceModalFrame") != null ||
			jQuery(window).scrollTop() > jQuery('#form').offset().top);
}

jQuery(window).scroll(function() {
	togglePosicaoAviso();
});

function alternarPopoverConfiguracao() {
	var botao = jQuery("#exibeConfig");
	var popup = jQuery("#popover_configuracao");
	
	popup.toggle();
}

/* Funções Questionário Informações Complementares Inciso XXXVI*/
function preencheComoNao(id){
	
	var elementos = jQuery("#"+id+" input[type=radio] ");
	jQuery("#"+id+" input[type=radio] ").attr('checked',elementos[1].value);

}

function temRespostaPreenchida(id) {
	return (jQuery("#"+id+" input[type=radio]:checked ").val()) ? true : false; 
}

function temRespostaPreenchidaComSim(id) {
	
	var elementos = jQuery("#"+id+" input[type=radio] ");
	
	//if(elementos.length === 0)
	//	return false;
	
	if ( elementos[0].value == jQuery("#"+id+" input[type=radio]:checked ").val())
		return true
	else
		return false
	 
}

function ePrimeiraPergunta(id){

	var ordem  = id.split("-");
	ordem = ordem[2];

	return (ordem == '1') ? true : false;
}

function eQuartaPergunta(id){

	var ordem  = id.split("-");
	ordem = ordem[2];

	return (ordem == '4') ? true : false;
}

function escondePergunta(id){
							
	jQuery("#"+id).hide();
	
}

function mostraPergunta(id){
	jQuery("#"+id).show();
}

function abreProximaPergunta(id){
	
	var temp = id.split("-");
	var localizador = temp[1];
	var ordem = temp[2];

	ordem++;

	
	var idProxima = "pergunta-"+localizador+"-"+ordem;	
	jQuery("#"+idProxima).show();
	
	if(ordem < 4){
		preencheComoNao(idProxima);
	}
}

function escondeProximasPerguntas(id){
	
	var temp = id.split("-");
	var localizador = temp[1];
	var ordem = temp[2];

	ordem++;

	for (i = ordem; i <= 4; i++) {
		var idProxima = "pergunta-"+localizador+"-"+i;	
		
		escondePergunta(idProxima);
	}

}

function escondePerguntas(){
	//console.log("esconde perguntas");
	var listaPerguntas = [];
	jQuery('.perguntaLocalizador').each(function (index, value){
		
		//console.log(value);
		
		var id = jQuery(this).attr('id');
		var ordem  = id.split("-");
		
		var pergunta = {};
		pergunta.id = id;
		pergunta.ordem = ordem[2];
				
		jQuery("#"+id+" input[type=radio] ").on("change", function(){
			if(temRespostaPreenchidaComSim(id)) {
				abreProximaPergunta(id);
			} else {
				escondeProximasPerguntas(id);
			}
		});
		
		//console.log("ID: "+id);
		
		if(!temRespostaPreenchida(id)){
			//console.log("Não tem resposta [ "+id+"]");
			pergunta.temResposta = false;
			
			if(ePrimeiraPergunta(id)){
				//console.log("Primeira Pergunta");
				preencheComoNao(id);
			}else{
				
				escondePergunta(id);
				
				if(eQuartaPergunta(id)){
				
					var posPergAnterior = listaPerguntas.length - 1;
					var perguntaAnterior = listaPerguntas[posPergAnterior];
									
					if(perguntaAnterior.temResposta){
						if(temRespostaPreenchidaComSim(perguntaAnterior.id))
							mostraPergunta(id);
					}	
				} else {
					//preencheComoNao(id);
				}	
			}
			
		}else{
			//console.log("Tem resposta [ "+id+"]");
			pergunta.temResposta = true;
			mostraPergunta(id)
		}
		
		listaPerguntas.push(pergunta);
	});
	
	//console.log(listaPerguntas);
}

function abreListaDeVersoes() {
	jQuery( document ).ready(function() {
		document.getElementById('form:abrirNovidadesVersao').click()
	});
}

function limitaTexto(elemento, MaxLen) {
	if (elemento.value.length > MaxLen) { 
		elemento.value = elemento.value.substring(0, MaxLen);
	}
}

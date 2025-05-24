jQuery.fn.toggleText = function(a,b) {
	return   this.html(this.html().replace(new RegExp("("+a+"|"+b+")"),function(x){return(x==a)?b:a;}));
}

$(document).ready(function(){
	if ($('.siop_conteudo_instrucoes_texto') === null) return;
	$('.siop_conteudo_instrucoes_texto').before('<span title="Clique para exibir as instruções" id="form:j_id418" class="iceOutTxt siop_conteudo_instrucoes_link_mostrar"><img title="Instruções" src="temas/tema3/_imagens/icones/icon_instrucoes_20x20.png" id="form:j_id419" class="iceGphImg" alt="Instruções"></span>');
	$('.siop_conteudo_instrucoes_texto').css('display', 'none')
	$('span', '.siop_conteudo_instrucoes').click(function() {
		if ($('#siop_conteudo_painel_transicao').css('height') == '560px')
			$('#siop_conteudo_painel_transicao').animate({height: '480px'}, { queue: false, duration: 400 });
		else
			$('#siop_conteudo_painel_transicao').animate({height: '560px'}, { queue: false, duration: 400 });
		$(this).next().slideToggle('slow')
		.siblings('.siop_conteudo_instrucoes_texto:visible').slideToggle('fast');
		// aqui começa o funcionamento do plugin		
		$(this).toggleText('Exibir','Ocultar')
		.siblings('span').next('.siop_conteudo_instrucoes_texto:visible').prev()
		.toggleText('Exibir','Ocultar')
	});
})
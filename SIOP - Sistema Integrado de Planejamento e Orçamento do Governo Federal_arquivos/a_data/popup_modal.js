jQuery(document).ready(function() {	

	jQuery('a[name=modal]').click(function(e) {
		e.preventDefault();
		
		var id = jQuery(this).attr('href');
	
		var maskHeight = jQuery(document).height();
		var maskWidth = jQuery(window).width();
	
		jQuery('.siop_popup_mask').css({'width':maskWidth,'height':maskHeight});

		jQuery('.siop_popup_mask').fadeIn(1000);	
		jQuery('.siop_popup_mask').fadeTo("slow",0.6);	
	
		//Get the window height and width
		var winH = jQuery(window).height();
		var winW = jQuery(window).width();
              
		jQuery(id).css('top',  winH/2-jQuery(id).height()/2);
		jQuery(id).css('left', winW/2-jQuery(id).width()/2);
	
		jQuery(id).fadeIn(2000);
		document.getElementById('frmLogin:txtUsuario').focus();
		window.scrollTo(0, 0);
	});

	jQuery('#siop_resposta_dialog').click(function(e) {
		e.preventDefault();
		
		var id = jQuery(this).attr('href');
	
		var maskHeight = jQuery(document).height();
		var maskWidth = jQuery(window).width();
	
		jQuery('.siop_popup_mask').css({'width':maskWidth,'height':maskHeight});

		jQuery('.siop_popup_mask').fadeIn(1000);	
		jQuery('.siop_popup_mask').fadeTo("slow",0.8);	
	
		//Get the window height and width
		var winH = jQuery(window).height();
		var winW = jQuery(window).width();
              
		jQuery(id).css('top',  winH/2-jQuery(id).height()/2);
		jQuery(id).css('left', winW/2-jQuery(id).width()/2);
	
		jQuery(id).fadeIn(2000); 
		window.scrollTo(0, 0);
	});
	
	jQuery('.siop_popup_window .siop_popup_fechar').click(function (e) {
		e.preventDefault();
		
		jQuery('.siop_popup_mask').hide();
		jQuery('.siop_popup_window').hide();
	});
	
	jQuery('.siop_popup_window_pub .siop_popup_fechar').click(function (e) {
		e.preventDefault();
		
		jQuery('.siop_popup_mask').hide();
		jQuery('.siop_popup_window_pub').hide();
	});
	
});

/**
 * Função utilizada para o banner na página de login
 * 
 * @param elemento
 * @param event
 */
	
function mostrarPopupBannerModal(elemento, event) {
	if (event != null) {
		if (event.preventDefault) {
			event.preventDefault();			
		} else {
			event.returnValue = false;
		}
	}	
	
	var id = elemento;

	var maskHeight = jQuery(document).height();
	var maskWidth = jQuery(window).width();

	jQuery('.siop_popup_mask').css({'width':maskWidth,'height':maskHeight});

	jQuery('.siop_popup_mask').fadeIn(1000);	
	jQuery('.siop_popup_mask').fadeTo("slow",0.8);	

	//Get the window height and width
	var winH = jQuery(window).height();
	var winW = jQuery(window).width();
          
	jQuery('#' + id).css('top',  winH/2-jQuery('#' + id).height()/2);
	jQuery('#' + id).css('left', winW/2-jQuery('#' + id).width()/2);
	
	jQuery('#' + id).fadeIn(2000);
	window.scrollTo(0, 0);
}
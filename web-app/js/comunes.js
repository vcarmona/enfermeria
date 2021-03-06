$(document).ready(function() {
	
	checkInternetExplorer()
	
	$.datepicker.setDefaults($.datepicker.regional['es']);
	
	anularBack()
	$( "#pacienteauto").watermark($("#pacienteauto").attr('title'));
	$( "#pacienteauto").focus()
	
	//desabilita el click derecho
	$(document).bind("contextmenu",function(e){
        return false;
    });
	
})

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

function autoComplete(input,url,hidden,funcSelect, minimumTrigger, idArea, idServicio, historico){
	
	
	$(input).autocomplete({
		  source: function(request, response){
			  
			    var idArea = $("#pisos option:selected" ).val()
				var idServicio = $("#servicios option:selected" ).val()
				var historico = $('#historico').is(':checked')
			  
			  	if(idArea == undefined){
					idArea = -1 //Todas las areas
				}
				
				if(idServicio == undefined){
					idServicio = -1 //Todos los servicios
				}
				
			  
			   $.ajax({
				type: "GET",
			    url: url,		    
			    dataType: "json",		    
			    data: {
	                term : request.term,
	                idArea: idArea,
	                idServicio:idServicio,
	                historico:historico,
	                tipoHistorico:$('#tipoHistorico').val()
	            },		    
			    success: function(data){
			     response(data); // set the response
			    },
			    error: function(e){ // handle server errors
			    	mostrarMensaje("Ocurrio un error al realizar la busqueda","error")
			    }
			   });
		   
		  },
		  minLength: minimumTrigger, // triggered only after minimum 2 characters have been entered.
		  autoFocus: true,
		  select: function(event, ui) { // event handler when user selects a company from the list.
			  $(hidden).val(ui.item.id); // update the hidden field.
			  
			  funcSelect();
		  }
	 });
	
}

function autoCompletePaciente(funcSelect){
	autoComplete("#pacienteauto","/enfermeria/autoComplete/consultarPacientes","#idPaciente",funcSelect,3)
}


function isNumberPointKey(evt)
{
  var keyPressed = (evt.which) ? evt.which : event.keyCode
	return !((keyPressed !=13) && (keyPressed != 46) && (keyPressed != 8) && (keyPressed < 48 || keyPressed > 57));
}


function isNumberKey(evt)
{
  var keyPressed = (evt.which) ? evt.which : event.keyCode
	return !((keyPressed !=13) && (keyPressed != 46) && (keyPressed != 8) && (keyPressed < 48 || keyPressed > 57));
}

function anularBack() {
	$(document).keydown(function(e) {
		var element = e.target.nodeName.toLowerCase();
		if (element != 'input' && element != 'textarea') {
		    if (e.keyCode === 8) {
		        return false;
		    }
		}
	});
}


function redirectConsultarHoja(idHoja,turnoActual,mensaje,nuevaHoja){
	$("#idHojaR").val(idHoja);
	$("#turnoActualR").val(turnoActual);
	$("#mensajeR").val(mensaje);
	$("#nuevaHojaR").val(nuevaHoja);
	
	$("#formRedirect").submit();
}


function guardarTextTabla(idHoja,idProcedimiento,valor){
	
	var request = $.ajax({
		type:'POST',		
		url: '/enfermeria/util/guardarTextTabla',
		async:false,
		data:{
			idHoja:idHoja, 
			idProcedimiento:idProcedimiento,
			valor:valor
		},
		dataType:"json"	        
	}).fail(function(){
		
		mostrarMensaje("Ocurrio un error al guardar el texto","error")
		
	})
	
}

function guardarTextTablaConHora(idHoja,idProcedimiento,valor,hora,modificarHora, idMensaje,mensaje){
	
	var request = $.ajax({
		type:'POST',		
		url: '/enfermeria/util/guardarTextTablaConHora',
		async:false,
		data:{
			idHoja:idHoja, 
			idProcedimiento:idProcedimiento,
			valor:valor,
			hora:hora,
			modificarHora:modificarHora
		},
		dataType:"json"	        
	}).done(function( json ) {		
		$('#'+idMensaje).html(mensaje)		
	}).fail(function(){		
		mostrarMensaje("Ocurrio un error al guardar el texto","error")		
	})
	
			
}


function guardarTextTablaSinBorrar(idHoja,idProcedimiento,valor){
	

	var request = $.ajax({
		type:'POST',		
		url: '/enfermeria/util/guardarTextTablaSinBorrar',
		async:false,
		data:{
			idHoja:idHoja, 
			idProcedimiento:idProcedimiento
		},
		dataType:"json"	        
	}).fail(function(){		
		mostrarMensaje("Ocurrio un error al guardar el texto","error")		
	})
			
}


function hojaSoloLectura(){
	
	if($("#idHoja").val() != ''){
		if($("#soloLectura").val() == 'true'){		
			$(".ui-spinner-input").spinner( "destroy");			
			$("input:text").attr('disabled',true)
			$("textarea").attr('disabled',true)
			$("input:radio").attr('disabled',true)
			$("input:checkbox").attr('disabled',true)
			$(".escalaDolorImagen").attr('onclick','');			
			$(".operacion").hide()
		}
		else{
			
			if($("#jefeSupervisor").val() == 'true'){				
				$(".ui-spinner-input").spinner("enable")
				$("input:text").attr('disabled',false)
				$("textarea").attr('disabled',false)
				$("input:radio").attr('disabled',false)
				$("input:checkbox").attr('disabled',false)				
			}			
		}
	}
}


function cargarServicios(){
	
	$("#pisos").change(function(){
		
		var idArea = $( "#pisos option:selected" ).val()
		
		$.getJSON("/enfermeria/autoComplete/consultarServicios",{idArea:idArea})
		.done(function( json ) {
				
				$('#servicios option').remove();
				 $("<option/>").attr("value","-1").text("[T O D O S]").appendTo($("#servicios"));
				
		        for (var i = 0; i < json.length; i++) {
		            $("<option/>").attr("value", json[i].id).text(json[i].descripcion).appendTo($("#servicios"));
		        }
				
			})
			.fail(function() {
				mostrarMensaje("Ocurrio un error al cargar los servicios","error")
			})
	});
}


function tablaFloatHead(selector){
	
	var $table = $(selector);
	$table.floatThead({
		zIndex: 50,
		scrollContainer: function($table){
				return $table.closest('.wrapper');
		}
	});
	
	$table.trigger('reflow');
	
	
}


function mostrarMensaje(mensaje, status){
	
	var image = ""
	
	if(status != undefined){
		
		switch(status){
		
		case 'ok':
			image = "<img  src='/enfermeria/images/icons/paloma.gif' />"
			break
		case 'error':
			image = "<img  src='/enfermeria/images/icons/error_message.jpg' />"
			break
		
		}
	}
	
	var html = "<p>" + image + mensaje + "</p>"
	
	$( "#dialog-mensaje" ).dialog({
		  title:'Mensaje',
		  autoOpen: false,
	      modal: true,
	      buttons: {
	        Ok: function() {
	          $( this ).dialog( "close" );
	        }
	      },
	      resizable: false
	})
	
	
	
	$("#dialog-mensaje" ).html(html)	       					
	$("#dialog-mensaje" ).dialog("open");	
}


function mostrarConfirmacion(mensaje, functionSi){
	
	$( "#dialog-confirm" ).dialog({
		  title:'Confirmacion',
	      resizable: false,
	      height:200,
	      modal: true,
	      buttons: {
	        "Si": function(){
	        	functionSi(); 
	        	$( this ).dialog( "close" )
	        },
	        "No": function() {
	          $( this ).dialog( "close" );
	        }
	      }
	});
	
	$("#dialog-confirm" ).html(mensaje)	       					
	$("#dialog-confirm" ).dialog("open");	
	
}

function imprimirHoja(idHoja){	
	blockUIForDownload() 
	location.href='/enfermeria/hojaRegistroClinico/reporteHoja?idHoja='+idHoja + "&download_token_value_id=" + 
	 $('#download_token_value_id').val()
}

function firmarConEnter(){	
	 $("#passwordFirma").keypress(function(e){	
		  	if(e.which == 13) {
		  		$("#btnFirmarHoja").trigger('click')
		  	}
	 })	
}

function correctSpinner(spinner, minDefault, maxDefault){
	
	var minHora = 1, maxHora = 24
	
	if(minDefault != undefined){
		minHora = minDefault		
	}
	
	if(maxDefault != undefined){
		maxHora = maxDefault		
	}
	
	
	$(spinner).on('input', function () {		
	     	var val = this.value,
	         $this = $(this),
	         max = maxHora,
	         min = minHora;
	     	
	     	 if(val == "")
	     		 return
	     	
	         if (!val.match(/^\d+$/)) val = 0; //we want only number, no alpha
	     this.value = val > max ? max : val < min ? min : val;
	});
	
	$(spinner).on('spin', function( event, ui ) {		
		if ( ui.value > maxHora ) {
			$( this ).spinner( "value", minHora );
			return false;
		} else if ( ui.value < minHora ) {
			$( this ).spinner( "value", maxHora );
			return false;
		}
	})	
	
}

function nuevaVentana(url){							
	var popup = window.open(url);				
	popup.moveTo(0, 0);
	popup.resizeTo(screen.availWidth, screen.availHeight);		
}  


var fileDownloadCheckTimer;

function blockUIForDownload() {
    var token = new Date().getTime(); //use the current timestamp as the token value
    $('#download_token_value_id').val(token);
    $.blockUI({ message: '<h1>Generando Reporte Por Favor Espere...</h1>' });
    fileDownloadCheckTimer = window.setInterval(function () {
      var cookieValue = $.cookie('fileDownloadToken');
      if (cookieValue == token)
       finishDownload();
    }, 1000);
 }

function finishDownload() {
	 window.clearInterval(fileDownloadCheckTimer);
	 $.removeCookie('fileDownloadToken'); //clears this cookie value
	 $.unblockUI();
}

function getInternetExplorerVersion()
//Returns the version of Internet Explorer or a -1
//(indicating the use of another browser).
{
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
	 var ua = navigator.userAgent;
	 var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	 if (re.exec(ua) != null)
	   rv = parseFloat( RegExp.$1 );
	}
	else if (navigator.appName == 'Netscape')
	{
	    var ua = navigator.userAgent;
	    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
	    if (re.exec(ua) != null)
	      rv = parseFloat( RegExp.$1 );
	}
	
	return rv;
}

function checkInternetExplorer()
{	
	var ver = getInternetExplorerVersion();
	//alert(ver)
	if ( ver > -1 )
	{ 
		$.blockUI({ message: '<h1>Esta usando Internet Explorer, use Google Chrome, Safari o Firefox para un correcto funcionamiento. Si no cuenta con ninguno solicitelo Mesa de Servicio ext 10243</h1>' });
		
	}
}
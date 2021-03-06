$(document).ready(function() {
	
	autoCompleteArticulo(function(){
		$("#cantidad").focus()
	});
	
	consultarDetalle()
	detalleAdd()
	validar()
	controlesDetalle()	
	medicamentosHistoricos()
	
	if($("#idSeguimiento").val() != ''){			
		$("#btnHistoricoMedicamento").hide()
	}	
	
});


function detalleAdd(){
	
	$("#insumo").focus(function(){	
		limpiarRenglonDetalle()
	});
	
	$("#insumo").keypress(function(e){	
		 if(e.which == 13 && $("#insumo").valid() ) {
			$.getJSON("/enfermeria/medicamento/buscarArticulo",{id:this.value})
					.done(function( json ) {
						 $("#artauto").val(json.desArticulo)						 
						 $("#unidad").val(json.unidad)
						 $("#precioUnitario").val(json.precioCierre)				 
						 $("#precioUnitario").currency({ region: 'MXN', thousands: ',', decimal: '.', decimals: 4 })
						 $("#cantidad").focus()
						 
					})
					.fail(function() {
						mostrarMensaje("La clave " + $("#insumo").val() + " no existe","error")
						limpiarRenglonDetalle()
					})
		 }
	});
	
	
	$("#cantidad").keypress(function(e){	
		 if(e.which == 13) {
			 
			 if($("#formSeguimientoHosp").valid()){			 
				 var data = [{ cveArt:$("#insumo").val(),
					 		   cantidad:$("#cantidad").val()
					 		}];
				 
				 guardar(JSON.stringify(data)) 
				 
				 //alert(jQuery("#detalle tr").length)

				 
				 //El primer registro guardado
				 if(jQuery("#detalle tr").length == 1){
					 redirectConsultar($('#idSeguimiento').val(),"Seguimiento Guardado")					 
				 }
				 
				 
				 $("#clavelast").html($("#insumo").val());
				 $("#deslast").html($("#artauto").val());
				 $("#unidadlast").html($("#unidad").val());
				 $("#precioUnitariolast").html($("#precioUnitario").val());				
				 $("#cantidadlast").html($("#cantidad").val());			 
				 
				 limpiarRenglonDetalle()
				 $("#insumo").focus()
			 }
		 }
	});	
}

function validar(){
	$("#formSeguimientoHosp").validate({
		
		ignore: [],
		
        rules: {
        	fechaElaboracion: {required:true,validateDate:true,dateToday:true,checkFechaElaboracion:true},
        	idPaciente:{required:true},
        	insumo: {required:true, number:true,checkInsumo:true},
        	cantidad: {required:true,number:true}
        },
		messages: {
			fechaElaboracion:{required:"Requerido"},
			idPaciente:{required:'Seleccione paciente'},
			insumo :{required:"Requerido", number:"Numerico"},
			cantidad:{required:"Requerido",number:"Numerico"}
		}
  });
}

function autoCompleteArticulo(funcSelect){	
	autoComplete("#artauto", "/enfermeria/medicamento/listarArticulo","#insumo",
			function(){
		  		$.getJSON("/enfermeria/medicamento/buscarArticulo",{id:$("#insumo").val()})
		  		.done(function( json ) {
		  	     $("#desArticulo").val(json.desArticulo)
				 $("#unidad").val(json.unidad)				 
				 $("#precioUnitario").val(json.precioCierre)
				 $("#precioUnitario").currency({ region: 'MXN', thousands: ',', decimal: '.', decimals: 4 })
				 funcSelect()
		  	})	
	},4)	
}


function consultarDetalle(){
	
	$("#detalle").jqGrid({
	    url: '/enfermeria/medicamento/consultarDetalle',
	    datatype: 'json',
	    mtype: 'GET',
	    colNames:['Clave','Descripcion', 'U. Medida','Precio Unit','Cantidad', 'Importe'],
	    colModel :[ 
	      {name:'cveArt', index:'cveArt', width:50, align:'center',editable:false}, 
	      {name:'desArticulo', index:'desArticulo', width:500,editable:false},	      
	      {name:'unidad', index:'unidad', width:120,editable:false,align:'center'},
	      {name:'precioUnitario', index:'precioUnitario', width:120,editable:false,align:'right',formatter: 'currency', formatoptions: { decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 4, prefix: "$", suffix:"", defaultValue: '0.00'}},
	      {name:'cantidad', index:'cantidad', width:90,editable:true,align:'center'},
	      {name:'importe', index:'importe', width:120,editable:false,align:'right',formatter: 'currency', formatoptions: { decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 4, prefix: "$", suffix:"", defaultValue: '0.00'}}
	    ],
	    postData:{idSeguimiento: function() { return $('#idSeguimiento').val() }},
	    onSelectRow: function(id){	
		},
		loadComplete: function(data) {
			$("#importeTotalMedicamento").val(data.importeTotal)
			$("#importeTotalMedicamento").currency({ region: 'MXN', thousands: ',', decimal: '.', decimals: 2 })
			
			importeGlobal()	
			
	    },
		afterInsertRow:function (rowid,rowdata,	rowelem){
		},
	    pager: '#pager',
	    editurl: "/enfermeria/medicamento/actualizarDetalle",
	    rowNum:-1,
	    //rowList:[20, 40, 60 ,80],
	    //sortname: 'id',
	    //sortorder: 'asc',
	    sortable: false,
	    viewrecords: true,
	    gridview: true,
	    caption: 'Medicamentos'//,
	    //multiselect: true
	})	
	
	$("#detalle").jqGrid('setGridWidth', 900);
	$("#detalle").jqGrid('setGridHeight', 250);
	
	$("#detalle").jqGrid("navGrid", "#pager",
	{
		add: false,
		edit: false,
		del: false,
		search: true,
		refresh: false
	},	
	{//edit
	},
	{},//add
	{//del
		savekey: [true, 13],
		width:500,
		closeOnEscape: true,
		reloadAfterSubmit:true,
		closeAfterSubmit:true,
		afterSubmit: function (data) {
			alert('prueb')
			return [true,'',''];
		}
	},	
	{},
	{});
	
    //$('#detalle').jqGrid('inlineNav',"#pager");
	
}


function limpiarRenglonDetalle(){
	
	$(".busqueda :input").each(function(){
		$(this).val('');
	});
	
}

function medicamentosHistoricos(){
	
	$("#btnHistoricoMedicamento").click(function(){
		
		 if($("#idPaciente").valid() && $("#fechaElaboracion").valid()){
			mostrarConfirmacion("Esta seguro de cargar los historicos?", function(){
				
				$("#detalle").clearGridData();
				
				$.getJSON("/enfermeria/medicamento/medicamentosHistorico",
					{idPaciente:$("#idPaciente").val(), fechaElaboracion:$("#fechaElaboracion").val()})
					.done(function( jsonArray ) {
				        for (var i = 0; i < jsonArray.length; i++) {        	
				        	$("#detalle").addRowData(jsonArray[i].cveArt, jsonArray[i]);
				        }
				        
				        guardarTodo()			
				})			
			})
		 }
		
	})
	
}



////FUNCIONES PERSISTENCIA////////////////////

function guardar(dataDetalle){
	
    var frm = $("#formSeguimientoHosp");
    var dataPadre = JSON.stringify(frm.serializeObject());   		
    
	var request = $.ajax({
		type:'POST',		
		url:  '/enfermeria/medicamento/guardar',
		async:false,
		data:{
			dataPadre: dataPadre, 
			dataDetalle: dataDetalle,			
			idPadre:$('#idSeguimiento').val()
		},
		dataType:"json"	        
	});
	
	request.done(function(data) {			
		$('#idSeguimiento').val(data.idSeguimiento)
		$('#detalle').trigger("reloadGrid");		
		$('.botonOperacion').show()
	});
}

function controlesDetalle(){
	
	$("#btnActualizar").click(function(){
		
		var gr = jQuery("#detalle").jqGrid('getGridParam','selrow');
		
		$("#detalle").jqGrid('editGridRow',gr, {			   
			   reloadAfterSubmit: true,
			   editCaption:'Editar Cantidad',
			   bSubmit:'Actualizar',
			   closeAfterEdit:true,
			   viewPagerButtons:false,
			   afterSubmit: function(response,postdata){
				   console.log(response)
				   var mensaje = jQuery.parseJSON(response.responseText).mensaje				   
				   if(mensaje != 'success')
					   return [false, mensaje, ''];
				   else					   
					   return [true, '', ''];
			   }
		});
	});
	
	$("#btnBorrar").click(function(){
		
		var gr = jQuery("#detalle").jqGrid('getGridParam','selrow');
		
		$("#detalle").jqGrid('delGridRow',gr, {
			   width:300,
			   reloadAfterSubmit: true,
			   editCaption:'Borrar Medicamento',
			   bSubmit:'Borrar',
			   closeAfterEdit:true,
			   viewPagerButtons:false,
			   afterSubmit: function (response, postdata) {
				   console.log(response)
				   var mensaje = jQuery.parseJSON(response.responseText).mensaje
				   if(mensaje != 'success')
					   return [false, mensaje, ''];
				   else
					   return [true, '', ''];
				}
		});
	});
}


function guardarTodo(){
	
    var frm = $("#formSeguimientoHosp");
    var dataPadre = JSON.stringify(frm.serializeObject());
    var dataArrayDetalle = JSON.stringify($("#detalle").getRowData())   
    
	var request = $.ajax({
		type:'POST',		
		url:  '/enfermeria/medicamento/guardar',
		async:false,
		data:{
			dataPadre: dataPadre, 
			dataDetalle: dataArrayDetalle,			
			idPadre:$('#idSeguimiento').val()
		},
		dataType:"json"	        
	});
	
	request.done(function(data) {
		$('#idSeguimiento').val(data.idSeguimiento)
		redirectConsultar($('#idSeguimiento').val(),"Seguimiento Guardado")			
	});	
	
}
function checkValue(url, value){
	
	var response
    $.ajax({
	        type: "POST",
	        url: url,
	        async:false,
	        data: "value="+value,
	        dataType:"html",
	     success: function(msg)
	     {        	 
	         response = ( msg == 'true' ) ? true : false;         
	     }
    })
 return response;
	
}

function isValidDate(s) {
	  var bits = s.split('/');
	  var d = new Date(bits[2], bits[1] - 1, bits[0]);
	  return d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]);
} 

$.validator.addMethod("validateDate", function (value, element) {
	try {

		return isValidDate(value)

	}
	catch (e) {		
		return false;
	}
	}, "Fecha Incorrecta"
);


$.validator.addMethod("dateToday", function (value, element) {
	try {
			
		
		var exactDate= new Date();
        var year= exactDate.getFullYear();
        var month= exactDate.getMonth();
        var day= exactDate.getDate();
        var startDateObj= new Date(year,month,day,0,0,0,0);
        
        var endDateArray= value.split("/");
		var endDateObj= new Date(endDateArray[2],(endDateArray[1] - 1 ), endDateArray[0] ,0,0,0,0);
		var startDateMilliseconds= startDateObj.getTime();
		 var endDateMilliseconds= endDateObj.getTime();
		
		if(endDateMilliseconds > startDateMilliseconds )
			return false
		else
			return true

	}
	catch (e) {		
		return false;
	}
	}, "Fecha Mayor a Fecha Actual"
);

$.validator.addMethod("checkInsumo", function(value, element) {
	
	var gridData = jQuery("#detalle").getRowData();
	
	var result = true
    
    jQuery.each(gridData, function(i, item) {
    	
    	if(item.cveArt == value )
    		result = false

    })
    
	return result
	
}, "Clave Existente");

$.validator.addMethod("checkFechaElaboracion", function(value, element) {
	
	var result = true
    $.ajax({
	        type: "POST",
	        url: '/enfermeria/seguimientoHosp/existeFechaElaboracion',
	        async:false,
	        data: {fechaElaboracion:$("#fechaElaboracion").val(), idPaciente:$("#idPaciente").val()},
	        dataType:"json",
	     success: function(json)
	     {
	    	 if($("#idSeguimiento").val() == ''){
	    			result = !json.result     
	    	}
	         
	     }
    })
 return result;
	
}, "Fecha Existente");



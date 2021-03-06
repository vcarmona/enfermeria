<%@ page import="mx.gob.inr.utils.ConstantesHojaEnfermeria" %>

<g:barraNavegacion tagAbajo="abajoSigno"></g:barraNavegacion>

<div>
	<input type="button" class="operacion" id="addSignosVitales" value="AGREGAR SIGNO VITAL"/>
	<label style="color:blue;font-size:16px">Para eliminar todo un renglon deben quedar vacios todos los signos vitales</label>
</div>
<div class="mensaje" id="mensajeSigno" style="color:red;font-size:20px"></div>


<div style="height:300px;overflow:auto;" class="wrapper" >
	<table id="tablaSignosVitales" class="tablaFixedHeader" >
	<thead>
		<tr>
			<th>Hora</th>
			<th> Temp.</th>
			<th>F.C.</th>
			<th>T.A. Sistolica</th>
			<th>T.A. Diastolica</th>
			<th>Frec Resp</th>
			<th>Lab y Gab</th>
		</tr>	
	</thead>
	<tbody >		
		<g:each in="${hojaInstance.signosVitales}" var="signo" status="i">		
				<tr>
					<td><input type="text" class="horaSigno" id="horaSigno${i}" value="${signo.hora}" size="2" maxlength="2" /></td>			
					<td><g:textField class="temperatura" name="temperatura" value="${signo.temperatura?.otro}" size="5" 
					onchange="guardarSignoVital(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_TEMEPRATURA},this.value,document.getElementById('horaSigno${i}').value,false,this)"  
					maxlength="5" disabled="${signo.temperatura?.usuario && signo.temperatura?.usuario != usuarioActual}"/></td>			
					<td><g:textField class="cardiaca" name="cardiaca" value="${signo.cardiaca?.otro}" size="5" 
					onchange="guardarSignoVital(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_FRECUENCIA_CARDIACA},this.value,document.getElementById('horaSigno${i}').value,false,this)"  
					maxlength="5" disabled="${signo.cardiaca?.usuario && signo.cardiaca?.usuario != usuarioActual}"/></td>			
					<td><g:textField class="sistolica" name="sistolica" value="${signo.sistolica?.otro}" size="5"  
					onchange="guardarSignoVital(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_TENSION_ARTERIAL_SISTOLICA},this.value,document.getElementById('horaSigno${i}').value,false,this)"  
					maxlength="5" disabled="${signo.sistolica?.usuario && signo.sistolica?.usuario != usuarioActual}"/></td>			
					<td><g:textField class="diastolica" name="diastolica" value="${signo.diastolica?.otro}" size="5" 
					onchange="guardarSignoVital(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_TENSION_ARTERIAL_DIASTOLICA},this.value,document.getElementById('horaSigno${i}').value,false,this)"  
					maxlength="5" disabled="${signo.diastolica?.usuario && signo.diastolica?.usuario != usuarioActual}"/></td>			
					<td><g:textField class="respiracion" name="respiracion" value="${signo.respiracion?.otro}" size="5" 
					onchange="guardarSignoVital(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_FRECUENCIA_RESPIRATORIA},this.value,document.getElementById('horaSigno${i}').value,false,this)"  
					maxlength="5" disabled="${signo.respiracion?.usuario && signo.respiracion?.usuario != usuarioActual}"/></td>			
					<td><g:textField class="gabinete" name="gabinete" value="${signo.gabinete?.otro}" size="8" 
					onchange="guardarSignoVital(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_LABORATORIO_GABINETE},this.value,document.getElementById('horaSigno${i}').value,false,this)"  
					maxlength="10" disabled="${signo.gabinete?.usuario && signo.gabinete?.usuario != usuarioActual}"/></td>		
				</tr>
			</g:each>
	</tbody>
	</table>
</div>


<input type="button" id="showEscalaDolor" value="MOSTRAR ESCALA DEL DOLOR" onclick="mostrarEscalaDolor()"/>
<label for="horaDolor">Hora:</label> <g:textField name="horaDolor" class="hora" size="2" value="1" maxlength="2"/><br>

<div>
	<table>	
		<tr>	
			<g:each in="${(0..10)}" var="i">				
				<td>
					<a class="escalaDolorImagen" onclick="guardarEscalaDolor(${i})" title="Valor ${i}"> 
						<img  src="${createLinkTo(dir: 'images/escaladolor', file:"Dolor${i % 2 == 0 ? i : 'Otro' }.png")}" alt="Dolor${i}" />
					</a>				
				</td>
			</g:each>
		</tr>
	</table>		

</div>


<div class="mensaje" id="mensajeDieta" style="color:red;font-size:20px"></div>
<div>
	<table id="tablaDietas">
		<caption>DIETAS</caption>
		<thead>
			<tr>
				<th>GENERALIZADA</th>
				<th>MATUTINA</th>
				<th>VESPERTINA</th>			
				<th>NOCTURNA</th>
			</tr>		
		</thead>	
		<tbody>
			<tr>				
				<td><g:textArea name="dieta" rows="5" cols="15" value="${hojaInstance.dietas?.getAt(0)?.otro}" 
				onchange="guardarDieta(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_DIETA_DIETA},this.value,-1,true)"/></td>			
				<td>
				<label>Hora:</label>
				<input type="text" id="horaDietaM" class="hora" size="2" maxlength="2"  value="${hojaInstance.dietas?.getAt(1)?.horaregistrodiagva?:'8'}"
				onblur="guardarDieta(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_DIETA_MATUTINO},document.getElementById('dietaMatutino').value,this.value,true)"/>
				
				<g:textArea name="dieta" id="dietaMatutino" rows="5" cols="16" value="${hojaInstance.dietas?.getAt(1)?.otro}" 
				onchange="guardarDieta(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_DIETA_MATUTINO},this.value,document.getElementById('horaDietaM').value,true)"/></td>			
				<td>
				<label>Hora:</label>
				<input type="text" id="horaDietaV"  class="hora" size="2" maxlength="2"  value="${hojaInstance.dietas?.getAt(2)?.horaregistrodiagva?:'15'}" 
				onblur="guardarDieta(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_DIETA_VESPERTINO},document.getElementById('dietaVespertino').value,this.value,true)"/>
				
				<g:textArea name="dieta" id="dietaVespertino" rows="5" cols="16" value="${hojaInstance.dietas?.getAt(2)?.otro}" 
					onchange="guardarDieta(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_DIETA_VESPERTINO},this.value,document.getElementById('horaDietaV').value,true)"/></td>			
				<td>
				
				<label>Hora:</label>
				<input type="text" id="horaDietaN"  class="hora" size="2" maxlength="2"  value="${hojaInstance.dietas?.getAt(3)?.horaregistrodiagva?:'1'}" 
				onblur="guardarDieta(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_DIETA_NOCTURNO},document.getElementById('dietaNocturno').value,this.value,true)"/>
				
				<g:textArea name="dieta" id="dietaNocturno" rows="5" cols="16" value="${hojaInstance.dietas?.getAt(3)?.otro}" 
				onchange="guardarDieta(${hojaInstance?.id},${ConstantesHojaEnfermeria.P_DIETA_NOCTURNO},this.value,document.getElementById('horaDietaN').value,true)"/></td>		
			</tr>
		</tbody>
	</table>
</div>


<a name="abajoSigno"></a>
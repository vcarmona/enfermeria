package mx.gob.inr.seguimientoHosp

import java.util.Date;
import mx.gob.inr.reportes.Util
import mx.gob.inr.utils.Paciente

class SeguimientoHospService {
	
	
	def medicamentoService
	def estudioService
	def cirugiaService
	def terapiaService
	
	
	def consultarSeguimiento(Long idSeguimiento){

		def seguimientoHosp = SeguimientoHosp.createCriteria().get{
			admision{
			}
			paciente{
			}
			eq("id",idSeguimiento)
			maxResults(1)
		}
		
		return seguimientoHosp

	}

    def consultarSeguimientos(Long idPaciente){
		
		def html = """		
			
			<div style="height:500px;overflow:auto;" class="wrapper" >
			<table id="tablaSeguimientos">
			<thead>			
					<tr>						
						<th>
							Fecha Elaboracion
						</th>						
						<th>
							Cargar
						</th>						
					</tr>			
			</thead><tbody>

		"""
		
		SeguimientoHosp.createCriteria().list{
			eq("paciente.id",idPaciente)
			order("fechaElaboracion","desc")
		}.each{ seguimiento->			
		
			html += """
				<tr>				
					<td>${seguimiento.fechaElaboracion.format('dd/MM/yyyy')}</td>
					<td><input type="button" value="ACEPTAR" onclick="consultarSeguimiento(${seguimiento.id},'${seguimiento.fechaElaboracion.format('dd/MM/yyyy')}')"/></td>					
				</tr>
			"""
		}
		
		html += "</tbody></table></div>"
		
		html
		
	}
	
	boolean seguimientoSoloLectura(Date fechaElaboracion){
		
		boolean soloLectura = true
		
		Date fechaActual = Util.getFechaDate(Util.getFechaActual("yyyy-MM-dd"));
		
		
		if(fechaElaboracion.compareTo(fechaActual) == 0){
			soloLectura = false
		}
		
		
		soloLectura
		
	}
	
	boolean existeFechaElaboracion(Long idPaciente, Date fechaElaboracion){
		
		def result = false
		
		if(SeguimientoHosp.findWhere(fechaElaboracion:fechaElaboracion,paciente:Paciente.read(idPaciente))){
			result = true
		}
		
		result		
	}
	
	
	def fechaMinimaEstancia(Long idPaciente){
		
		def fechaMinima = SeguimientoHosp.createCriteria().get{
			projections{
				min("fechaElaboracion")
			}			
			eq("paciente.id",idPaciente)		
		}
				
		fechaMinima			
		
	}
	
	
	def importes(SeguimientoHosp seguimientoHosp){		
		
		
		def importeMedicamentos = medicamentoService.consultarDetalleMedicamento(seguimientoHosp.id).importeTotal
		def importeEstudios = estudioService.consultarTipoAgendas(seguimientoHosp.fechaElaboracion,seguimientoHosp.paciente).importeTotal
		def importeCirugias = cirugiaService.importeTotalCirugia(seguimientoHosp.id)
		def importeTerapias = terapiaService.consultarAgendasTerapia(seguimientoHosp.fechaElaboracion, seguimientoHosp.paciente).importeTotal
		
		def importeGlobal =  importeMedicamentos + importeEstudios + importeCirugias + importeTerapias
		
		[importeMedicamentos:importeMedicamentos,importeEstudios:importeEstudios,importeCirugias:importeCirugias,
			importeTerapias:importeTerapias,importeGlobal:importeGlobal]
		
		
	}
	
}

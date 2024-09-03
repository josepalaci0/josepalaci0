export default {
	async fetch(request, env, ctx) {

		// Definir una clase "DataInObtained" con métodos GET y SET
		class DataInObtained {

			// Constructor para inicializar los datos
			constructor(category_Etl_iD, data_Etl_iD, obtained_Etl_iD) {
				this._category_Etl_iD = category_Etl_iD;
				this._data_Etl_iD = data_Etl_iD;
				this._obtained_Etl_iD = obtained_Etl_iD;
			}

			// Métodos GET para acceder a los datos
			get category_Etl_iD() {
				return this._category_Etl_iD;
			}

			get data_Etl_iD() {
				return this._data_Etl_iD;
			}

			get obtained_Etl_iD() {
				return this._obtained_Etl_iD;
			}

			// Métodos SET para modificar los datos
			set category_Etl_iD(newCategoryID) {
				this._category_Etl_iD = newCategoryID;
			}

			set data_Etl_iD(newDataID) {
				this._data_Etl_iD = newDataID;
			}

			set obtained_Etl_iD(newObtainedID) {
				this._obtained_Etl_iD = newObtainedID;
			}

			// Método para obtener todos los datos como un objeto
			getAllData() {
				return [
					{
						category_Etl_iD: this._category_Etl_iD,
						data_Etl_iD: this._data_Etl_iD,
						obtained_Etl_iD: this._obtained_Etl_iD
					}
				]
			}

			// Método para modificar múltiples datos al mismo tiempo
			updateData(newCategoryID, newDataID, newObtainedID) {
				this.category_Etl_iD = newCategoryID;
				this.data_Etl_iD = newDataID;
				this.obtained_Etl_iD = newObtainedID;
			}
		}

		// Crear instancias de objetos "DataInObtained"
		const _Linkedin = new DataInObtained(
			"5f4e4fg96e4fg4e9e", 
			"5f4e4fg96e4fg4e9e", 
			"5f4e4fg96e4fg4e9e"
		);

		const _Computranajo = new DataInObtained(
			"5f4e4fg96e4fg4e9e", 
			"5f4e4fg96e4fg4e9e", 
			"5f4e4fg96e4fg4e9e"
		);

		// Modificar datos de _Linkedin usando los métodos SET
		_Linkedin.category_Etl_iD = "newCategoryID_Linkedin";
		_Linkedin.data_Etl_iD = "newDataID_Linkedin";
		_Linkedin.obtained_Etl_iD = "newObtainedID_Linkedin";

		// Modificar datos de _Computranajo usando el método updateData
		_Computranajo.updateData(
			"newCategoryID_Computranajo",
			"newDataID_Computranajo",
			"newObtainedID_Computranajo"
		);

		// Combinar los datos de ambas instancias
		const combinedData = {
			LinkedinData: _Linkedin.getAllData(),           // Obtener todos los datos
			ComputranajoData: _Computranajo.getAllData()    // Obtener todos los datos
		};

		// Retornar la respuesta con los datos combinados en formato JSON
		return new Response(JSON.stringify(combinedData), {
			headers: { "Content-Type": "application/json" }
		});

	},
};



/**

/////////////////////////////////////////////////////////////////////////
// Crear una clase derivada "Estudiante" que hereda de "Persona"
class Estudiante extends Persona {
	constructor(nombre, edad, carrera) {
		super(nombre, edad); // Llama al constructor de la clase base
		this.carrera = carrera;
	}

	mostrarCarrera() {
		console.log(`Estoy estudiando ${this.carrera}.`);
	}
}

// Crear una instancia de objeto "Maria" que es una estudiante
const maria = new Estudiante("Maria", 22, "Ingeniería en Informática");

// Acceder a métodos y propiedades de la instancia
maria.saludar(); // Output: "Hola, soy Maria y tengo 22 años."
maria.mostrarCarrera(); // Output: "Estoy estudiando Ingeniería en Informática."
 */
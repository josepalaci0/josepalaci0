/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
	async fetch(request, env, ctx) {

		// Definir una clase "Persona"
		class DataInObtained {
			constructor(category = [], data = [], obtained = []) {
				this.category = category;
				this.data = data;
				this.obtained = obtained;
			}

			getData() {
				// Puedes ajustar la lógica aquí según lo que necesites
				return {
					category: this.category,
					data: this.data,
					obtained: this.obtained
				};
			}
		}
		// Crear una instancia de objeto "DataInObtained"
		const _Linkedin = new DataInObtained([{
			category_Etl_iD: "5f4e4fg96e4fg4e9e",
			data_Etl_iD: "5f4e4fg96e4fg4e9e",
			obtained_Etl_iD: "5f4e4fg96e4fg4e9e"
		}]);
		const _Computranajo = new DataInObtained([{
			category_Etl_iD: "5f4e4fg96e4fg4e9e",
			data_Etl_iD: "5f4e4fg96e4fg4e9e",
			obtained_Etl_iD: "5f4e4fg96e4fg4e9e"
		}]);

		// Acceder a métodos y propiedades de la instancia
		 // Output: "get Data" 
		return new Response(_Linkedin.getData());

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
let cliente = {
	mesa: '',
	hora: '',
	pedido: [],
};

const categorias = {
	1: 'Comida',
	2: 'Bebida',
	3: 'Postres',
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
	const mesa = document.querySelector('#mesa').value;
	const hora = document.querySelector('#hora').value;

	const camposVacios = [mesa, hora].some((campo) => campo === '');

	if (camposVacios) {
		const existe = document.querySelector('.invalid-feedback');

		if (!existe) {
			const alerta = document.querySelector('div');
			alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
			alerta.textContent = 'Todos los campos son obligatorios';

			document.querySelector('.modal-body').appendChild(alerta);

			setTimeout(() => {
				alerta.remove();
			}, 2300);
		}

		return;
	}

	//* Asignar datos del formulario a cliente
	cliente = {...cliente, hora, mesa};

	//* Ocultar modal
	const modalFormulario = document.querySelector('#formulario');
	const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
	modalBootstrap.hide();

	mostrarSecciones();

	//* Obtener platos de la api de JSON-server
	obtenerPlatos();
} //Fin guardarCliente

function mostrarSecciones() {
	const seccionesOcultas = document.querySelectorAll('.d-none');
	seccionesOcultas.forEach((seccion) => seccion.classList.remove('d-none'));
} //Fin mostrarSecciones

function obtenerPlatos() {
	const url = 'http://localhost:4000/platillos';

	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((platos) => mostrarPlatos(platos))
		.catch((error) => console.error(error));
} //Fin obtenerPlatos

function mostrarPlatos(platos) {
	const contenido = document.querySelector('#platillos .contenido');

	platos.forEach((plato) => {
		// const {nombre, id, categoria, precio} = plato;

		const row = document.createElement('div');
		row.classList.add('row', 'py-3', 'border-top');

		const nombre = document.createElement('div');
		nombre.classList.add('col-md-4');
		nombre.textContent = plato.nombre;

		const precio = document.createElement('div');
		precio.classList.add('col-md-3', 'fw-bold');
		precio.textContent = `$${plato.precio}`;

		const categoria = document.createElement('div');
		categoria.classList.add('col-md-3');
		categoria.textContent = categorias[plato.categoria];

		const inputCantidad = document.createElement('input');
		inputCantidad.type = 'number';
		inputCantidad.min = 0;
		inputCantidad.value = 0;
		inputCantidad.id = `producto-${plato.id}`;
		inputCantidad.classList.add('form-control');

		//* Funcion que detecta la cantidad y el plato que se esta agregando
		inputCantidad.onchange = function () {
			const cantidad = parseInt(inputCantidad.value);
			agregarPlato({...plato, cantidad});
		};

		const agregar = document.createElement('div');
		agregar.classList.add('col-md-2');

		agregar.appendChild(inputCantidad);

		row.appendChild(nombre);
		row.appendChild(precio);
		row.appendChild(categoria);
		row.appendChild(agregar);

		contenido.appendChild(row);
	}); //Fin forEach
} //Fin mostrarPlatos

function agregarPlato(producto) {
	//* Extraer el pedido actual
	let {pedido} = cliente;

	//* Revisar que cantidad sea mayor a 0
	if (producto.cantidad > 0) {
		//* Compruebo si el elemento ya existe en el array
		if (pedido.some((articulo) => articulo.id === producto.id)) {
			//*El producto ya existe, actualizar cantidad
			const pedidoActualizado = pedido.map((articulo) => {
				if (articulo.id === producto.id) {
					articulo.cantidad = producto.cantidad;
				}
				return articulo;
			});

			//Se asigna el nuevo array a cliente.pedido
			cliente.pedido = [...pedidoActualizado];
		} else {
			//El articulo no existe, lo agregamos al array de pedido
			cliente.pedido = [...pedido, producto];
		}
	} else {
		console.log('No es mayor a 0');
	}

	console.log(cliente.pedido);
} //Fin agregarPlato

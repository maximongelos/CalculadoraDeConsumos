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
		//* Eliminar elemento cuando la cantidad es 0
		const resultado = pedido.filter((articulo) => articulo.id !== producto.id);

		cliente.pedido = [...resultado];
	}

	limpiarHTML();

	if (cliente.pedido.length) {
		//* Mostrar el resumen
		actualizarResumen();
	} else {
		msjPedidoVacio();
	}
} //Fin agregarPlato

function actualizarResumen() {
	const contenido = document.querySelector('#resumen .contenido');

	const resumen = document.createElement('div');
	resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

	//* Info mesa
	const mesa = document.createElement('p');
	mesa.classList.add('fw-bold', 'mesa');
	mesa.textContent = 'Mesa: ';

	const mesaSpan = document.createElement('span');
	mesaSpan.classList.add('fw-normal');
	mesaSpan.textContent = cliente.mesa;

	//* Info hora
	const hora = document.createElement('p');
	hora.classList.add('fw-bold', 'hora');
	hora.textContent = 'Hora: ';

	const horaSpan = document.createElement('span');
	horaSpan.classList.add('fw-normal');
	horaSpan.textContent = cliente.hora;

	hora.appendChild(horaSpan);
	mesa.appendChild(mesaSpan);

	//* Titulo de la seccion
	const heading = document.createElement('h3');
	heading.classList.add('my-4', 'text-center');
	heading.textContent = 'Platos consumidos';

	//* Iterar sobre array de pedidos
	const grupo = document.createElement('ul');
	grupo.classList.add('list-group');

	const {pedido} = cliente;

	pedido.forEach((articulo) => {
		const {nombre, precio, cantidad, id} = articulo;

		const lista = document.createElement('li');
		lista.classList.add('list-group-item');

		const nombreArticulo = document.createElement('h4');
		nombreArticulo.classList.add('my-4');
		nombreArticulo.textContent = nombre;

		const cantidadArticulo = document.createElement('p');
		cantidadArticulo.classList.add('fw-bold');
		cantidadArticulo.textContent = 'Cantidad: ';

		const cantidadSpan = document.createElement('span');
		cantidadSpan.classList.add('fw-normal');
		cantidadSpan.textContent = cantidad;

		const precioArticulo = document.createElement('p');
		precioArticulo.classList.add('fw-bold');
		precioArticulo.textContent = 'Precio total:';

		const precioSpan = document.createElement('span');
		precioSpan.classList.add('fw-normal');
		precioSpan.textContent = ` $ ${precio}`;

		const subtotalArticulo = document.createElement('p');
		subtotalArticulo.classList.add('fw-bold');
		subtotalArticulo.textContent = 'Subtotal:';

		const subtotalSpan = document.createElement('span');
		subtotalSpan.classList.add('fw-normal');
		subtotalSpan.textContent = calcularSubtotal(precio, cantidad);

		//* Boton para eliminar
		const btnEliminar = document.createElement('button');
		btnEliminar.classList.add('btn', 'btn-danger');
		btnEliminar.textContent = 'Eliminar del pedido';

		//* Function para eliminar un producto
		btnEliminar.onclick = function () {
			eliminarProducto(id);
		};

		//* Agregando elemento a su contenedor
		cantidadArticulo.appendChild(cantidadSpan);
		precioArticulo.appendChild(precioSpan);
		subtotalArticulo.appendChild(subtotalSpan);

		//* Agregar elementos al li
		lista.appendChild(nombreArticulo);
		lista.appendChild(cantidadArticulo);
		lista.appendChild(precioArticulo);
		lista.appendChild(subtotalArticulo);
		lista.appendChild(btnEliminar);

		// *Agregar lista al grupo principal
		grupo.appendChild(lista);
	});

	resumen.appendChild(heading);
	resumen.appendChild(mesa);
	resumen.appendChild(hora);
	resumen.appendChild(grupo);

	contenido.appendChild(resumen);

	//* Mostrar el formulario de propinas
	formularioPropinas();
} //Fin actualizarResumen

function limpiarHTML() {
	const contenido = document.querySelector('#resumen .contenido');

	while (contenido.firstChild) {
		contenido.removeChild(contenido.firstChild);
	}
} //Fin limpiarHTML

function calcularSubtotal(precio, cantidad) {
	return ` $ ${precio * cantidad} `;
} //Fin calcularSubtotal

function eliminarProducto(id) {
	const {pedido} = cliente;

	const resultado = pedido.filter((articulo) => articulo.id !== id);

	cliente.pedido = [...resultado];

	limpiarHTML();

	if (cliente.pedido.length) {
		//* Mostrar el resumen
		actualizarResumen();
	} else {
		msjPedidoVacio();
	}

	//* El producto se elimino por lo tanto regresamos a 0 el input
	const productoEliminado = `#producto-${id}`;

	const inputEliminado = document.querySelector(productoEliminado);
	inputEliminado.value = 0;
}

function msjPedidoVacio() {
	const contenido = document.querySelector('#resumen .contenido');

	const texto = document.createElement('p');
	texto.classList.add('text-center');
	texto.textContent = 'Añade los elementos al pedido';

	contenido.appendChild(texto);
} //Fin msjPedidoVacio

function formularioPropinas() {
	const contenido = document.querySelector('#resumen .contenido');

	const formulario = document.createElement('div');
	formulario.classList.add('col-md-6', 'formulario');

	const divForm = document.createElement('div');
	divForm.classList.add('card', 'py-2', 'px-3', 'shadow');

	const heading = document.createElement('h3');
	heading.classList.add('my-4', 'text-center');
	heading.textContent = 'Propina';

	//* Radio button 10%
	const radio10 = document.createElement('input');
	radio10.type = 'radio';
	radio10.name = 'propina';
	radio10.value = 10;
	radio10.classList.add('form-check-input');
	radio10.onclick = calcularPropina;

	const radio10Label = document.createElement('label');
	radio10Label.textContent = '10%';
	radio10Label.classList.add('form-check-label');

	const radio10Div = document.createElement('div');
	radio10Div.classList.add('form-check');

	//* Radio button 25%
	const radio25 = document.createElement('input');
	radio25.type = 'radio';
	radio25.name = 'propina';
	radio25.value = 25;
	radio25.classList.add('form-check-input');
	radio25.onclick = calcularPropina;

	const radio25Label = document.createElement('label');
	radio25Label.textContent = '25%';
	radio25Label.classList.add('form-check-label');

	const radio25Div = document.createElement('div');
	radio25Div.classList.add('form-check');

	//* Radio button 50%
	const radio50 = document.createElement('input');
	radio50.type = 'radio';
	radio50.name = 'propina';
	radio50.value = 50;
	radio50.classList.add('form-check-input');
	radio50.onclick = calcularPropina;

	const radio50Label = document.createElement('label');
	radio50Label.textContent = '50%';
	radio50Label.classList.add('form-check-label');

	const radio50Div = document.createElement('div');
	radio50Div.classList.add('form-check');

	radio10Div.appendChild(radio10);
	radio10Div.appendChild(radio10Label);
	radio25Div.appendChild(radio25);
	radio25Div.appendChild(radio25Label);
	radio50Div.appendChild(radio50);
	radio50Div.appendChild(radio50Label);

	//* Agregar al div principal
	divForm.appendChild(heading);
	divForm.appendChild(radio10Div);
	divForm.appendChild(radio25Div);
	divForm.appendChild(radio50Div);

	formulario.appendChild(divForm);
	contenido.appendChild(formulario);
} //Fin formularioPropinas

function calcularPropina(e) {
	const porcPropina = e.target.value;

	const {pedido} = cliente;

	let subtotal = 0;

	pedido.forEach((articulo) => {
		subtotal += articulo.precio * articulo.cantidad;
	});

	const propina = (subtotal * porcPropina) / 100;

	const total = subtotal + propina;

	console.log(total);
} //Fin calcularPropina

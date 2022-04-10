let cliente = {
	mesa: '',
	hora: '',
	pedido: [],
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
}

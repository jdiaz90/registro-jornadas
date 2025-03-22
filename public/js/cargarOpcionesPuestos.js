document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Hacer una solicitud al backend para obtener los puestos
    const response = await fetch('/admin/empleados/puestos');
    const puestos = await response.json();

    // Agregar las opciones al datalist
    const datalist = document.getElementById('puestos');
    puestos.forEach((puesto) => {
      const option = document.createElement('option');
      option.value = puesto;
      datalist.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar los puestos:', error);
  }
});
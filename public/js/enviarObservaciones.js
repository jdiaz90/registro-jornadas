document.addEventListener('DOMContentLoaded', () => {
  const observacionesTextarea = document.getElementById('observaciones-textarea');
  const formEntrada = document.getElementById('form-entrada');
  const formSalida = document.getElementById('form-salida');

  formEntrada.addEventListener('submit', () => {
    formEntrada.querySelector('input[name="observaciones"]').value = observacionesTextarea.value;
  });

  formSalida.addEventListener('submit', () => {
    formSalida.querySelector('input[name="observaciones"]').value = observacionesTextarea.value;
  });
});

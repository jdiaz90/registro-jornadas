const Registro = require('../models/registro');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

// Función para obtener el nombre del mes en español
const obtenerNombreMes = (mes) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1];
};

exports.descargarPdf = async (req, res) => {
  const { mes, año } = req.query;
  const empleadoId = req.empleado.id;

  let where = { EmpleadoId: empleadoId };
  if (mes && año) {
    where.createdAt = {
      [Op.between]: [
        new Date(año, mes - 1, 1),
        new Date(año, mes, 0)
      ]
    };
  }

  try {
    const registros = await Registro.findAll({ where, order: [['createdAt', 'ASC']] });

    // Emparejar registros de entrada y salida
    const paresRegistros = [];
    let entrada = null;

    registros.forEach(registro => {
      if (registro.tipo === 'entrada') {
        if (entrada) {
          paresRegistros.push({ entrada, salida: null });
        }
        entrada = registro;
      } else if (registro.tipo === 'salida' && entrada) {
        paresRegistros.push({ entrada, salida: registro });
        entrada = null;
      }
    });

    if (entrada) {
      paresRegistros.push({ entrada, salida: null });
    }

    // Agrupar registros por año y mes
    const registrosPorAño = {};
    paresRegistros.forEach(par => {
      const añoEntrada = par.entrada.fechaHora.getFullYear();
      const mesEntrada = par.entrada.fechaHora.getMonth() + 1;

      if (!registrosPorAño[añoEntrada]) {
        registrosPorAño[añoEntrada] = {};
      }

      if (!registrosPorAño[añoEntrada][mesEntrada]) {
        registrosPorAño[añoEntrada][mesEntrada] = [];
      }

      registrosPorAño[añoEntrada][mesEntrada].push(par);
    });

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=registros.pdf');
    doc.pipe(res);

    // Agregar contenido al PDF
    doc.fontSize(18).text('Registros de Entrada y Salida', { align: 'center' });
    doc.moveDown();

    for (const [año, meses] of Object.entries(registrosPorAño)) {
      doc.fontSize(16).text(`Año: ${año}`, { align: 'left' });
      doc.moveDown();

      for (const [mes, registros] of Object.entries(meses)) {
        const nombreMes = obtenerNombreMes(mes);
        doc.fontSize(14).text(`Mes: ${nombreMes}`, { align: 'left' });
        doc.moveDown();

        registros.forEach(par => {
          doc.fontSize(12).text(`Fecha de Entrada: ${par.entrada.fechaHora.toLocaleString('es-ES')}`);
          doc.fontSize(12).text(`Fecha de Salida: ${par.salida ? par.salida.fechaHora.toLocaleString('es-ES') : ''}`);
          doc.moveDown();
        });

        doc.moveDown();
      }

      doc.addPage();
    }

    doc.end();
  } catch (error) {
    console.error('Error al generar el archivo PDF:', error);
    res.status(500).send('Error al generar el archivo PDF');
  }
};
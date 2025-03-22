const Registro = require('../models/registro');
const Empleado = require('../models/empleado');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

// Función genérica para generar el PDF
const generarPdfRegistros = async (empleadoId, mes, año, res) => {
  try {
    // Obtener el empleado
    const empleado = await Empleado.findByPk(empleadoId);
    if (!empleado) {
      return res.status(404).send('Empleado no encontrado');
    }

    // Filtrar registros por mes y año si se proporcionan
    let where = { EmpleadoId: empleadoId };
    if (mes && año) {
      where.fechaHora = {
        [Op.between]: [
          new Date(año, mes - 1, 1),
          new Date(año, mes, 0),
        ],
      };
    }

    const registros = await Registro.findAll({ where, order: [['fechaHora', 'ASC']] });

    // Emparejar registros de entrada y salida
    const paresRegistros = [];
    let entrada = null;

    registros.forEach((registro) => {
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

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=registros-${empleado.nombre}-${empleado.apellidos}.pdf`
    );
    doc.pipe(res);

    // Agregar título en la primera página
    doc.fontSize(18).font('Helvetica-Bold').text(`Registros de ${empleado.nombre} ${empleado.apellidos}`, { align: 'center' });
    doc.moveDown();

    // Agrupar registros por año y mes
    const registrosPorAño = {};
    paresRegistros.forEach((par) => {
      const fechaEntrada = par.entrada ? new Date(par.entrada.fechaHora) : null;
      const fechaSalida = par.salida ? new Date(par.salida.fechaHora) : null;
      const año = fechaEntrada ? fechaEntrada.getFullYear() : fechaSalida.getFullYear();
      const mes = fechaEntrada
        ? fechaEntrada.toLocaleString('es-ES', { month: 'long' })
        : fechaSalida.toLocaleString('es-ES', { month: 'long' });

      if (!registrosPorAño[año]) {
        registrosPorAño[año] = {};
      }
      if (!registrosPorAño[año][mes]) {
        registrosPorAño[año][mes] = [];
      }
      registrosPorAño[año][mes].push(par);
    });

    // Mostrar registros agrupados por año y mes
    Object.entries(registrosPorAño).forEach(([año, meses]) => {
      doc.addPage(); // Nueva página para cada año
    
      // Título del año en negrita
      doc.fontSize(16).font('Helvetica-Bold').text(`Año: ${año}`, { align: 'left' });
      doc.moveDown();
    
      Object.entries(meses).forEach(([mes, registros]) => {
        // Título del mes en negrita
        doc.fontSize(14).font('Helvetica-Bold').text(`Mes: ${mes}`, { align: 'left' });
        doc.moveDown();
    
        registros.forEach((par) => {
          const entrada = par.entrada
            ? par.entrada.fechaHora.toLocaleString('es-ES')
            : 'Sin entrada';
          const salida = par.salida
            ? par.salida.fechaHora.toLocaleString('es-ES')
            : 'Sin salida';
    
          // Mostrar entrada y salida en la misma línea con palabras en negrita
          doc.fontSize(12)
            .font('Helvetica-Bold')
            .text(`Entrada: `, { continued: true })
            .font('Helvetica')
            .text(`${entrada}`, { continued: true })
            .font('Helvetica-Bold')
            .text(`  |  Salida: `, { continued: true })
            .font('Helvetica')
            .text(`${salida}`);
        });
    
        doc.moveDown();
      });
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar el archivo PDF:', error);
    res.status(500).send('Error al generar el archivo PDF');
  }
};

exports.descargarPdf = async (req, res) => {
  const { mes, año } = req.query;
  const empleadoId = req.empleado.id; // El empleado solo puede descargar sus propios registros
  await generarPdfRegistros(empleadoId, mes, año, res);
};

exports.descargarPdfAdmin = async (req, res) => {
  const { mes, año } = req.query;
  const empleadoId = req.params.id; // El administrador puede especificar el empleado
  await generarPdfRegistros(empleadoId, mes, año, res);
};
const Registro = require('../models/registro');
const Empleado = require('../models/empleado');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const archiver = require('archiver');

// Función para obtener el nombre del mes en español
const obtenerNombreMes = (mes) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1];
};

// Función genérica para generar el archivo ZIP con documentos de Excel
const generarXlsxRegistros = async (empleadoId, mes, año, res, esAdmin = false, req = null) => {
  try {
    // Obtener el empleado si es necesario (solo para administradores)
    let empleado = null;
    if (esAdmin) {
      empleado = await Empleado.findByPk(empleadoId);
      if (!empleado) {
        return res.status(404).send('Empleado no encontrado');
      }
    }

    // Obtener el nombre y apellidos del empleado
    const nombreEmpleado = empleado
      ? `${empleado.nombre}-${empleado.apellidos}`
      : `${req.empleado.nombre}-${req.empleado.apellidos}`;

    // Filtrar registros por mes y año si se proporcionan
    let where = { EmpleadoId: empleadoId };
    if (mes && año) {
      where.createdAt = {
        [Op.between]: [
          new Date(año, mes - 1, 1),
          new Date(año, mes, 0),
        ],
      };
    }

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

    // Crear un archivo ZIP
    const zip = archiver('zip', { zlib: { level: 9 } });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=registros-${nombreEmpleado}.zip`
    );
    zip.pipe(res);

    // Crear un nuevo libro de Excel por cada año
    for (const [año, meses] of Object.entries(registrosPorAño)) {
      const workbook = new ExcelJS.Workbook();

      for (const [mes, registros] of Object.entries(meses)) {
        const nombreMes = obtenerNombreMes(mes);
        const worksheet = workbook.addWorksheet(`${año}-${nombreMes}`);

        // Agregar encabezados
        worksheet.columns = [
          { header: 'Fecha de Entrada', key: 'entrada_fecha', width: 30 },
          { header: 'Fecha de Salida', key: 'salida_fecha', width: 30 }
        ];

        // Agregar filas
        registros.forEach(par => {
          worksheet.addRow({
            entrada_fecha: par.entrada.fechaHora.toLocaleString('es-ES'),
            salida_fecha: par.salida ? par.salida.fechaHora.toLocaleString('es-ES') : ''
          });
        });
      }

      // Guardar el libro de Excel en un buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Agregar el buffer al archivo ZIP con el nombre del empleado
      zip.append(buffer, { 
        name: `registros-${nombreEmpleado}-${año}.xlsx` 
      });
    }

    // Finalizar el archivo ZIP
    zip.finalize();
  } catch (error) {
    console.error('Error al generar el archivo ZIP:', error);
    res.status(500).send('Error al generar el archivo ZIP');
  }
};

// Controlador para empleados
exports.descargarXlsx = async (req, res) => {
  const { mes, año } = req.query;
  const empleadoId = req.empleado.id; // El empleado solo puede descargar sus propios registros
  await generarXlsxRegistros(empleadoId, mes, año, res, false, req);
};

// Controlador para administradores
exports.descargarXlsxAdmin = async (req, res) => {
  const { mes, año } = req.query;
  const empleadoId = req.params.id; // El administrador puede especificar el empleado
  await generarXlsxRegistros(empleadoId, mes, año, res, true);
};
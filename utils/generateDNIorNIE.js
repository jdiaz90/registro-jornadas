const generateDNIorNIE = () => {
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const tipo = Math.random() > 0.5 ? 'DNI' : 'NIE';
  
    if (tipo === 'DNI') {
      const numero = Math.floor(Math.random() * 100000000);
      const letra = letras[numero % 23];
      return `${numero}${letra}`;
    } else {
      const prefijo = ['X', 'Y', 'Z'][Math.floor(Math.random() * 3)];
      const numero = Math.floor(Math.random() * 10000000);
      const numeroCompleto = parseInt(`${['0', '1', '2'][['X', 'Y', 'Z'].indexOf(prefijo)]}${numero}`);
      const letra = letras[numeroCompleto % 23];
      return `${prefijo}${numero.toString().padStart(7, '0')}${letra}`;
    }
  };
  
  module.exports = generateDNIorNIE;
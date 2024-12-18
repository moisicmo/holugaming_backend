



export const numberToString = (digit: number): string => {
  const number: number = digit;
  let numberString: string = '0000000000' + number.toString();
  numberString = numberString.substring(number.toString().length, numberString.length);
  let str: string = '';

  switch ('en-in') {
    case 'en-in':
      const ones: string[] = [
        '',
        'uno',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
        'diez ',
        'once ',
        'doce ',
        'trece ',
        'catorce ',
        'quince ',
        'dieciseis ',
        'diecisiete ',
        'dieciocho ',
        'diecinueve '
      ];
      const onesMiles: string[] = [
        '',
        'un ',
        'dos ',
        'tres ',
        'cuatro ',
        'cinco ',
        'seis ',
        'siete ',
        'ocho ',
        'nueve ',
        'diez ',
        'once ',
        'doce ',
        'trece ',
        'catorce ',
        'quince ',
        'dieciseis ',
        'diecisiete ',
        'dieciocho ',
        'diecinueve '
      ];
      const onesMilesPlus: string[] = [
        '',
        '',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
        'diez',
        'once ',
        'doce',
        'trece',
        'catorce',
        'quince',
        'dieciseis',
        'diecisiete',
        'dieciocho',
        'diecinueve'
      ];
      const cienes: string[] = [
        '',
        'uno',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'sete',
        'ocho',
        'nove',
        'diez',
        'once',
        'doce',
        'trece',
        'catorce',
        'quince',
        'dieciseis',
        'diecisiete',
        'dieciocho',
        'diecinueve'
      ];
      const tens: string[] = [
        '',
        '',
        'veinte',
        'treinta',
        'cuarenta',
        'cincuenta',
        'sesenta',
        'setenta',
        'ochenta',
        'noventa',
      ];
      const millones: string[] = [
        '',
        'un millon',
        'dos millones',
        'tres millones',
        'cuatro millones',
        'cinco millones',
        'siete millones',
        'siete millones',
        'ocho millones',
        'nueve millones',
      ];
      const complementos: string[] = [
        '',
        '',
        'veinti',
        'treinta y ',
        'cuarenta y ',
        'cincuenta y ',
        'sesenta y ',
        'setenta y ',
        'ochenta y ',
        'noventa y ',
      ];

      str += numberString[0] !== '0' ? ones[parseInt(numberString[0])] + 'hundred ' : '';

      if (parseInt(numberString[1] + numberString[2]) < 20 && parseInt(numberString[1] + numberString[2]) > 9) {
        str += ones[parseInt(numberString[1] + numberString[2])] + 'crore ';
      } else {
        str += numberString[1] !== '0' ? tens[parseInt(numberString[1])] + ' ' : '';
        str += numberString[2] !== '0' ? ones[parseInt(numberString[2])] + 'crore ' : '';
        str += numberString[1] !== '0' && numberString[2] === '0' ? 'crore ' : '';
      }

      if (parseInt(numberString[3] + numberString[4]) < 20 && parseInt(numberString[3] + numberString[4]) > 9) {
        str += millones[parseInt(numberString[3])] + ' ';
        str += numberString[4] !== '0'
          ? numberString[4] === '1' && numberString[5] === '0' && numberString[6] === '0'
            ? 'cien mil'
            : numberString[4] === '1' && numberString[5] === '0' && numberString[6] === '1'
              ? 'ciento un'
              : numberString[4] === '1'
                ? 'ciento '
                : numberString[4] !== '0' && numberString[5] === '0' && numberString[6] === '0'
                  ? ones[parseInt(numberString[4])] + 'cientos mil '
                  : ones[parseInt(numberString[4])] + 'cientos '
          : '';
        str += numberString[3] !== '0' && numberString[4] === '0' ? '' : '';
      } else {
        str += numberString[3] !== '0' ? `${millones[parseInt(numberString[3])]} ` : '';
        str += numberString[4] !== '0'
          ? numberString[4] === '1' && numberString[5] === '0' && numberString[6] === '0'
            ? 'cien mil'
            : numberString[4] === '1' && numberString[5] === '0' && numberString[6] === '1'
              ? 'ciento'
              : numberString[4] === '1'
                ? 'ciento '
                : numberString[4] !== '0' && numberString[5] === '0' && numberString[6] === '0'
                  ? ones[parseInt(numberString[4])] + 'cientos mil '
                  : `${ones[parseInt(numberString[4])]}cientos `
          : '';
        str += numberString[3] !== '0' && numberString[4] === '0' ? '' : '';
      }

      if (parseInt(numberString[5] + numberString[6]) < 20 && parseInt(numberString[5] + numberString[6]) > 9) {
        str += ones[parseInt(numberString[5] + numberString[6])] + 'mil ';
      } else {
        str +=
          numberString[5] !== '0'
            ? complementos[parseInt(numberString[5])] + onesMiles[parseInt(numberString[6])]
            : '';
        str +=
          numberString[6] !== '0'
            ? numberString[6] === '0'
              ? 'mil '
              : numberString[5] === '0'
                ? numberString[3] === '0' && numberString[4] === '0' && numberString[5] === '0'
                  ? numberString[6] !== '1'
                    ? onesMilesPlus[parseInt(numberString[6])] + ' mil '
                    : onesMilesPlus[parseInt(numberString[6])] + 'mil '
                  : ' ' + onesMiles[parseInt(numberString[6])] + 'mil '
                : ''
            : '';
        str += numberString[5] !== '0' && numberString[6] === '0' ? 'mil ' : numberString[5] === '0' ? '' : 'mil ';
      }

      str +=
        numberString[7] !== '0'
          ? numberString[7] === '1' && numberString[8] === '0' && numberString[9] === '0'
            ? 'cien'
            : numberString[7] === '1'
              ? 'ciento '
              : numberString[7] === '5'
                ? 'quinientos '
                : cienes[parseInt(numberString[7])] + 'cientos '
          : '';

      if (parseInt(numberString[8] + numberString[9]) < 20 && parseInt(numberString[8] + numberString[9]) > 9) {
        str += ones[parseInt(numberString[8] + numberString[9])];
      } else {
        str += numberString[8] !== '0'
          ? numberString[9] === '0'
            ? tens[parseInt(numberString[8])]
            : complementos[parseInt(numberString[8])]
          : '';
        str += numberString[9] !== '0' ? ones[parseInt(numberString[9])] : '';
      }
      break;

    default:
      str += 'Formato no aceptado';
  }
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
}

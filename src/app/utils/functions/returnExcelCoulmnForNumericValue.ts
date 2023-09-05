//This function is use to set mandortory fields , if we give numeric value it retuns column name ex - (1- 'A' , 27 - 'AA' , 28 - 'AB')
export function returnExcelCoulmnForNumericValue(index: number): string {
  let result = '';
  while (index > 0) {
    const remainder = (index - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    index = Math.floor((index - 1) / 26);
  }
  return result;
}

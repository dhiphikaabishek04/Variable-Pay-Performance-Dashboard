const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('Variable.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log("Headers:");
    console.log(data[0]);
    console.log("First row:");
    console.log(data[1]);
} catch (e) {
    console.error(e);
}

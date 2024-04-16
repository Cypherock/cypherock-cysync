const createCSVRow = (row: (string | number)[]) => {
  let finalVal = '';

  for (let j = 0; j < row.length; j += 1) {
    const innerValue =
      row[j] === null || row[j] === undefined ? '' : row[j].toString();

    let result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0) result = `"${result}"`;
    if (j > 0) finalVal += ',';

    finalVal += result;
  }

  return `${finalVal}\n`;
};

const createCSV = (headers: string[], rows: (string | number)[][]) => {
  let csvFile = createCSVRow(headers);

  for (let i = 0; i < rows.length; i += 1) {
    csvFile += createCSVRow(rows[i]);
  }

  return csvFile;
};

export interface CreateCSVFromObjectParams {
  headers: { name: string; key: string }[];
  rows: Record<string, string | number>[];
}

export const createCSVFromObject = ({
  headers,
  rows,
}: CreateCSVFromObjectParams) => {
  const mappedRows = rows.map(row => headers.map(header => row[header.key]));

  return createCSV(
    headers.map(header => header.name),
    mappedRows,
  );
};

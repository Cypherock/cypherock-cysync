export const downloadFileToDesktop = (filename: string, fileBlob: Blob) => {
  const link = document.createElement('a');

  if (link.download === undefined) {
    return false;
  }

  const url = URL.createObjectURL(fileBlob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};

export const downloadCSVToDesktop = (
  filename: string,
  csvFileContents: string,
) => {
  const blob = new Blob([csvFileContents], { type: 'text/csv;charset=utf-8;' });
  downloadFileToDesktop(filename, blob);
};

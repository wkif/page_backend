import * as xlsx from 'xlsx';
import { JSDOM } from 'jsdom';
import readFileToBuffer from './readFileToBuffer';

function removeEmptyElements(htmlString) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const emptyTrElements = Array.from(document.querySelectorAll('tr')).filter(
    (tr: any) => tr.children.length === 0,
  );
  emptyTrElements.forEach((element: any) =>
    element.parentNode.removeChild(element),
  );
  const emptyTdElements = Array.from(
    document.querySelectorAll('tr:not(:empty) td'),
  ).filter((td: any) => td.textContent.trim() === '');
  emptyTdElements.forEach((element: any) => element.remove());
  const emptyTrElements_2 = Array.from(document.querySelectorAll('tr')).filter(
    (tr: any) => tr.children.length === 0,
  );
  emptyTrElements_2.forEach((element: any) =>
    element.parentNode.removeChild(element),
  );
  const D1 = document.getElementById('sjs-D1');
  const J1 = document.getElementById('sjs-J1');
  D1.style.backgroundColor = '#CCFFFF';
  J1.style.backgroundColor = '#FFCC99';
  const tdList = document.querySelectorAll('td');
  tdList.forEach((td) => {
    td.style.textAlign = 'center';
  });

  return document.documentElement.innerHTML;
}

const createEmailText = async (url: string) => {
  const buffer = await readFileToBuffer(url);
  const workbook = xlsx.read(buffer, {
    type: 'buffer',
  });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const htmlTable = xlsx.utils.sheet_to_html(worksheet);
  return removeEmptyElements(htmlTable);
};
export default createEmailText;

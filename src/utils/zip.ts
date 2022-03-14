/**
 * 传入一批文件，得到一个zip包
 */
import JSZip, { JSZipFileOptions } from 'jszip';
import { saveAs } from 'file-saver';

type InputByType = string | number[] | Uint8Array | ArrayBuffer | Blob;

export interface File {
  path: string;
  filedata: InputByType;
  options?: JSZipFileOptions;
}

export default function zip(inputFiles: File[], outFileName: string) {
  const zip = new JSZip();

  inputFiles.forEach(file => zip.file(file.path, file.filedata, file.options));
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    const filename = /\.zip$/.test(outFileName)
      ? outFileName
      : `${outFileName}.zip`;
    saveAs(content, filename);
  });
}

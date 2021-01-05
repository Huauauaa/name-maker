declare module 'react-input-files';

interface MyFileReader extends FileReader {
  name?: string;
}

interface ExcelProps {
  setData: (any) => void;
}

interface NameType {
  name: string;
  pinyins?: [string];
  key?: number;
}

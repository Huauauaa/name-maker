declare module 'react-input-files';

interface MyFileReader extends FileReader {
  name?: string;
}

interface ExcelProps {
  setData: (any) => void;
}

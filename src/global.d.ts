declare module 'react-input-files';
declare module 'uuid/v4';

interface MyFileReader extends FileReader {
  name?: string;
}

interface ExcelProps {
  setData: (any) => void;
}

interface NameType {
  name: string;
  pinyins?: [string];
  key?: string;
  id?: string;
  [string]: string;
}

interface NameInfoProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch;
  nameInfo: NameType;
  type: string;
}

type Candidate = {
  id: string;
  name: string;
};

import React from 'react';
import { Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import InputFiles from 'react-input-files';

function Excel() {
  const onImportExcel = (files: FileList) => {
    const fileReader: MyFileReader = new FileReader();
    for (let index = 0; index < files.length; index++) {
      fileReader.name = files[index].name;
    }
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = (event: any) => {
      try {
        const validExts = ['.xlsx', '.xls'];
        const fileExt = event?.target?.name;

        if (fileExt === null) {
          throw Error('Empty');
        }

        const fileType = fileExt.substring(fileExt.lastIndexOf('.'));
        if (!validExts.includes(fileType)) {
          throw Error(`Type Error: ${validExts}`);
        }

        const { result } = event.target;
        const workbook = XLSX.read(result, { type: 'binary' });
        let data: any[] = [];
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
            );
          }
        }
        console.table(data);
      } catch (e) {
        message.warn(e);
        return;
      }
    };
  };
  return (
    <div>
      <InputFiles accept=".xlsx, .xls" onChange={onImportExcel}>
        <Button>
          <UploadOutlined />
        </Button>
      </InputFiles>
    </div>
  );
}

export default Excel;
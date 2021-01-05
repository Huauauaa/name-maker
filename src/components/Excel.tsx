import React, { useContext } from 'react';
import { Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import InputFiles from 'react-input-files';
import DataContext from '../contexts/data-context';
import _ from 'lodash';
import uuid from 'uuid/v4';
const pinyin = require('pinyin');

function Excel() {
  const { setData } = useContext(DataContext);

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
        const pinyinData = data.map((item: NameType) => ({
          ...item,
          pinyins: pinyin(item.name, { style: pinyin.STYLE_NORMAL }),
          key: uuid(),
        }));
        const cachedData = JSON.parse(localStorage.getItem('data') || '[]');
        setData(_.unionBy(pinyinData, cachedData, 'name'));
      } catch (e) {
        message.warn(e);
        return;
      }
    };
  };
  return (
    <InputFiles accept=".xlsx, .xls" onChange={onImportExcel}>
      <Button type="primary" icon={<UploadOutlined />}>
        上传
      </Button>
    </InputFiles>
  );
}

export default Excel;

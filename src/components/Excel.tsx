import React, { useContext } from 'react';
import { Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import InputFiles from 'react-input-files';
import DataContext from '../contexts/data-context';
import _ from 'lodash';
import http from '../http';

const pinyin = require('pinyin');

function Excel() {
  const { data, setData } = useContext(DataContext);

  const onImportExcel = (files: FileList) => {
    const fileReader: MyFileReader = new FileReader();
    for (let index = 0; index < files.length; index++) {
      fileReader.name = files[index].name;
    }
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = async (event: any) => {
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
        let excelData: any[] = [];
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            excelData = excelData.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
            );
          }
        }
        console.table(excelData);
        const pinyinData = excelData.map((item: NameType) => ({
          ...item,
          pinyin: _.flatten(pinyin(item.name, { style: pinyin.STYLE_NORMAL })),
        }));

        await http.post(`/names`, _.differenceBy(pinyinData, data, 'name'));
        const response: any = await http.get(`/name`);
        setData(response);
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

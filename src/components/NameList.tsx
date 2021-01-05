import React, { useContext } from 'react';
import DataContext from '../contexts/data-context';
import { Table, Tag } from 'antd';

function NameList() {
  const context = useContext(DataContext);
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '拼音',
      dataIndex: 'pinyins',
      key: 'pinyins',
      render: (pinyins: [string]) => {
        return pinyins.map((item: string, index: number) => (
          <Tag key={index}>{item}</Tag>
        ));
      },
    },
  ];
  return (
    <Table dataSource={context} columns={columns} title={() => '姓名列表'} />
  );
}

export default NameList;

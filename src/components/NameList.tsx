import React, { useContext } from 'react';
import DataContext from '../contexts/data-context';
import { Table, Tag } from 'antd';

function NameList() {
  const context = useContext(DataContext);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      render: (pinyins: any) => {
        return pinyins.map((item: any) => <Tag>{item}</Tag>);
      },
    },
  ];
  return <Table dataSource={context} columns={columns} rowKey="id" />;
}

export default NameList;

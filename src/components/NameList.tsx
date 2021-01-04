import React, { useContext } from 'react';
import DataContext from '../contexts/data-context';
import { Table } from 'antd';

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
  ];
  return <Table dataSource={context} columns={columns} rowKey="id" />;
}

export default NameList;

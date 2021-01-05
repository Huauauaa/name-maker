import React, { useContext } from 'react';
import DataContext from '../contexts/data-context';
import { Table, Tag, Space, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '../assets/name-list.less';

function NameList({ onDelete, onEdit }: any) {
  const { data } = useContext(DataContext);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
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
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <EditOutlined
            className="action-item"
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="确认删除?"
            onConfirm={() => onDelete(record.key)}
            onCancel={() => {}}
            okText="是"
            cancelText="否"
          >
            <DeleteOutlined className="action-item" style={{ color: 'red' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        dataSource={data.map((item: NameType, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns}
        pagination={{
          showTotal: (total) => `共 ${total} 项`,
        }}
      />
    </>
  );
}

export default NameList;

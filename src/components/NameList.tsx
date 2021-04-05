import React, { useContext } from 'react';
import DataContext from '../contexts/data-context';
import { Table, Tag, Space, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '../assets/name-list.less';
import { TablePaginationConfig } from 'antd/lib/table';
import { AxiosResponse } from 'axios';
import http from '../http';

function NameList({ onDelete, onEdit, keyword }: any) {
  const { data, setData } = useContext(DataContext);

  const columns = [
    {
      title: '序号',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '拼音',
      dataIndex: 'pinyin',
      key: 'pinyin',
      render: (pinyin: [string]) => {
        return pinyin.map((item: string, index: number) => (
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
            onConfirm={() => onDelete(record._id)}
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

  const onChange = async (pagination: TablePaginationConfig) => {
    const response: AxiosResponse = await http.get(`/name`, {
      params: {
        page: pagination.current,
        size: pagination.pageSize,
        keyword,
      },
    });
    setData(response);
  };
  return (
    <Table
      dataSource={data.items}
      columns={columns}
      rowKey="_id"
      pagination={{
        showTotal: (total) => `共 ${total} 项`,
        total: data.total,
        size: data.size,
      }}
      onChange={onChange}
    />
  );
}

export default NameList;

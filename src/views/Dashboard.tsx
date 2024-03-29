import React, { useState, useContext } from 'react';
import DataContext from '../contexts/data-context';
import NameList from '../components/NameList';
import { Button, Input } from 'antd';
import NameInfo from '../components/NameInfo';
import Excel from '../components/Excel';
import '../assets/dashboard.less';
import { PlusOutlined } from '@ant-design/icons';
import http from '../http';
import { AxiosResponse } from 'axios';

function Dashboard() {
  const { setData } = useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nameInfo, setNameInfo] = useState({ name: '' });
  const [operationType, setOperationType] = useState('');
  const [keyword, setKeyword] = useState('');

  const onDelete = async (id: string) => {
    await http.delete(`/name`, {
      params: {
        _id: id,
      },
    });
    const response: AxiosResponse = await http.get(`/name`);
    setData(response);
  };

  const onEdit = (nameInfo: NameType): void => {
    setIsModalVisible(true);
    setNameInfo(nameInfo);
    setOperationType('edit');
  };

  const onAdd = () => {
    setIsModalVisible(true);
    setNameInfo({ name: '' });
    setOperationType('add');
  };

  const onSearch = async (keyword: string) => {
    setKeyword(keyword);
    const response: AxiosResponse = await http.get(`/name`, {
      params: {
        page: 1,
        keyword,
      },
    });
    setData(response);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="operations">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onAdd()}>
          添加
        </Button>
        <Excel></Excel>
        <Input.Search
          onSearch={onSearch}
          placeholder="请输入拼音"
        ></Input.Search>
      </div>
      <div className="data-list">
        <NameList
          onDelete={onDelete}
          onEdit={onEdit}
          keyword={keyword}
        ></NameList>
      </div>
      <NameInfo
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        nameInfo={nameInfo}
        type={operationType}
      />
    </div>
  );
}

export default Dashboard;

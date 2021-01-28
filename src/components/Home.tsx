import React, { useState, useEffect, useContext } from 'react';
import { Input, Table, List, Tag } from 'antd';
import DataContext from '../contexts/data-context';
import _ from 'lodash';
import '../assets/home.less';
import http from '../http';

const { Search } = Input;
const pinyin = require('pinyin');

function Home() {
  const [input, setInput] = useState('');
  const [target, setTarget] = useState([]);
  const { data } = useContext(DataContext);
  const [wordInfo, setWordInfo] = useState([]);

  const onSearch = async (value: string) => {
    setInput(value);
    try {
      const response = await http
      .get(`/word`, {
        params: {
          wd: value,
          t: Date.now(),
        },
      });
      setWordInfo(response as any);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (input) {
      const inputPinyins = pinyin(input, { style: pinyin.STYLE_NORMAL });
      setTarget(
        data.filter(
          (item: any) =>
            _.intersection(_.flatten(inputPinyins), _.flatten(item.pinyins))
              .length > 0,
        ),
      );
    } else {
      setTarget([]);
    }
  }, [input, data]);

  const columns = [
    {
      title: 'label',
      dataIndex: 'label',
      key: 'label',
      width: '100px',
    },
    {
      title: 'content',
      dataIndex: 'content',
      key: 'content',
      render: (data: string[]) =>
        data.length === 1 ? (
          <Tag color="blue">{data}</Tag>
        ) : (
          <List
            size="small"
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        ),
    },
  ];

  return (
    <div className="home-wrapper">
      <Search
        placeholder="请输入姓名"
        allowClear
        enterButton="检测"
        size="large"
        onSearch={onSearch}
      />

      <div className="search-result">
        {target.map((item: any) => item.name).join(', ')}
      </div>
      <Table
        dataSource={wordInfo.map((item: any, index) => ({
          ...item,
          key: index,
        }))}
        showHeader={false}
        columns={columns}
        pagination={false}
      ></Table>
    </div>
  );
}

export default Home;

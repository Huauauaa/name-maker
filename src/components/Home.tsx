import React, {
  useState,
  useEffect,
  useContext,
  SyntheticEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { Input, Table, List, Tag } from 'antd';
import DataContext from '../contexts/data-context';
import _ from 'lodash';
import '../assets/home.less';
import http from '../http';
import { PlusOutlined } from '@ant-design/icons';
import uuid from 'uuid/v4';

const { Search } = Input;
const pinyin = require('pinyin');

function Home() {
  const cachedCandidates = JSON.parse(
    localStorage.getItem('candidates') || '[]',
  );
  const [input, setInput] = useState('');
  const [target, setTarget] = useState([]);
  const { data } = useContext(DataContext);
  const [wordInfo, setWordInfo] = useState([]);
  const [candidates, setCandidates]: [
    any,
    Dispatch<SetStateAction<any>>,
  ] = useState(cachedCandidates);
  const [candidateInput, setCandidateInput] = useState('');

  const onSearch = async (value: string) => {
    setInput(value);
    try {
      const response = await http.get(`/word`, {
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

  useEffect(() => {
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }, [candidates]);

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

  const onAddCandidate = (e: SyntheticEvent) => {
    const newCandidates = candidateInput.split('').map((item: string) => {
      return {
        id: uuid(),
        name: item,
      };
    });
    setCandidates(_.unionBy(candidates, newCandidates, 'name'));
    setCandidateInput('');
  };

  const onRemoveCandidate = (id: string) => {
    setCandidates(candidates.filter((item: Candidate) => item.id !== id));
  };

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
      <Input
        addonAfter={<PlusOutlined onClick={onAddCandidate} />}
        value={candidateInput}
        allowClear
        onPressEnter={onAddCandidate}
        onChange={(e) => {
          setCandidateInput(e.target.value.replace(' ', ''));
        }}
      />
      <div className="candidates">
        {candidates.map((item: Candidate) => {
          return (
            <Tag
              key={item.id}
              closable
              onClose={() => onRemoveCandidate(item.id)}
              className="candidate-item"
            >
              {item.name}
            </Tag>
          );
        })}
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

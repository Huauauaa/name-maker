import React, {
  useState,
  useEffect,
  SyntheticEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { Input, Table, List, Tag } from 'antd';
import _ from 'lodash';
import '../assets/home.less';
import http from '../http';
import { PlusOutlined } from '@ant-design/icons';
import uuid from 'uuid/v4';

const { Search } = Input;
const pinyin = require('pinyin');

function Home() {
  const cachedCandidates1 = JSON.parse(
    localStorage.getItem('candidates1') || '[]',
  );
  const cachedCandidates2 = JSON.parse(
    localStorage.getItem('candidates2') || '[]',
  );
  const [, setInput] = useState('');
  const [target, setTarget] = useState([]);
  const [wordInfo, setWordInfo] = useState([]);
  const [candidates1, setCandidates1]: [
    any,
    Dispatch<SetStateAction<any>>,
  ] = useState(cachedCandidates1);
  const [candidates2, setCandidates2]: [
    any,
    Dispatch<SetStateAction<any>>,
  ] = useState(cachedCandidates2);
  const [candidateInput1, setCandidateInput1] = useState('');
  const [candidateInput2, setCandidateInput2] = useState('');

  const onSearch = async (value: string) => {
    setInput(value);
    if (_.isEmpty(value)) {
      return;
    }
    try {
      const inputPinyins = pinyin(value, { style: pinyin.STYLE_NORMAL });
      const resp: any = await http.get(`/name`, {
        params: {
          keyword: _.flatten(inputPinyins).join(','),
        },
      });
      setTarget(resp.items);

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
    localStorage.setItem('candidates1', JSON.stringify(candidates1));
  }, [candidates1]);

  useEffect(() => {
    localStorage.setItem('candidates2', JSON.stringify(candidates2));
  }, [candidates2]);

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

  const onAddCandidate = (position: string) => (e: SyntheticEvent) => {
    if (position === '1') {
      const newCandidates = candidateInput1.split('').map((item: string) => {
        return {
          id: uuid(),
          name: item,
        };
      });
      setCandidates1(_.unionBy(candidates1, newCandidates, 'name'));
      setCandidateInput1('');
    } else {
      const newCandidates = candidateInput2.split('').map((item: string) => {
        return {
          id: uuid(),
          name: item,
        };
      });
      setCandidates2(_.unionBy(candidates2, newCandidates, 'name'));
      setCandidateInput2('');
    }
  };

  const onRemoveCandidate = (id: string, position: string) => {
    if (position === '1') {
      setCandidates1(candidates1.filter((item: Candidate) => item.id !== id));
    } else {
      setCandidates2(candidates2.filter((item: Candidate) => item.id !== id));
    }
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
        {target.map((item: NameType) => item.name).join(', ')}
      </div>
      <Input
        addonAfter={<PlusOutlined onClick={onAddCandidate('1')} />}
        value={candidateInput1}
        allowClear
        onPressEnter={onAddCandidate('1')}
        onChange={(e) => {
          setCandidateInput1(e.target.value.replace(' ', ''));
        }}
        placeholder="请输入第一个字"
      />
      <div className="candidates">
        {candidates1.map((item: Candidate) => {
          return (
            <Tag
              key={item.id}
              closable
              onClose={() => onRemoveCandidate(item.id, '1')}
              className="candidate-item"
            >
              {item.name}
            </Tag>
          );
        })}
      </div>

      <Input
        addonAfter={<PlusOutlined onClick={onAddCandidate('2')} />}
        value={candidateInput2}
        allowClear
        onPressEnter={onAddCandidate('2')}
        onChange={(e) => {
          setCandidateInput2(e.target.value.replace(' ', ''));
        }}
        placeholder="请输入第二个字"
      />
      <div className="candidates">
        {candidates2.map((item: Candidate) => {
          return (
            <Tag
              key={item.id}
              closable
              onClose={() => onRemoveCandidate(item.id, '2')}
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

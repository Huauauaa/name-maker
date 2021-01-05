import React, { useState, useEffect } from 'react';
import './App.less';
import Excel from './components/Excel';
import NameList from './components/NameList';
import DataContext from './contexts/data-context';
import { Input } from 'antd';
import _ from 'lodash';
const pinyin = require('pinyin');

const { Search } = Input;

function App() {
  const cachedData = JSON.parse(localStorage.getItem('data') || '[]');
  const [data, setData] = useState(cachedData);
  const [input, setInput] = useState('');
  const [target, setTarget] = useState([]);

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

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

  const onSearch = (value: string) => {
    setInput(value);
  };

  return (
    <div className="App">
      <DataContext.Provider value={data}>
        <Excel setData={setData}></Excel>
        <NameList></NameList>
        <Search
          addonBefore="姓名"
          placeholder="请输入姓名"
          allowClear
          enterButton="检测"
          size="large"
          onSearch={onSearch}
        />
        {target.map((item: any) => item.name).join(', ')}
      </DataContext.Provider>
    </div>
  );
}

export default App;

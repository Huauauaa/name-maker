import React, { useState, useEffect, useContext } from 'react';
import { Input } from 'antd';
import DataContext from '../contexts/data-context';
import _ from 'lodash';
import '../assets/home.less';

const { Search } = Input;
const pinyin = require('pinyin');

function Home() {
  const [input, setInput] = useState('');
  const [target, setTarget] = useState([]);
  const { data } = useContext(DataContext);

  const onSearch = (value: string) => {
    setInput(value);
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
    </div>
  );
}

export default Home;

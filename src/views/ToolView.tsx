import { yins } from '../const';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import http from '../http';
import _ from 'lodash';

function ToolView() {
  const [existYins, setExistYins] = useState([]);
  const [text, setText] = useState('');
  const [customList, setCustomList] = useState([]);

  useEffect(() => {
    (async () => {
      const response: any = await http.get(`/yins`);
      setExistYins(response.items);
    })();
  }, []);

  const onAddCustom = () => {
    const result = _.uniq([...customList, text]) as [];
    setCustomList(result);
  };

  return (
    <>
      <Input
        value={text}
        onInput={(e: any) => setText(e.target.value)}
        onPressEnter={onAddCustom}
        placeholder="请输入拼音"
      ></Input>
      <div style={{ display: 'flex' }}>
        <fieldset>
          <legend>全部</legend>
          <ol>
            {yins.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </fieldset>

        <fieldset>
          <legend>占用</legend>
          <ol>
            {existYins.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </fieldset>

        <fieldset>
          <legend>排除</legend>
          <ol>
            {customList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </fieldset>

        <fieldset>
          <legend>可用</legend>
          <ol>
            {_.difference(yins, existYins).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </fieldset>
      </div>
    </>
  );
}

export default ToolView;

import React, { useState, useEffect, useRef } from 'react';
import './assets/App.less';
import DataContext from './contexts/data-context';
import { Menu } from 'antd';
import { UnorderedListOutlined, HomeOutlined } from '@ant-design/icons';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import routers from './route';

function App() {
  const menuRef = useRef(null);
  const cachedData = JSON.parse(localStorage.getItem('data') || '[]');
  const [data, setData] = useState(cachedData);

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  return (
    <div className="App">
      <DataContext.Provider value={{ data, setData }}>
        <Router>
          <Switch>
            {routers.map((route) => {
              return (
                <Route
                  path={route.path}
                  exact
                  key={route.name}
                  render={(props) => {
                    return (
                      <>
                        <Menu
                          onClick={(e) => props.history.push(`${e.key}`)}
                          selectedKeys={[props.location.pathname]}
                          mode="horizontal"
                          ref={menuRef}
                        >
                          <Menu.Item key="/" icon={<HomeOutlined />}>
                            首页
                          </Menu.Item>
                          <Menu.Item
                            key="/dashboard"
                            icon={<UnorderedListOutlined />}
                          >
                            数据
                          </Menu.Item>
                        </Menu>
                        <route.component {...props}></route.component>
                      </>
                    );
                  }}
                ></Route>
              );
            })}
          </Switch>
        </Router>
      </DataContext.Provider>
    </div>
  );
}

export default App;

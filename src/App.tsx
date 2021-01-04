import React, { useState, useEffect } from 'react';
import './App.less';
import Excel from './components/Excel';
import NameList from './components/NameList';
import DataContext from './contexts/data-context';

function App() {
  const cachedData = JSON.parse(localStorage.getItem('data') || '[]');
  const [data, setData] = useState(cachedData);

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  return (
    <div className="App">
      <DataContext.Provider value={data}>
        <Excel setData={setData}></Excel>
        <NameList></NameList>
      </DataContext.Provider>
    </div>
  );
}

export default App;

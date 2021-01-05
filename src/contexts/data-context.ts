import React from 'react';

const DataContext = React.createContext({
  data: [],
  setData: (dispatch: any): void => {},
});
export default DataContext;

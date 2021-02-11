import React from 'react';

const DataContext = React.createContext({
  data: {} as any,
  setData: (dispatch: any): void => {},
});
export default DataContext;

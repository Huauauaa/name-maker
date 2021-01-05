import NameList from './components/NameList';
import Home from './components/Home';
import Dashboard from './views/Dashboard';

const routers = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/list',
    name: 'list',
    component: NameList,
  },
];

export default routers;

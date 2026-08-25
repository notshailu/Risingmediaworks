import { Outlet } from 'react-router-dom';
import Header from './Header';
import CustomCursor from './CustomCursor';

const Layout = () => {
  return (
    <div className="app-container">
      <CustomCursor />
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;

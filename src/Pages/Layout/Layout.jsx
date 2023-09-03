import { useEffect } from 'react';
import style from './layout.module.scss';
import { useNavigate, Outlet } from 'react-router-dom';
import Header from '../../Components/Header';

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (!token) navigate("/home");
  }, [navigate]);

  return (
    <div className={style["layout"]}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
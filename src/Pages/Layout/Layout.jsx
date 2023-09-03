import { useEffect, useState } from 'react';
import style from './layout.module.scss';
import { useNavigate, Outlet } from 'react-router-dom';
import Header from '../../Components/Header';
import Loader from '../../Components/Loader';

const Layout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/home");
      return;
    };

    setLoading(false);
  }, [navigate]);

  return (
    loading
      ? <Loader />
      : <div className={style["layout"]}>
        <Header />
        <Outlet />
      </div>
  );
};

export default Layout;
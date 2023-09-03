import { useEffect, useState } from 'react';
import style from './layout.module.scss';
import { useNavigate, Outlet } from 'react-router-dom';
import Header from '../../Components/Header';
import Loader from '../../Components/Loader';
import axios from 'axios';

const Layout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/home");
      return;
    };

    async function tokenVerify() {
      try {
        const { data } = await axios.get("/users/me", { headers: { 'Authorization': `Bearer ${token}` } });
        localStorage.setItem("role", data.data.role);
      } catch (error) {
        localStorage.clear();
        navigate("/home");
      };
    };
    tokenVerify();

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
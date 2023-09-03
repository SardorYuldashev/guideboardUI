import { Link, useNavigate } from 'react-router-dom';
import style from './header.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loadRefreshData } from '../../Store/slices/refresh';

const Header = () => {
  let role = localStorage.getItem("role");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState(0);
  const [loading, setLoading] = useState(false);

  const { reRender } = useSelector(({ refresh }) => refresh);

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const { data } = await axios.get("/users/me");
        setNewTask(data.data.todo_guides);

        dispatch(loadRefreshData(false));
        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    };
    getUser();
  }, [reRender]);

  function logout() {
    let question = confirm("Rostdan ham profilingizdan chiqmoqchimisiz?");

    if (!question) {
      return;
    };

    localStorage.clear();
    navigate("/home");
  };

  return (
    <div className={style["header"]}>
      <div className="container">
        <div className={style["header__content"]}>

          <Link to="/" className={style["header__content-logo"]}>
            Guide Board
          </Link>

          <ul className={style["header__content-ul"]}>

            {role === "admin" ?
              <li className={style["header__content-li"]}>
                <Link to="/users" className={style["header__content-link"]}>Foydalanuvchilar</Link>
              </li> : <li></li>
            }

            {role === "admin" ?
              <li className={style["header__content-li"]}>
                <Link to="/tasks" className={style["header__content-link"]}>Vazifalar</Link>
              </li> : <li></li>
            }

            <li className={style["header__content-li"]}>
              <Link to="/tasks/my" className={style["header__content-link"]}>Mening vazifalarim</Link>
              {newTask === 0 ?
                <div className={style["header__content-circleNone"]}></div> :
                <div className={style["header__content-circle"]}></div>
              }
            </li>

            <li className={style["header__content-li"]}>
              <Link to="/profile" className={style["header__content-link"]}>Shaxsiy kabinet</Link>
            </li>

            <li className={style["header__content-li"]}>
              <div onClick={logout} className={style["header__content-link"]}>Chiqish</div>
            </li>

          </ul>

        </div>
      </div>
    </div>
  );
};

export default Header;
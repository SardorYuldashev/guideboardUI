import { Link, useNavigate } from 'react-router-dom';
import style from './header.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loadRefreshData } from '../../Store/slices/refresh';
import {
  loadURL as loadURL_my,
  loadLimit as loadLimit_my,
  loadOffset as loadOffset_my,
  loadFilters as loadFilters_my
} from '../../Store/slices/taskMy';
import {
  loadURL as loadURL_all,
  loadLimit as loadLimit_all,
  loadOffset as loadOffset_all,
  loadFilters as loadFilters_all
} from '../../Store/slices/taskAll';
import {
  loadURL as loadURL_guides,
  loadLimit as loadLimit_guides,
  loadOffset as loadOffset_guides,
  loadSearch as loadSearch_guides,
  loadSort as loadSort_guides
} from '../../Store/slices/guides';
import {
  loadURL as loadURL_users,
  loadLimit as loadLimit_users,
  loadOffset as loadOffset_users,
  loadSearch as loadSearch_users,
  loadSortBy as loadSortBy_users,
  loadSortOrder as loadSortOrder_users,
  loadRole as loadRole_users
} from '../../Store/slices/users';

const Header = () => {
  let role = localStorage.getItem("role");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState(0);
  const { reRender } = useSelector(({ refresh }) => refresh);

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await axios.get("/users/me");
        setNewTask(data.data.todo_guides);
        
        dispatch(loadRefreshData(false));
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

    clickProfileAndLogout();
    localStorage.clear();
    navigate("/");
  };

  function clickGuides() {
    clearTasksMyStore();
    clearTasksAllStore();
    clearUsersStore();
  };

  function clickUsers() {
    clearTasksMyStore();
    clearTasksAllStore();
    clearGuidesStore();
  };

  function clickTasksAll() {
    clearTasksMyStore();
    clearGuidesStore();
    clearUsersStore();
  };

  function clickTasksMy() {
    clearTasksAllStore();
    clearGuidesStore();
    clearUsersStore();
  };

  function clickProfileAndLogout() {
    clearTasksMyStore();
    clearTasksAllStore();
    clearGuidesStore();
    clearUsersStore();
  };

  function clearTasksMyStore() {
    dispatch(loadURL_my("/user-guides"));
    dispatch(loadLimit_my(10));
    dispatch(loadOffset_my(0));
    dispatch(loadFilters_my(false));
  };

  function clearTasksAllStore() {
    dispatch(loadURL_all("/user-guides/all"));
    dispatch(loadLimit_all(10));
    dispatch(loadOffset_all(0));
    dispatch(loadFilters_all("all"));
  };

  function clearGuidesStore() {
    dispatch(loadURL_guides("/guides"));
    dispatch(loadLimit_guides(10));
    dispatch(loadOffset_guides(0));
    dispatch(loadSearch_guides(""));
    dispatch(loadSort_guides("asc"));
  };

  function clearUsersStore() {
    dispatch(loadURL_users("/users"));
    dispatch(loadLimit_users(10));
    dispatch(loadOffset_users(0));
    dispatch(loadSearch_users(""));
    dispatch(loadSortBy_users("id"));
    dispatch(loadSortOrder_users("asc"));
    dispatch(loadRole_users("all"));
  };

  return (
    <div className={style["header"]}>
      <div className="container">
        <div className={style["header__content"]}>

          <Link onClick={clickGuides} to="/" className={style["header__content-logo"]}>
            Guide Board
          </Link>

          <ul className={style["header__content-ul"]}>

            {role === "admin" ?
              <li className={style["header__content-li"]}>
                <Link onClick={clickUsers} to="/users" className={style["header__content-link"]}>Foydalanuvchilar</Link>
              </li> : <li></li>
            }

            {role === "admin" ?
              <li className={style["header__content-li"]}>
                <Link onClick={clickTasksAll} to="/tasks" className={style["header__content-link"]}>Vazifalar</Link>
              </li> : <li></li>
            }

            <li className={style["header__content-li"]}>
              <Link onClick={clickGuides} to="/" className={style["header__content-link"]}>Qoidalar</Link>
            </li>

            <li className={style["header__content-li"]}>
              <Link onClick={clickTasksMy} to="/tasks/my" className={style["header__content-link"]}>Vazifalarim</Link>
              {newTask === 0 ?
                <div className={style["header__content-circleNone"]}></div> :
                <div className={style["header__content-circle"]}></div>
              }
            </li>

            <li className={style["header__content-li"]}>
              <Link onClick={clickProfileAndLogout} to="/profile" className={style["header__content-link"]}>Shaxsiy kabinet</Link>
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
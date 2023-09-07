import axios from 'axios';
import style from './users.module.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { loadURL, loadLimit, loadOffset, loadSearch, loadSortBy, loadSortOrder, loadRole } from '../../Store/slices/users';

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { URL, limit, offset, search, sortBy, sortOrder, userRole } = useSelector(({ users }) => users);
  const [pageArr, setPageArr] = useState(null);

  useEffect(() => {
    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "warning" });
      navigate("/");
      return;
    };

    async function getGuides() {
      try {
        let { data } = await axios.get(`${URL}`);
        setUsers(data);

        const pageList = [];
        for (let i = 0; i < Math.ceil(data.pageInfo.total / limit); i++) {
          pageList.push(i);
        };
        setPageArr(pageList);

        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        navigate("/");
      };
    };
    getGuides();
  }, [refresh]);

  function handleQuery(e) {
    dispatch(loadSearch(e.target.value));
  };

  function handleSearch(e) {
    e.preventDefault();
    dispatch(loadSortBy("id"));
    dispatch(loadSortOrder("asc"));
    dispatch(loadOffset(0));

    if (search === "") {
      dispatch(loadURL(`/users?page[limit]=${limit}&page[offset]=0`));
      setRefresh(!refresh);
      return;
    };

    dispatch(loadURL(`/users?q=${search}&page[limit]=${limit}&page[offset]=0`));
    setRefresh(!refresh);
  };

  function handleForm(e) {
    if (e.target.name === "by") {
      dispatch(loadSortBy(e.target.value));
      dispatch(loadOffset(0));
    } else if (e.target.name === "order") {
      dispatch(loadSortOrder(e.target.value));
      dispatch(loadOffset(0));
    } else if (e.target.name === "limit") {
      dispatch(loadLimit(Number(e.target.value)));
      dispatch(loadOffset(0));
    } else if (e.target.name === "role") {
      dispatch(loadRole(e.target.value));
      dispatch(loadOffset(0));
    } else if (e.target.name === "offset") {
      dispatch(loadOffset(e.target.value * limit));
    };
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (search === "") {
      if (userRole === "all") {
        dispatch(loadURL(`/users?sort[by]=${sortBy}&sort[order]=${sortOrder}&page[limit]=${limit}&page[offset]=${offset}`));
        setLoading(true);
        setRefresh(!refresh);;
        return;
      };

      dispatch(loadURL(`/users?filters[role]=${userRole}&sort[by]=${sortBy}&sort[order]=${sortOrder}&page[limit]=${limit}&page[offset]=${offset}`));
      setLoading(true);
      setRefresh(!refresh);;
      return;
    };

    if (userRole !== "all") {
      dispatch(loadURL(`/users?q=${search}&filters[role]=${userRole}&sort[by]=${sortBy}&sort[order]=${sortOrder}&page[limit]=${limit}&page[offset]=${offset}`));
      setLoading(true);
      setRefresh(!refresh);
      return;
    };

    dispatch(loadURL(`/users?q=${search}&sort[by]=${sortBy}&sort[order]=${sortOrder}&page[limit]=${limit}&page[offset]=${offset}`));
    setLoading(true);
    setRefresh(!refresh);
  };

  async function deleteUser(id) {
    let question = confirm("Rostdan ham foydalanuvchini o'chirmoqchimisiz?");

    if (!question) {
      return;
    };

    try {
      setLoading(true);
      let { data } = await axios.delete(`/users/${id}`);

      toast("Foydalanuvchi o'chirildi", { type: "success" });
      setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.error, { type: "warning" });
      setRefresh(!refresh);
    };
  };

  return (
    loading
      ? <Loader />
      : <div className={style["users"]}>
        <div className="container">
          <div className={style["users__content"]}>

            <div className={style["users__content-top"]}>
              <h1 className={style["users__content-text"]}>
                Foydalanuvchilar
              </h1>

              <Link to="/users/add" className={style["users__content-add"]}>
                Foydalanuvchi qo'shish
              </Link>
            </div>

            <div className={style["users__content-tools"]}>
              <form onSubmit={handleSearch} className={style["users__content-search"]}>
                <input
                  type="text"
                  id='search'
                  name='search'
                  value={search}
                  onChange={handleQuery}
                  placeholder='Search'
                />

                <button type="submit">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </form>

              <form onSubmit={handleSubmit} className={style["users__content-sort"]}>
                <select onChange={handleForm} defaultValue={userRole} name="role" id="role">
                  <option value="all">Barcha</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>

                <select onChange={handleForm} defaultValue={sortBy} name="by" id="by">
                  <option value="id">ID</option>
                  <option value="age">Age</option>
                </select>

                <select onChange={handleForm} defaultValue={sortOrder} name="order" id="order">
                  <option value="asc">O'sish</option>
                  <option value="desc">Kamayish</option>
                </select>

                <select onChange={handleForm} defaultValue={limit} name="limit" id="limit">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                <button type="submit">
                  OK
                </button>
              </form>
            </div>

            <p className={style["users__content-pageInfo"]}>
              Foydalanuvchilar ( Jami: <span>{users.pageInfo.total}</span> | Sahifada: <span>{users.data.length}</span> )
            </p>

            <ul className={style["users__content-table"]}>
              <li className={style["users__content-element"]}>
                <h2 className={style["users__content-item"]}>
                  ID
                </h2>

                <h2 className={style["users__content-item"]}>
                  ISM
                </h2>

                <h2 className={style["users__content-item"]}>
                  FAMILIYA
                </h2>

                <h2 className={style["users__content-item"]}>
                  YOSH
                </h2>

                <h2 className={style["users__content-item"]}>
                  USERNAME
                </h2>

                <h2 className={style["users__content-item"]}>
                  LAVOZIM
                </h2>

                <h2 className={style["users__content-item"]}>
                  TOOLS
                </h2>
              </li>

              {
                users.data?.map((user) => (
                  <li key={user.id} className={style["users__content-li"]}>
                    <p className={style["users__content-info"]}>
                      {user.id}
                    </p>

                    <p className={style["users__content-info"]}>
                      {user.first_name}
                    </p>

                    <p className={style["users__content-info"]}>
                      {user.last_name}
                    </p>

                    <p className={style["users__content-info"]}>
                      {user.age}
                    </p>

                    <p className={style["users__content-info"]}>
                      {user.username}
                    </p>

                    <p className={style["users__content-info"]}>
                      {user.role}
                    </p>

                    <p className={style["users__content-buttons"]}>

                      <Link to={`/users/edit/${user.id}`} className={style["users__content-btn"]}>
                        <i className="fa-solid fa-pen"></i>
                      </Link>

                      <Link to={`/users/${user.id}`} className={style["users__content-btn"]}>
                        <i className="fa-solid fa-eye"></i>
                      </Link>

                      <button onClick={() => deleteUser(user.id)} id={user.id} className={style["users__content-btn"]}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </p>
                  </li>
                ))
              }
            </ul>

            <form onSubmit={handleSubmit} className={style["users__content-pageList"]}>
              {
                pageArr.map(item => (
                  <button
                    type='submit'
                    key={item}
                    value={item}
                    name='offset'
                    onClick={handleForm}
                    className={style["users__content-page"]}>
                    {item + 1}
                  </button>
                ))
              }
            </form>

          </div>
        </div>
      </div>
  );
};

export default Users;
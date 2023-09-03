import axios from 'axios';
import style from './users.module.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';

const Users = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [URL, setURL] = useState('/users');
  const [sort, setSort] = useState({ by: "id", order: "asc" });
  const [filter, setFilter] = useState("");

  const optionsFilter = [
    { value: "", text: 'Hamma' },
    { value: 'admin', text: 'Admin' },
    { value: 'employee', text: 'Employee' }
  ];

  const [selected, setSelected] = useState(optionsFilter[0].value);

  useEffect(() => {
    if (!token) {
      toast("Profilga kirmagansiz", { type: "error" });
      navigate("/home");
    }
    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "error" });
      navigate("/");
    };

    async function getGuides() {
      try {
        setLoading(true);
        let { data } = await axios.get(`${URL}`);
        setUsers(data);
        setLoading(false);
        setURL('/users');
        setSort({ by: "id", order: "asc" });
        setSelected(optionsFilter[0].value);
        setFilter("");
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    };
    getGuides();
  }, [refresh]);

  function handleQuery(e) {
    setSearch(e.target.value);
  };

  function handleSearch(e) {
    e.preventDefault();
    if (search === "") {
      setURL('/users');
      setRefresh(!refresh);
      return;
    };
    setURL(`${URL}?q=${search}`);
    setFilter(null);
    setRefresh(!refresh);
  };

  function handleSelect(e) {
    setSort((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  };

  function handleFilter(e) {
    if (e.target.value === "admin") {
      setFilter("admin");
    } else if (e.target.value === "employee") {
      setFilter("employee");
    } else if (e.target.value === "") {
      setFilter("");
    };

    setSelected(e.target.value);
  };

  function handleSort(e) {
    e.preventDefault();

    if (search === "" && filter === "") {
      setURL(`${URL}?sort[by]=${sort.by}&sort[order]=${sort.order}`);
      setRefresh(!refresh);
      return
    };

    if (search === "" && filter !== "") {
      setURL(`${URL}?filters[role]=${filter}&sort[by]=${sort.by}&sort[order]=${sort.order}`);
      setRefresh(!refresh);
      return
    };

    if (search !== "" && filter === "") {
      setURL(`${URL}?q=${search}&sort[by]=${sort.by}&sort[order]=${sort.order}`);
      setRefresh(!refresh);
      return
    };

    if (search !== "" && filter !== "") {
      setURL(`${URL}?q=${search}&filters[role]=${filter}&sort[by]=${sort.by}&sort[order]=${sort.order}`);
      setRefresh(!refresh);
      return
    };
  };

  async function deleteUser(id) {
    let question = confirm("Rostdan ham foydalanuvchini o'chirmoqchimisiz?");

    if (!question) {
      return;
    };

    try {
      setLoading(true);
      let { data } = await axios.delete(`/users/${id}`);

      if (!data) {
        toast("Serverda xatolik", { type: "error" });
        setRefresh(!refresh);
        return;
      };
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

              <form onSubmit={handleSort} className={style["users__content-sort"]}>

                <select value={selected} onChange={handleFilter}>
                  {optionsFilter.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>

                <select onChange={handleSelect} name="by" id="by">
                  <option value="id">ID</option>
                  <option value="age">Age</option>
                </select>

                <select onChange={handleSelect} name="order" id="order">
                  <option value="asc">O'sish</option>
                  <option value="desc">Kamayish</option>
                </select>

                <button type="submit">Send</button>

              </form>

            </div>

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

          </div>
        </div>
      </div>
  );
};

export default Users;
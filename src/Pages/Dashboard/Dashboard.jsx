import style from './dashboard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../Components/Loader';
import pin from '../../assets/images/pin.webp';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [URL, setURL] = useState('/guides');
  const [sort, setSort] = useState({ by: "id", order: "asc" });

  useEffect(() => {
    setLoading(true)
    if (!token) {
      navigate("/home");
      setLoading(false);
      return;
    };
    setLoading(false);

    async function getGuides() {
      try {
        setLoading(true);
        let { data } = await axios.get(`${URL}`);
        setGuides(data);
        setLoading(false);
        setURL('/guides');
        setSort({ by: "id", order: "asc" })
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
      setURL('/guides');
      setRefresh(!refresh);
      return;
    };
    setURL(`${URL}?q=${search}`);
    setRefresh(!refresh);
  };

  function handleSelect(e) {
    setSort((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  };

  function handleSort(e) {
    e.preventDefault();
    if (search === "") {
      setURL(`${URL}?sort[by]=${sort.by}&sort[order]=${sort.order}`);
      setRefresh(!refresh);
      return
    }
    setURL(`${URL}?q=${search}&sort[by]=${sort.by}&sort[order]=${sort.order}`);
    setRefresh(!refresh);
  };

  return (
    loading
      ? <Loader />
      :
      <div className={style["dashboard"]}>
        <div className="container">
          <div className={style["dashboard__content"]}>

            <div className={style["dashboard__content-top"]}>

              <h1 className={style["dashboard__content-text"]}>
                Qoidalar
              </h1>

              {
                role === "admin"
                  ? <Link to="/guides/add" className={style["dashboard__content-add"]}>
                    Qoida qo'shish
                  </Link>
                  : <div></div>
              }

            </div>

            <div className={style["dashboard__content-tools"]}>

              <form onSubmit={handleSearch} className={style["dashboard__content-search"]}>
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

              <form onSubmit={handleSort} className={style["dashboard__content-sort"]}>

                <select onChange={handleSelect} name="order" id="order">
                  <option value="asc">O'sish</option>
                  <option value="desc">Kamayish</option>
                </select>

                <button type="submit">Send</button>
              </form>

            </div>

            <ul className={style["dashboard__content-list"]}>
              {
                guides?.data?.map((guide) => (

                  <li key={guide.id} className={style["dashboard__content-li"]}>
                    <Link to={`/guides/${guide.id}`} className={style["dashboard__content-link"]}>
                      <div className={style["dashboard__content-info"]}>

                        <div className={style["dashboard__content-titleBox"]}>
                          <h2 className={style["dashboard__content-title"]}>
                            {guide.title}
                          </h2>
                        </div>

                        <div className={style["dashboard__content-contentBox"]}>
                          <p className={style["dashboard__content-content"]}>
                            {guide.content}
                          </p>
                        </div>

                        <div className={style["dashboard__content-imgBox"]}>
                          <img src={pin} alt="mark" className={style["dashboard__content-img"]} />
                        </div>

                      </div>
                    </Link>
                  </li>
                ))
              }

            </ul>
          </div>
        </div>
      </div>
  )
}

export default Dashboard
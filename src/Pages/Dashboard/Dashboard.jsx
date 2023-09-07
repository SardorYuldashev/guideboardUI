import style from './dashboard.module.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../Components/Loader';
import pin from '../../assets/images/pin.webp';
import { useDispatch, useSelector } from 'react-redux';
import { loadURL, loadLimit, loadOffset, loadSearch, loadSort } from '../../Store/slices/guides';

const Dashboard = () => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { URL, limit, offset, search, sort } = useSelector(({ guides }) => guides);
  const [pageArr, setPageArr] = useState(null);

  useEffect(() => {
    async function getGuides() {
      try {
        let { data } = await axios.get(`${URL}`);
        setGuides(data);

        const pageList = [];
        for (let i = 0; i < Math.ceil(data.pageInfo.total / limit); i++) {
          pageList.push(i);
        };
        setPageArr(pageList);

        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    };
    getGuides();
  }, [refresh]);

  function handleQuery(e) {
    dispatch(loadSearch(e.target.value));
  };

  function handleSearch(e) {
    e.preventDefault();
    dispatch(loadSort("asc"));
    dispatch(loadOffset(0));

    if (search === "") {
      dispatch(loadURL(`/guides?page[limit]=${limit}&page[offset]=0`));
      setRefresh(!refresh);
      return;
    };

    dispatch(loadURL(`/guides?q=${search}&page[limit]=${limit}&page[offset]=0`));
    setRefresh(!refresh);
  };

  function handleForm(e) {
    if (e.target.name === "order") {
      dispatch(loadSort(e.target.value));
      dispatch(loadOffset(0));
    } else if (e.target.name === "limit") {
      dispatch(loadLimit(Number(e.target.value)));
      dispatch(loadOffset(0));
    } else if (e.target.name === "offset") {
      dispatch(loadOffset(e.target.value * limit));
    };
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (search === "") {
      dispatch(loadURL(`/guides?sort[by]=id&sort[order]=${sort.order}&page[limit]=${limit}&page[offset]=${offset}`));
      setLoading(true);
      setRefresh(!refresh);;
      return;
    };

    dispatch(loadURL(`/guides?q=${search}&sort[by]=id&sort[order]=${sort.order}&page[limit]=${limit}&page[offset]=${offset}`));
    setLoading(true);
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

              <form onSubmit={handleSubmit} className={style["dashboard__content-sort"]}>
                <select onChange={handleForm} defaultValue={sort.order} name="order" id="order">
                  <option value="asc">O'sish</option>
                  <option value="desc">Kamayish</option>
                </select>

                <select onChange={handleForm} defaultValue={limit} name="limit" id="limit">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                <button type="submit">OK</button>
              </form>
            </div>

            <p className={style["dashboard__content-pageInfo"]}>
              Qoidalar ( Jami: <span>{guides.pageInfo.total}</span> | Sahifada: <span>{guides.data.length}</span> )
            </p>

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

            <form onSubmit={handleSubmit} className={style["dashboard__content-pageList"]}>
              {
                pageArr.map(item => (
                  <button
                    type='submit'
                    key={item}
                    value={item}
                    name='offset'
                    onClick={handleForm}
                    className={style["dashboard__content-page"]}>
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

export default Dashboard;
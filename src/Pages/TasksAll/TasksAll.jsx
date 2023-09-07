import style from './tasksAll.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import green_mark from '../../assets/images/green_mark.webp';
import red_mark from '../../assets/images/red_mark.webp';
import Loader from './../../Components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { loadRefreshData } from '../../Store/slices/refresh';
import { loadURL, loadLimit, loadOffset, loadFilters } from '../../Store/slices/taskAll';

const TasksAll = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState([]);
  const { URL, limit, offset, filters } = useSelector(({ taskAll }) => taskAll);
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
        setTask(data);

        const pageList = [];
        for (let i = 0; i < Math.ceil(data.pageInfo.total / limit); i++) {
          pageList.push(i);
        };
        setPageArr(pageList);

        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        setRefresh(!refresh);
      };
    };
    getGuides();
  }, [refresh]);

  async function deleteTask(id) {
    let question = confirm("Rostdan ham vazifani o'chirmoqchimisiz?");
    if (!question) {
      return;
    };

    try {
      setLoading(true);
      let { data } = await axios.delete(`/user-guides/${id}`);

      toast("Vazifa o'chirildi", { type: "info" });
      dispatch(loadRefreshData(true));
      setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  function handleForm(e) {
    if (e.target.name === "sort") {
      dispatch(loadFilters(e.target.value));
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

    if (filters.completed === "all") {
      dispatch(loadURL(`/user-guides/all?page[limit]=${limit}&page[offset]=${offset}`));
      setLoading(true);
      setRefresh(!refresh);
      return;
    };

    dispatch(loadURL(`/user-guides/all?filters[completed]=${filters.completed}&page[limit]=${limit}&page[offset]=${offset}`));
    setLoading(true);
    setRefresh(!refresh);
  };

  return (
    loading
      ? <Loader />
      : <div className={style["tasksAll"]}>
        <div className="container">
          <div className={style["tasksAll__content"]}>

            <div className={style["tasksAll__content-top"]}>
              <h1 className={style["tasksAll__content-text"]}>
                Vazifalar
              </h1>

              <Link to="/tasks/add" className={style["tasksAll__content-add"]}>
                Vazifa yaratish
              </Link>
            </div>

            <div className={style["tasksAll__content-tools"]}>
              <form onSubmit={handleSubmit} className={style["tasksAll__content-filter"]}>
                <select onChange={handleForm} defaultValue={filters.completed} name="sort" id="sort">
                  <option value="all">Barchasi</option>
                  <option value={false}>Ko'rilmaganlar</option>
                  <option value={true}>Ko'rilganlar</option>
                </select>

                <select onChange={handleForm} defaultValue={limit} name="limit" id="limit">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                <button type="submit">OK</button>
              </form>
            </div>

            <p className={style["tasksAll__content-pageInfo"]}>
              Vazifalar (Jami: <span>{task.pageInfo.total}</span> | Sahifada: <span>{task.data.length}</span> )
            </p>

            <ul className={style["tasksAll__content-table"]}>
              <li className={style["tasksAll__content-element"]}>
                <h2 className={style["tasksAll__content-item"]}>
                  ID
                </h2>

                <h2 className={style["tasksAll__content-item"]}>
                  XODIM
                </h2>

                <h2 className={style["tasksAll__content-item"]}>
                  USERNAME
                </h2>

                <h2 className={style["tasksAll__content-item"]}>
                  LAVOZIM
                </h2>

                <h2 className={style["tasksAll__content-item"]}>
                  QOIDA
                </h2>

                <h2 className={style["tasksAll__content-item"]}>
                  STATUS
                </h2>

                <h2 className={style["tasksAll__content-item"]}>
                  TOOLS
                </h2>
              </li>

              {
                task.data?.map((item) => (
                  <li key={item.id} className={style["tasksAll__content-li"]}>
                    <p className={style["tasksAll__content-info"]}>
                      {item.id}
                    </p>

                    <p className={style["tasksAll__content-info"]}>
                      <Link to={`/users/${item.guide.id}`} className={style["tasksAll__content-titleBox"]}>
                        {item.user.first_name} {item.user.last_name}
                      </Link>
                    </p>

                    <p className={style["tasksAll__content-info"]}>
                      {item.user.username}
                    </p>

                    <p className={style["tasksAll__content-info"]}>
                      {item.user.role}
                    </p>

                    <div className={style["tasksAll__content-info"]}>
                      <Link to={`/guides/${item.guide.id}`} className={style["tasksAll__content-titleBox"]}>
                        ID:{item.guide.id} - {item.guide.title}
                      </Link>
                    </div>

                    <div className={style["tasksAll__content-info"]}>
                      <div className={style["tasksAll__content-imgBox"]}>
                        {item.completed
                          ? <img
                            className={style["tasksAll__content-img"]}
                            src={green_mark}
                            alt="mark" />
                          : <img
                            className={style["tasksAll__content-img"]}
                            src={red_mark}
                            alt="mark" />}
                      </div>
                    </div>

                    <p className={style["tasksAll__content-buttons"]}>
                      <button onClick={() => { deleteTask(item.id) }} className={style["tasksAll__content-btn"]}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </p>
                  </li>
                ))
              }
            </ul>

            <form onSubmit={handleSubmit} className={style["tasksAll__content-pageList"]}>
              {
                pageArr.map(item => (
                  <button
                    type='submit'
                    key={item}
                    value={item}
                    name='offset'
                    onClick={handleForm}
                    className={style["tasksAll__content-page"]}>
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

export default TasksAll;
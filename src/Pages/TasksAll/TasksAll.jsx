import style from './tasksAll.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import green_mark from '../../assets/images/green_mark.webp';
import red_mark from '../../assets/images/red_mark.webp';
import Loader from './../../Components/Loader';
import { useDispatch } from 'react-redux';
import { loadRefreshData } from '../../Store/slices/refresh';

const TasksAll = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState([]);
  const [URL, setURL] = useState("/user-guides/all");
  const [filter, setFilter] = useState({ completed: "all" });

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
        setLoading(false);
        setURL("/user-guides/all");
        setFilter({ completed: "all" });
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        setURL("/user-guides/all");
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

      if (!data) {
        toast("Serverda xatolik", { type: "error" });
        setLoading(false);
        setRefresh(!refresh);
        return;
      };

      toast("Vazifa o'chirildi", { type: "info" });
      dispatch(loadRefreshData(true));
      setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };


  function handleSelect(e) {
    setFilter((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  };

  function handleSort(e) {
    e.preventDefault();

    if (filter.completed === "all") {
      setURL("/user-guides/all");
      setRefresh(!refresh);
      return;
    };

    setURL(`/user-guides/all?filters[completed]=${filter.completed}`);
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
                Barcha vazifalar
              </h1>
            </div>

            <div className={style["tasksAll__content-tools"]}>

              <form onSubmit={handleSort} className={style["tasksAll__content-filter"]}>

                <select onChange={handleSelect} name="completed" id="completed">
                  <option value="all">Barchasi</option>
                  <option value={false}>Ko'rilmaganlar</option>
                  <option value={true}>Ko'rilganlar</option>
                </select>

                <button type="submit">Send</button>

              </form>



            </div>


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
                      {item.user.first_name} {item.user.last_name}
                    </p>

                    <p className={style["tasksAll__content-info"]}>
                      {item.user.username}
                    </p>

                    <p className={style["tasksAll__content-info"]}>
                      {item.user.role}
                    </p>

                    <div className={style["tasksAll__content-info"]}>
                      <p className={style["tasksAll__content-titleBox"]}>
                        ID:{item.guide.id} - {item.guide.title}
                      </p>
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

                      <Link className={style["tasksAll__content-btn"]}>
                        <i className="fa-solid fa-pen"></i>
                      </Link>

                      <button onClick={() => { deleteTask(item.id) }} className={style["tasksAll__content-btn"]}>
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

export default TasksAll;
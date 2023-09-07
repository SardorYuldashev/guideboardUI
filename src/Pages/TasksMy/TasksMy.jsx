import { Link } from 'react-router-dom';
import style from './tasksMy.module.scss'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import green_mark from '../../assets/images/green_mark.webp';
import red_mark from '../../assets/images/red_mark.webp';
import Loader from './../../Components/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { loadURL, loadLimit, loadOffset, loadFilters } from '../../Store/slices/taskMy';

const TasksMy = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const dispatch = useDispatch();
  const { URL, limit, offset, filters } = useSelector(({ taskMy }) => taskMy);
  const [pageArr, setPageArr] = useState(null);

  useEffect(() => {
    async function getGuides() {
      try {
        let { data } = await axios.get(`${URL}`);

        setTasks(data);

        // Pagenatsiya uchun arr yasash
        const pageList = [];
        const totalPages = Math.ceil(data.pageInfo.total / limit)
        for (let i = 0; i < totalPages; i++) {
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
      dispatch(loadURL(`/user-guides?page[limit]=${limit}&page[offset]=${offset}`));
      setLoading(true);
      setRefresh(!refresh);
      return;
    };

    dispatch(loadURL(`/user-guides?filters[completed]=${filters.completed}&page[limit]=${limit}&page[offset]=${offset}`));
    setLoading(true);
    setRefresh(!refresh);
  };

  return (
    loading
      ? <Loader />
      : <div className={style["tasksMy"]}>
        <div className="container">
          <div className={style["tasksMy__content"]}>

            <div className={style["tasksMy__content-top"]}>
              <h1 className={style["tasksMy__content-text"]}>
                Vazifalarim
              </h1>
            </div>

            <div className={style["tasksMy__content-tools"]}>

              <form onSubmit={handleSubmit} className={style["tasksMy__content-filter"]}>

                <select onChange={handleForm} value={filters.completed} name="sort" id="sort">
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

            <p className={style["tasksMy__content-pageInfo"]}>
              Vazifalarim ( Jami: <span>{tasks.pageInfo.total}</span> | Sahifada: <span>{tasks.data.length}</span> )
            </p>

            <div className={style["tasksMy__content-tasksBox"]}>
              {
                tasks.data?.length === 0
                  ? <h2 className={style["tasksMy__content-tasksNot"]}>Hozircha vazifalar mavjud emas!</h2> :

                  <ul className={style["tasksMy__content-list"]}>
                    {
                      tasks.data?.map(item => (

                        <li key={item.id} className={style["tasksMy__content-li"]}>
                          <Link to={`/tasks/${item.id}`} className={style["tasksMy__content-link"]}>
                            <div className={style["tasksMy__content-info"]}>

                              <div className={style["tasksMy__content-titleBox"]}>
                                <h2 className={style["tasksMy__content-title"]}>
                                  {item.guide.title}
                                </h2>
                              </div>

                              <div className={style["tasksMy__content-contentBox"]}>
                                <p className={style["tasksMy__content-content"]}>
                                  {item.guide.content}
                                </p>
                              </div>

                              <div className={style["tasksMy__content-imgBox"]}>
                                {item.completed
                                  ? <img src={green_mark} alt="mark" className={style["tasksMy__content-img"]} />
                                  : <img src={red_mark} alt="mark" className={style["tasksMy__content-img"]} />
                                }
                              </div>

                            </div>
                          </Link>
                        </li>

                      ))
                    }

                  </ul>
              }
            </div>            

            <form onSubmit={handleSubmit} className={style["tasksMy__content-pageList"]}>
              {
                pageArr.map(item => (
                  <button
                    type='submit'
                    key={item}
                    value={item}
                    name='offset'
                    onClick={handleForm}
                    className={style["tasksMy__content-page"]}>
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

export default TasksMy;
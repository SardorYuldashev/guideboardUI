import { Link } from 'react-router-dom';
import style from './tasksMy.module.scss'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import green_mark from '../../assets/images/green_mark.webp';
import red_mark from '../../assets/images/red_mark.webp';
import Loader from './../../Components/Loader';

const TasksMy = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [URL, setURL] = useState("/user-guides");
  const [filter, setFilter] = useState({ completed: "false" });

  useEffect(() => {
    async function getGuides() {
      try {
        let { data } = await axios.get(`${URL}`);

        setTasks(data);
        setLoading(false);
        setURL("/user-guides");
        setFilter({ completed: false });
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        setURL("/user-guides");
        setRefresh(!refresh);
      };
    };
    getGuides();
  }, [refresh]);

  function handleSelect(e) {
    setFilter((ov) => ({ ...ov, [e.target.name]: e.target.value }));
  };

  function handleSort(e) {
    e.preventDefault();
    setURL(`/user-guides?filters[completed]=${filter.completed}`);
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
                Mening vazifalarim
              </h1>
            </div>

            <div className={style["tasksMy__content-tools"]}>

              <form onSubmit={handleSort} className={style["tasksMy__content-filter"]}>

                <select onChange={handleSelect} name="completed" id="completed">
                  <option value={false}>Ko'rilmaganlar</option>
                  <option value={true}>Ko'rilganlar</option>
                </select>

                <button type="submit">Send</button>

              </form>



            </div>

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
          </div>
        </div>
      </div>
  );
};

export default TasksMy;
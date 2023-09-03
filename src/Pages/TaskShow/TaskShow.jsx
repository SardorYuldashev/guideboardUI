import axios from 'axios';
import style from './taskShow.module.scss';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader';
import red_mark from '../../assets/images/red_mark.webp';
import green_mark from '../../assets/images/green_mark.webp';
import { useDispatch } from 'react-redux';
import { loadRefreshData } from '../../Store/slices/refresh';

const TaskShow = () => {
  const dispatch = useDispatch()
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({});

  useEffect(() => {
    if (!token) {
      toast("Profilga kirmagansiz", { type: "error" });
      navigate("/home");
      return;
    };

    async function getTask() {
      try {
        setLoading(true);
        let { data } = await axios.get(`/user-guides/${id}`);
        setTask(data.data);
        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    }
    getTask();
  }, [refresh]);

  function back() {
    navigate(-1);
  };

  async function completed() {
    try {
      setLoading(true);
      let { data } = await axios.post(`/user-guides/${id}/read`, { completed: true });

      if (!data) {
        toast("Serverda xatolik", { type: "error" });
        navigate(-1);
        return;
      };
      toast("Tasdiqlandi", { type: "success" });
      dispatch(loadRefreshData(true));
      setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  return (
    loading
      ? <Loader />
      : <div className={style["taskShow"]}>
        <div className="container">
          <div className={style["taskShow__content"]}>

            <div className={style["taskShow__content-buttons"]}>

              <button onClick={back} className={style["taskShow__content-btn"]}>
                Ortga qaytish
              </button>

              {
                task.completed
                  ? <div className={style["taskShow__content-imgWrapper"]}>

                    <p className={style["taskShow__content-imgText"]}>
                      Siz qoida bilan <br /> tanishib chiqgansiz
                    </p>

                    <img
                      className={style["taskShow__content-img"]}
                      src={green_mark}
                      alt="mark"
                    />

                  </div>
                  : <div className={style["taskShow__content-imgWrapper"]}>
                    <p className={style["taskShow__content-imgText"]}>
                      Qoida bilan <br /> tanishib chiqilmagan
                    </p>

                    <img
                      className={style["taskShow__content-img"]}
                      src={red_mark}
                      alt="mark"
                    />

                  </div>
              }

            </div>

            <div className={style["taskShow__content-body"]}>

              <div className={style["taskShow__content-head"]}>
                <h2 className={style["taskShow__content-title"]}>
                  {task?.guide?.title}
                </h2>

                {
                  task.completed ? <div></div> :
                    <button onClick={completed} className={style["taskShow__content-completed"]}>
                      Tanishib chiqdim
                    </button>
                }
              </div>

              <p className={style["taskShow__content-content"]}>
                {task?.guide?.content}
              </p>

            </div>





          </div>
        </div>
      </div>
  )
}

export default TaskShow
import style from './taskAdd.module.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loadRefreshData } from '../../Store/slices/refresh';
import Loader from '../../Components/Loader';

const TaskAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState({ user_ids: [] });
  const [guides, setGuides] = useState({});
  const [select, setSelect] = useState({ guide_id: "" });

  useEffect(() => {
    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "warning" });
      navigate("/");
      return;
    };

    async function getGuide() {
      try {
        let { data } = await axios.get(`/guides`);

        const newData = data.data.map((item) => {
          let arr = { id: item.id };

          if (item.title.length < 96) {
            arr.title = item.title;
          } else {
            arr.title = `${(item.title.slice(0, 75))}...`;
          };

          return arr;
        });
        setGuides(newData);

        let users = await axios.get(`/users?page[limit]=1000&page[ofset]=0`);
        setUsers(users.data.data);

        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        navigate("/");
      }
    };
    getGuide();
  }, []);

  function back() {
    navigate(-1);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (select.guide_id === "") {
      toast("Qoida tanlanmagan", { type: "error" });
      return;
    };

    if (values.user_ids.length === 0) {
      toast("Foydalanuvchilar tanlanmagan", { type: "error" });
      return;
    };

    try {
      const { data } = await axios.post("/user-guides", { ...select, ...values });

      setValues({ user_ids: [] });
      setSelect({ guide_id: "" });
      toast(data.data.message, { type: "success" });
      dispatch(loadRefreshData(true));
      navigate(-1);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
      navigate("/");
    };
  };

  function handleIputChange(e) {
    const index = values.user_ids.indexOf(+e.target.value);

    if (index === -1) {
      values.user_ids.push(+e.target.value);
    } else {
      values.user_ids.splice(index, 1);
    };
  };

  function handleSelectInput(e) {
    if (e.target.value === "") {
      setSelect({ [e.target.name]: e.target.value });
    } else {
      setSelect({ [e.target.name]: +e.target.value });
    };
  };

  return (
    loading
      ? <Loader />
      : <div className={style["taskAdd"]}>
        <div className="container">
          <div className={style["taskAdd__content"]}>

            <div className={style["taskAdd__content-backBtn"]}>
              <button onClick={back} className={style["taskAdd__content-btn"]}>
                Ortga qaytish
              </button>
            </div>

            <form onSubmit={handleSubmit} className={style["taskAdd__content-form"]}>
              <h1 className={style["taskAdd__content-title"]}>
                Vazifa yaratish
              </h1>

              <div className={style["taskAdd__content-row"]}>
                <div className={style["taskAdd__content-inputs"]}>
                  <p className={style["taskAdd__content-subtitle"]}>
                    Qoida
                  </p>

                  <select name="guide_id" onChange={handleSelectInput} className={style["taskAdd__content-select"]}>
                    <option value="" className={style["taskAdd__content-option"]}>
                      Qoidani tanlang
                    </option>

                    {
                      guides.map(item => (
                        <option key={item.id} value={item.id} className={style["taskAdd__content-option"]}>
                          {item.title}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className={style["taskAdd__content-inputs"]}>
                  <p className={style["taskAdd__content-subtitle"]} >
                    Foydalanuvchilar
                  </p>

                  <ul className={style["taskAdd__content-list"]}>
                    {
                      users.map(user => (
                        <li className={style["taskAdd__content-li"]} key={user.id}>
                          <input
                            className={style["taskAdd__content-check"]}
                            onChange={handleIputChange}
                            type="checkbox"
                            name={user.id}
                            id={user.id}
                            value={user.id} />

                          <label className={style["taskAdd__content-user"]} htmlFor={user.id}>
                            <p className={style["taskAdd__content-fullName"]}>
                              {user.first_name} {user.last_name}
                            </p>

                            {user.role === "admin" ? <span>ADMIN</span> : <span></span>}
                          </label>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>

              <div className={style["taskAdd__content-buttons"]}>
                <button type='submit' className={style["taskAdd__content-btn"]} >
                  Yaratish
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
  );
};

export default TaskAdd;
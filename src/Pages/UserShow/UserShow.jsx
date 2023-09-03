import style from './userShow.module.scss';
import user_avatar from '../../assets/images/user_avatar.webp';
import admin_avatar from '../../assets/images/admin_avatar.webp';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from './../../Components/Loader';

const UserShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "warning" });
      navigate("/");
      return;
    };

    async function getUser() {
      try {
        let { data } = await axios.get(`/users/${id}`);

        setUser(data.data);
        setLoading(false)
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        navigate("/users");
      };
    };
    getUser();
  }, [refresh]);

  async function deleteUser() {
    let question = confirm("Rostdan ham foydalanuvchini o'chirmoqchimisiz?");

    if (!question) {
      return;
    };

    try {
      setLoading(true);
      let { data } = await axios.delete(`/users/${id}`);

      toast("Foydalanuvchi o'chirildi", { type: "success" });
      setLoading(false);
      navigate(-1);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
      navigate(-1);
    };
  };

  async function appointAdmin() {
    let value = {};

    if (user.role === "admin") {
      value.role = "employee";
    } else if (user.role === "employee") {
      value.role = "admin";
    };

    try {
      let { data } = await axios.patch(`/users/${id}`, value);

      toast("Lavozim o'zgartirildi", { type: "success" });
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  function back() {
    navigate(-1);
  };

  return (
    loading
      ? <Loader />
      : <div className={style["userShow"]}>
        <div className="container">
          <div className={style["userShow__content"]}>



            <div className={style["userShow__content-row"]}>

              <div className={style["userShow__content-buttons"]}>

                <button onClick={back} className={style["userShow__content-btn"]}>Ortga qaytish</button>

                <Link to={`/users/edit/${user.id}`} className={style["userShow__content-btn"]}>
                  Tahrirlash
                </Link>

                <Link to={`/users/password/${user.id}`} className={style["userShow__content-btn"]}>
                  Parolni o'zgartirish
                </Link>

                <button onClick={appointAdmin} className={style["userShow__content-btn"]}>
                  Lavozimni o'zgartirish
                </button>

                <button onClick={deleteUser} className={style["userShow__content-btn"]}>
                  O'chirish
                </button>
              </div>

              <div className={style["userShow__content-info"]}>

                <h2 className={style["userShow__content-userInfo"]}>
                  Ism: <span>{user.first_name}</span>
                </h2>

                <h2 className={style["userShow__content-userInfo"]}>
                  Familiya: <span>{user.last_name}</span>
                </h2>

                <h2 className={style["userShow__content-userInfo"]}>
                  Yosh: <span>{user.age}</span>
                </h2>

                <h2 className={style["userShow__content-userInfo"]}>
                  Username: <span>{user.username}</span>
                </h2>

                <h2 className={style["userShow__content-userInfo"]}>
                  Lavozim: <span>{user.role === "admin" ? "Administrator" : "Ishchi"}</span>
                </h2>

                <h2 className={style["userShow__content-userInfo"]}>
                  Vazifalar soni: <span>{user.total_guides}</span>
                </h2>

                <h2 className={style["userShow__content-userInfo"]}>
                  Ko'rib chiqilgan: <span>{user.read_guides}</span>
                </h2>

                <h2 className={style["userShow__content-userInfo"]}>
                  Ko'rilmagan: <span>{user.todo_guides}</span>
                </h2>
              </div>

              <div className={style["userShow__content-imgBox"]}>
                <img
                  src={user.role === "admin" ? admin_avatar : user_avatar}
                  className={style["userShow__content-img"]}
                  alt="avatar"
                />
              </div>



            </div>
          </div>
        </div>
      </div>
  );
};

export default UserShow;
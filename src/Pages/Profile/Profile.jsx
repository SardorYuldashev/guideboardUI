import style from './profile.module.scss';
import user_avatar from '../../assets/images/user_avatar.webp';
import admin_avatar from '../../assets/images/admin_avatar.webp';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from './../../Components/Loader';

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        let { data } = await axios.get("/users/me");
        setUser(data.data);

        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    };
    getUser();
  }, []);

  return (
    loading
      ? <Loader />
      : <div className={style["profile"]}>
        <div className="container">
          <div className={style["profile__content"]}>

            <div className={style["profile__content-top"]}>
              <h1 className={style["profile__content-text"]}>
                Shaxsiy kabinet
              </h1>
            </div>

            <div className={style["profile__content-row"]}>
              <div className={style["profile__content-imgBox"]}>
                <img
                  src={user.role === "admin" ? admin_avatar : user_avatar}
                  className={style["profile__content-img"]}
                  alt="avatar"
                />
              </div>

              <div className={style["profile__content-info"]}>
                <h2 className={style["profile__content-userInfo"]}>
                  Ism: <span>{user.first_name}</span>
                </h2>

                <h2 className={style["profile__content-userInfo"]}>
                  Familiya: <span>{user.last_name}</span>
                </h2>

                <h2 className={style["profile__content-userInfo"]}>
                  Yosh: <span>{user.age}</span>
                </h2>

                <h2 className={style["profile__content-userInfo"]}>
                  Username: <span>{user.username}</span>
                </h2>

                <h2 className={style["profile__content-userInfo"]}>
                  Lavozim: <span>{user.role === "admin" ? "Administrator" : "Ishchi"}</span>
                </h2>
              </div>

              <div className={style["profile__content-info"]}>
                <h2 className={style["profile__content-userInfo"]}>
                  Vazifalar soni: <span>{user.total_guides}</span>
                </h2>

                <h2 className={style["profile__content-userInfo"]}>
                  Ko'rib chiqilgan: <span>{user.read_guides}</span>
                </h2>

                <h2 className={style["profile__content-userInfo"]}>
                  Ko'rilmagan: <span>{user.todo_guides}</span>
                </h2>

                <Link to={`/users/edit/me`} className={style["profile__content-btn"]}>
                  Tahrirlash
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;
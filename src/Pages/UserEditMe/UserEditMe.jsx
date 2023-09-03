import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import style from './userEditMe.module.scss';
import Loader from './../../Components/Loader';

const UserEditMe = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ first_name: "", last_name: "", age: "", username: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        let { data } = await axios.get(`/users/me`);
        let user = data.data
        setValues({ first_name: user.first_name, last_name: user.last_name, age: user.age, username: user.username });
        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    };
    getUser();
  }, []);

  async function handleEditMe(e) {
    e.preventDefault();
    if (values.first_name.length < 3) return toast("Ism uzunligi 3 ta belgidan kam", { type: "error" });

    if (values.last_name.length < 3) return toast("Familiya uzunligi 3 ta belgidan kam", { type: "error" });

    if (values.username.length < 3) return toast("Usename uzunligi 3 ta belgidan kam", { type: "error" });

    try {
      let { data } = await axios.patch(`/users/me`, values);

      toast("Shaxsiy ma'lumotlar tahrirlandi", { type: "success" });
      navigate(-1);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  function handleInputChange(e) {
    setValues(ov => ({ ...ov, [e.target.name]: e.target.value }));
  };

  const info = `
    Ism - minimum 3 ta belgi,
    Familiya - minimum 3 ta belgi,
    Username - minimum 3 ta belgi.
  `;

  function back() {
    navigate(-1);
  };

  return (
    loading
      ? <Loader />
      : <div className={style["userEdit"]}>
        <div className="container">
          <div className={style["userEdit__content"]}>

            <div className={style["userEdit__content-backBtn"]}>
              <button onClick={back} className={style["userEdit__content-back"]}>Ortga qaytish</button>
            </div>


            <form onSubmit={handleEditMe} className={style["userEdit__content-form"]}>

              <h1 className={style["userEdit__content-title"]}>
                Shaxsiy ma'lumotlarni tahrirlash <abbr className={style["userEdit__content-abbr"]} title={info}>
                  <i className="fa-solid fa-circle-info"></i>
                </abbr>
              </h1>

              <div className={style["userEdit__content-row"]}>

                <div className={style["userEdit__content-inputs"]}>
                  <label
                    htmlFor="first_name"
                    className={style["userEdit__content-label"]}
                  >
                    Ism
                  </label>

                  <input
                    type="text"
                    id='first_name'
                    name='first_name'
                    value={values.first_name}
                    onChange={handleInputChange}
                    className={style["userEdit__content-input"]}
                  />
                </div>

                <div className={style["userEdit__content-inputs"]}>
                  <label
                    htmlFor="last_name"
                    className={style["userEdit__content-label"]}
                  >
                    Familiya
                  </label>

                  <input
                    type="text"
                    id='last_name'
                    name='last_name'
                    value={values.last_name}
                    onChange={handleInputChange}
                    className={style["userEdit__content-input"]}
                  />
                </div>

                <div className={style["userEdit__content-inputs"]}>
                  <label
                    htmlFor="age"
                    className={style["userEdit__content-label"]}
                  >
                    Yosh
                  </label>

                  <input
                    type="number"
                    id='age'
                    name='age'
                    value={values.age}
                    onChange={handleInputChange}
                    className={style["userEdit__content-input"]}
                  />
                </div>

                <div className={style["userEdit__content-inputs"]}>
                  <label
                    htmlFor="username"
                    className={style["userEdit__content-label"]}
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    id='username'
                    name='username'
                    value={values.username}
                    onChange={handleInputChange}
                    className={style["userEdit__content-input"]}
                  />
                </div>
              </div>

              <div className={style["userEdit__content-buttons"]}>

                <button type='submit' className={style["userEdit__content-btn"]} >
                  Tahrirlash
                </button>

              </div>

            </form>
          </div>
        </div>
      </div>
  );
};

export default UserEditMe;
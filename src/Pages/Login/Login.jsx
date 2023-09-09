import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import style from './login.module.scss';
import Loader from '../../Components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) navigate("/");

    setLoading(false);
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    if (!values.username) return toast("Username kiritilmagan", { type: "error" });
    if (!values.password) return toast("Password kiritilmagan", { type: "error" });
    if (values.username.length < 3) return toast("Usename uzunligi 3 ta belgidan kam", { type: "error" });
    if (values.password.length < 4) return toast("Password uzunligi 4 ta belgidan kam", { type: "error" });

    try {
      let { data } = await axios.post("/users/login", values);

      let { token } = data.data;

      if (!token) return toast("Serverda xatolik. Iltimos, bu xato haqida dasturchilarga xabar bering", { type: "error" });

      localStorage.setItem("token", token);

      axios.defaults.headers.common["Authorization"] = token;
      // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let user = await axios.get("/users/me");

      localStorage.setItem("role", user.data.data.role);

      toast("Profilga kirildi", { type: "success" });
      navigate("/");
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  function handleInputChange(e) {
    setValues(ov => ({ ...ov, [e.target.name]: e.target.value }));
  };

  const info = `
  Username - minimum 3 ta belgi,
  Password - minimum 4 ta belgi.
  `;

  return (
    loading
      ? <Loader />
      : <div className={style["login"]}>
        <div className="container">
          <div className={style["login__content"]}>

            <form onSubmit={handleLogin} className={style["login__content-form"]}>
              <h1 className={style["login__content-title"]}>
                Profilga kirish
                <abbr className={style["login__content-abbr"]} title={info}>
                  <i className="fa-solid fa-circle-info"></i>
                </abbr>
              </h1>

              <div className={style["login__content-row"]}>
                <div className={style["login__content-inputs"]}>
                  <label
                    htmlFor="username"
                    className={style["login__content-label"]}
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    id='username'
                    name='username'
                    value={values.username}
                    onChange={handleInputChange}
                    className={style["login__content-input"]}
                  />
                </div>

                <div className={style["login__content-inputs"]}>
                  <label
                    htmlFor="password"
                    className={style["login__content-label"]}
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    id='password'
                    name='password'
                    value={values.password}
                    onChange={handleInputChange}
                    className={style["login__content-input"]}
                  />
                </div>
              </div>

              <div className={style["login__content-buttons"]}>
                <button type='submit' className={style["login__content-btn"]} >
                  Kirish
                </button>
              </div>
            </form>
            
          </div>
        </div>
      </div>
  );
};

export default Login;
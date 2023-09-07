import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import style from './userAdd.module.scss';
import Loader from '../../Components/Loader';

const UserAdd = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [values, setValues] = useState({ first_name: "", last_name: "", age: "", role: "employee", username: "", password: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "warning" });
      navigate("/");
      return;
    };

    setLoading(false);
  }, []);

  async function handleRegister(e) {
    e.preventDefault();

    if (!values.first_name) return toast("Ism kiritilmagan", { type: "error" });
    if (!values.last_name) return toast("Familiya kiritilmagan", { type: "error" });
    if (!values.age) return toast("Yosh kiritilmagan", { type: "error" });
    if (!values.username) return toast("Username kiritilmagan", { type: "error" });
    if (!values.password) return toast("Password kiritilmagan", { type: "error" });
    if (values.first_name.length < 3) return toast("Ism uzunligi 3 ta belgidan kam", { type: "error" });
    if (values.last_name.length < 3) return toast("Familiya uzunligi 3 ta belgidan kam", { type: "error" });
    if (values.username.length < 3) return toast("Usename uzunligi 3 ta belgidan kam", { type: "error" });
    if (values.password.length < 4) return toast("Password uzunligi 4 ta belgidan kam", { type: "error" });

    try {
      let { data } = await axios.post("/users", values);

      toast("Foydalanuvchi ro'yxatdan o'tkazildi", { type: "success" });
      navigate("/users");
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  function handleInputChange(e) {
    setValues(ov => ({ ...ov, [e.target.name]: e.target.value }));
  };

  function handleCheck(e) {
    if (values.role === "employee") {
      setValues(ov => ({ ...ov, role: "admin" }));
    } else if (values.role === "admin") {
      setValues(ov => ({ ...ov, role: "employee" }));
    };
  };

  const info = `
    Ism - minimum 3 ta belgi,
    Familiya - minimum 3 ta belgi,
    Username - minimum 3 ta belgi,
    Password - minimum 4 ta belgi.
  `;

  function back() {
    navigate(-1);
  };

  return (
    loading
      ? <Loader />
      : <div className={style["userAdd"]}>
        <div className="container">
          <div className={style["userAdd__content"]}>

            <div className={style["userAdd__content-backBtn"]}>
              <button onClick={back} className={style["userAdd__content-back"]}>Ortga qaytish</button>
            </div>

            <form onSubmit={handleRegister} className={style["userAdd__content-form"]}>
              <h1 className={style["userAdd__content-title"]}>
                Ro'yxatdan o'tkazish <abbr className={style["userAdd__content-abbr"]} title={info}>
                  <i className="fa-solid fa-circle-info"></i>
                </abbr>
              </h1>

              <div className={style["userAdd__content-row"]}>
                <div className={style["userAdd__content-fullName"]}>
                  <div className={style["userAdd__content-inputs"]}>
                    <label htmlFor="first_name" className={style["userAdd__content-label"]}>
                      Ism
                    </label>

                    <input
                      type="text"
                      id='first_name'
                      name='first_name'
                      value={values.first_name}
                      onChange={handleInputChange}
                      className={style["userAdd__content-input"]}
                    />
                  </div>

                  <div className={style["userAdd__content-inputs"]}>
                    <label htmlFor="last_name" className={style["userAdd__content-label"]}>
                      Familiya
                    </label>

                    <input
                      type="text"
                      id='last_name'
                      name='last_name'
                      value={values.last_name}
                      onChange={handleInputChange}
                      className={style["userAdd__content-input"]}
                    />
                  </div>
                </div>

                <div className={style["userAdd__content-inputs"]}>
                  <label htmlFor="age" className={style["userAdd__content-label"]}>
                    Yosh
                  </label>

                  <input
                    type="number"
                    id='age'
                    name='age'
                    value={values.age}
                    onChange={handleInputChange}
                    className={style["userAdd__content-input"]}
                  />
                </div>

                <div className={style["userAdd__content-inputs"]}>
                  <label htmlFor="username" className={style["userAdd__content-label"]}>
                    Username
                  </label>

                  <input
                    type="text"
                    id='username'
                    name='username'
                    value={values.username}
                    onChange={handleInputChange}
                    className={style["userAdd__content-input"]}
                  />
                </div>

                <div className={style["userAdd__content-inputs"]}>
                  <label htmlFor="password" className={style["userAdd__content-label"]}>
                    Password
                  </label>

                  <input
                    type="password"
                    id='password'
                    name='password'
                    value={values.password}
                    onChange={handleInputChange}
                    className={style["userAdd__content-input"]}
                  />
                </div>
              </div>

              <div className={style["userAdd__content-buttons"]}>
                <div className={style["userAdd__content-checkbox"]}>
                  <label htmlFor="role" className={style["userAdd__content-label"]}>
                    Admin
                  </label>

                  <input
                    type="checkbox"
                    id='role'
                    name='role'
                    value={values.role}
                    onChange={handleCheck}
                    className={style["userAdd__content-check"]}
                  />
                </div>

                <button type='submit' className={style["userAdd__content-btn"]} >
                  Ro'xatdan o'tkazish
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default UserAdd;
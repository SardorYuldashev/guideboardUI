import style from './userEditPassword.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const UserPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  let role = localStorage.getItem("role");
  const [values, setValues] = useState({ password: "", confirm: "" });

  useEffect(() => {
    if (!token) {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "warning" });
      navigate(-1);
    };

    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "warning" });
      navigate(-1);
    };
  }, []);

  function handleInputChange(e) {
    setValues(ov => ({ ...ov, [e.target.name]: e.target.value }));
  };

  async function editPassword(e) {
    e.preventDefault();

    if (!values.password) return toast("Password kiritilmagan", { type: "error" });

    if (!values.confirm) return toast("Password taskrorlanmagan", { type: "error" });

    if (values.password.length < 4) return toast("Password uzunligi 4 ta belgidan kam", { type: "error" });

    if (values.confirm.length < 4) return toast("Password va confirm bir xil emas", { type: "error" });

    if (values.password !== values.confirm) return toast("Password va confirm bir xil emas", { type: "error" });

    try {
      let { data } = await axios.patch(`/users/${id}`, { password: values.password });
      if (!data) {
        toast("Serverda xatolik", { type: "error" });
        navigate(-1);
        return;
      };

      toast("Parol o'zgartirildi", { type: "success" });
      navigate(-1);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  const info = `Password - minimum 4 ta belgi.`;

  function back() {
    navigate(-1);
  };

  return (
    <div className={style["userPassword"]}>
      <div className="container">
        <div className={style["userPassword__content"]}>

          <div className={style["userPassword__content-backBtn"]}>
            <button onClick={back} className={style["userPassword__content-back"]}>Ortga qaytish</button>
          </div>


          <form onSubmit={editPassword} className={style["userPassword__content-form"]}>

            <h1 className={style["userPassword__content-title"]}>
              Passwordni almashtirish
              <abbr className={style["userPassword__content-abbr"]} title={info}>
                <i className="fa-solid fa-circle-info"></i>
              </abbr>
            </h1>

            <div className={style["userPassword__content-row"]}>

              <div className={style["userPassword__content-inputs"]}>
                <label
                  htmlFor="password"
                  className={style["userPassword__content-label"]}
                >
                  Yangi parol
                </label>

                <input
                  type="password"
                  id='password'
                  name='password'
                  value={values.password}
                  onChange={handleInputChange}
                  className={style["userPassword__content-input"]}
                />
              </div>

              <div className={style["userPassword__content-inputs"]}>
                <label
                  htmlFor="confirm"
                  className={style["userPassword__content-label"]}
                >
                  Parolni takrorlang
                </label>

                <input
                  type="password"
                  id='confirm'
                  name='confirm'
                  value={values.confirm}
                  onChange={handleInputChange}
                  className={style["userPassword__content-input"]}
                />
              </div>

            </div>

            <div className={style["userPassword__content-buttons"]}>
              <button type='submit' className={style["userPassword__content-btn"]} >
                Saqlash
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPassword;
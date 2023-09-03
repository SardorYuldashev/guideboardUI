import style from './guideAdd.module.scss'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';

const GuideAdd = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [values, setValues] = useState({ title: "", content: "", notify: false })

  useEffect(() => {
    if (!token) {
      toast("Profilga kirmagansiz", { type: "error" });
      navigate("/home");
    }
    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "error" });
      navigate("/");
    };
  });

  function back() {
    navigate(-1);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!values.title) return toast("Sarlavha kiritilmagan", { type: "error" });

    if (!values.content) return toast("Qoida matni kiritilmagan", { type: "error" });

    if (values.title.length < 3) return toast("Sarlavha uzunligi 3 ta belgidan kam", { type: "error" });

    if (values.content.length < 3) return toast("Qoida matni uzunligi 3 ta belgidan kam", { type: "error" });

    try {
      let { data } = await axios.post("/guides", values);

      toast("Yangi qoida qo'shildi", { type: "success" });
      setValues({ title: "", content: "", notify: false });
      navigate("/");
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  function handleCheck(e) {
    if (values.notify === false) {
      setValues(ov => ({ ...ov, notify: true }));
    } else if (values.notify === true) {
      setValues(ov => ({ ...ov, notify: false }));
    };
  };

  function handleInputChange(e) {
    setValues(ov => ({ ...ov, [e.target.name]: e.target.value }));
  };

  const info = `
  Sarlavha - minimum 3 ta belgi,
  Matn - minimum 3 ta belgi,
  `;

  return (
    <div className={style["addGuide"]}>
      <div className="container">
        <div className={style["addGuide__content"]}>

          <div className={style["addGuide__content-backBtn"]}>
            <button onClick={back} className={style["addGuide__content-btn"]}>Ortga qaytish</button>
          </div>

          <form onSubmit={handleSubmit} className={style["addGuide__content-form"]}>

            <h1 className={style["addGuide__content-title"]}>
              Qoida qo'shish <abbr className={style["addGuide__content-abbr"]} title={info}>
                <i className="fa-solid fa-circle-info"></i>
              </abbr>
            </h1>

            <div className={style["addGuide__content-row"]}>

              <div className={style["addGuide__content-inputs"]}>
                <label
                  htmlFor="title"
                  className={style["addGuide__content-label"]}
                >
                  Sarlavha
                </label>

                <input
                  type="text"
                  id='title'
                  name='title'
                  value={values.title}
                  onChange={handleInputChange}
                  className={style["addGuide__content-input"]}
                />
              </div>

              <div className={style["addGuide__content-inputs"]}>
                <label
                  htmlFor="content"
                  className={style["addGuide__content-label"]}
                >
                  Qoida matni
                </label>

                <textarea
                  type="content"
                  id='content'
                  name='content'
                  value={values.content}
                  onChange={handleInputChange}
                  className={style["addGuide__content-input"]}
                  cols="30"
                  rows="5">

                </textarea>
              </div>

            </div>

            <div className={style["addGuide__content-buttons"]}>

              <div className={style["addGuide__content-checkbox"]}>
                <label
                  htmlFor="notify"
                  className={style["addGuide__content-label"]}
                >
                  Hammaga jo'natish
                </label>

                <input
                  type="checkbox"
                  id='notify'
                  name='notify'
                  value={true}
                  onChange={handleCheck}
                  className={style["addGuide__content-check"]}
                />
              </div>

              <button type='submit' className={style["addGuide__content-btn"]} >
                Jo'natish
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default GuideAdd;
import style from './guideEdit.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './../../Components/Loader';
import { useDispatch } from 'react-redux';
import { loadRefreshData } from '../../Store/slices/refresh';

const GuideEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const role = localStorage.getItem("role");
  const [values, setValues] = useState({ title: "", content: "", notify: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      toast("Sizda bu yo'lga kirishga ruxsat yo'q", { type: "warning" });
      navigate("/");
      return;
    };

    async function getGuide() {
      try {
        setLoading(true);
        let { data } = await axios.get(`/guides/${id}`);

        setValues({ title: data.data.title, content: data.data.content, notify: false });
        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    };
    getGuide();
  }, []);

  function back() {
    navigate(-1);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (values.title.length < 3) return toast("Sarlavha uzunligi 3 ta belgidan kam", { type: "error" });

    if (values.content.length < 3) return toast("Qoida matni uzunligi 3 ta belgidan kam", { type: "error" });

    try {
      let { data } = await axios.patch(`/guides/${id}`, values);

      toast("Qoida tahrirlandi", { type: "success" });
      setValues({ title: "", content: "", notify: false });
      dispatch(loadRefreshData(true));
      navigate(-1);
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
    loading
      ? <Loader />
      : <div className={style["editGuide"]}>
        <div className="container">
          <div className={style["editGuide__content"]}>

            <div className={style["editGuide__content-backBtn"]}>
              <button onClick={back} className={style["editGuide__content-btn"]}>Ortga qaytish</button>
            </div>

            <form onSubmit={handleSubmit} className={style["editGuide__content-form"]}>

              <h1 className={style["editGuide__content-title"]}>
                Qoidani tahrirlash <abbr className={style["editGuide__content-abbr"]} title={info}>
                  <i className="fa-solid fa-circle-info"></i>
                </abbr>
              </h1>

              <div className={style["editGuide__content-row"]}>

                <div className={style["editGuide__content-inputs"]}>
                  <label
                    htmlFor="title"
                    className={style["editGuide__content-label"]}
                  >
                    Sarlavha
                  </label>

                  <input
                    type="text"
                    id='title'
                    name='title'
                    value={values.title}
                    onChange={handleInputChange}
                    className={style["editGuide__content-input"]}
                  />
                </div>

                <div className={style["editGuide__content-inputs"]}>
                  <label
                    htmlFor="content"
                    className={style["editGuide__content-label"]}
                  >
                    Qoida matni
                  </label>

                  <textarea
                    type="content"
                    id='content'
                    name='content'
                    value={values.content}
                    onChange={handleInputChange}
                    className={style["editGuide__content-input"]}
                    cols="30"
                    rows="5">

                  </textarea>
                </div>

              </div>

              <div className={style["editGuide__content-buttons"]}>

                <div className={style["editGuide__content-checkbox"]}>
                  <label
                    htmlFor="notify"
                    className={style["editGuide__content-label"]}
                  >
                    Hammaga jo'natish
                  </label>

                  <input
                    type="checkbox"
                    id='notify'
                    name='notify'
                    value={true}
                    onChange={handleCheck}
                    className={style["editGuide__content-check"]}
                  />
                </div>

                <button type='submit' className={style["editGuide__content-btn"]} >
                  Tahrirlash
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
  );
};

export default GuideEdit;
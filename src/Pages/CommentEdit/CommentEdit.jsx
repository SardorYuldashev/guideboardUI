import style from './commentEdit.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './../../Components/Loader';

const CommentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({ content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getGuide() {
      try {
        let { data } = await axios.get(`/comments/${id}`);
        setValues({ content: data.data.content });

        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        navigate("/");
      };
    };
    getGuide();
  }, []);

  function back() {
    navigate(-1);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (values.content.length < 1) return toast("Sharh uzunligi 1 ta belgidan kam", { type: "error" });

    try {
      await axios.patch(`/comments/${id}`, values);

      toast("Sharh tahrirlandi", { type: "success" });
      navigate(-1);
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
      navigate("/");
    };
  };

  function handleInputChange(e) {
    setValues(ov => ({ ...ov, [e.target.name]: e.target.value }));
  };

  return (
    loading
      ? <Loader />
      : <div className={style["editComment"]}>
        <div className="container">
          <div className={style["editComment__content"]}>

            <div className={style["editComment__content-backBtn"]}>
              <button onClick={back} className={style["editComment__content-btn"]}>Ortga qaytish</button>
            </div>

            <form onSubmit={handleSubmit} className={style["editComment__content-form"]}>
              <h1 className={style["editComment__content-title"]}>
                Sharhni tahrirlash
              </h1>

              <div className={style["editComment__content-row"]}>
                <div className={style["editComment__content-inputs"]}>
                  <input
                    type="content"
                    id='content'
                    name='content'
                    value={values.content}
                    onChange={handleInputChange}
                    className={style["editComment__content-input"]}
                  />
                </div>
              </div>

              <div className={style["editComment__content-buttons"]}>
                <button type='submit' className={style["editComment__content-btn"]} >
                  Tahrirlash
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
  );
};

export default CommentEdit;
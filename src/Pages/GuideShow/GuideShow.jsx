import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import style from './guideShow.module.scss';
import Loader from '../../Components/Loader';
import Comments from '../../Components/Comments';

const GuideShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [guide, setGuide] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function showGuide() {
      try {
        let { data } = await axios.get(`/guides/${id}`);
        setGuide(data.data);

        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
        navigate("/");
      };
    };
    showGuide();
  }, []);

  function back() {
    navigate(-1);
  };

  async function deleteGuide() {
    let question = confirm("Rostdan ham qoidani o'chirmoqchimisiz?");
    if (!question) {
      return;
    };

    try {
      setLoading(true);
      let { data } = await axios.delete(`/guides/${id}`);

      toast("Qoida o'chirildi", { type: "success" });
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
      navigate("/");
    };
  };

  return (
    loading
      ? <Loader />
      : <div className={style["guideShow"]}>
        <div className="container">
          <div className={style["guideShow__content"]}>

            <div className={style["guideShow__content-buttons"]}>
              <button onClick={back} className={style["guideShow__content-btn"]}>
                Ortga qaytish
              </button>

              {
                role === "admin"
                  ? <div className={style["guideShow__content-tools"]}>

                    <Link to={`/guides/edit/${id}`} className={style["guideShow__content-tool"]}>
                      <i className="fa-solid fa-pen"></i>
                    </Link>

                    <Link to={`/tasks/add/${id}`} className={style["guideShow__content-tool"]}>
                      <i className="fa-solid fa-share-nodes"></i>
                    </Link>

                    <button onClick={deleteGuide} className={style["guideShow__content-tool"]}>
                      <i className="fa-solid fa-trash"></i>
                    </button>

                  </div>
                  : <div></div>
              }
            </div>

            <p className={style["guideShow__content-revisons"]}>
              <span>
                <i className="fa-solid fa-share-nodes"></i>
                {guide.revisions}
              </span> marta yuborilgan
            </p>

            <h1 className={style["guideShow__content-title"]}>
              {guide.title}
            </h1>

            <p className={style["guideShow__content-text"]}>
              {guide.content}
            </p>

            <Comments guide_id={+id} />

          </div>
        </div>
      </div>
  );
};

export default GuideShow;
import { useEffect, useState } from 'react';
import style from './home.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader';
import Modal from '../../Components/Modal';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) navigate("/");

    setLoading(false);
  }, [navigate]);

  return (
    loading
      ? <Loader />
      : <div className={style["home"]}>
        <Modal />

        <div className="container">
          <div className={style["home__content"]}>

            <div className={style["home__content-main"]}>
              <h1 className={style["home__content-title"]}>
                <span>Guide</span> Board
              </h1>

              <p className={style["home__content-text"]}>
                <span>Bu yerda</span> tashkilotimizda faoliyat olib borishingiz davomida amal qilishingiz kerak bo'ladigan <span>qoidalar</span> jamlangan. Undan tashqari yangi kiritilgan qoidalar ham shu yerga <span>joylab boriladi</span>. Qoidalar bilan tanishib chiqish uchun profilingizga kirishingiz kifoya.
              </p>

              <Link to="/login" className={style["home__content-btn"]}>Profilga kirish</Link>

              <div className={style["home__content-mark"]}>
                <p>
                  * Agar profilingiz mavjud bo'lmasa, <br /> administratsiyaga murojat qiling.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Home;
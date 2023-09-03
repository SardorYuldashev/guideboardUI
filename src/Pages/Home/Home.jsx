import { useEffect } from 'react';
import style from './home.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className={style["home"]}>
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
  )
}

export default Home
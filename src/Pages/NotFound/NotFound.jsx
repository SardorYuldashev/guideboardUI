import { useNavigate } from 'react-router-dom';
import style from './notFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  function back() {
    navigate("/");
  };

  return (
    <div className={style["notFound"]}>
      <div className="container">
        <div className={style["notFound__content"]}>

          <h1 className={style["notFound__content-title"]}>
            Bunday sahifa mavjud emas!
          </h1>

          <div className={style["notFound__content-backBtn"]}>
            <button onClick={back} className={style["notFound__content-back"]}>
              Bosh sahifa
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;
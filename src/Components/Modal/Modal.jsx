import { useState } from 'react';
import style from './modal.module.scss';

const Modal = () => {
  const [closed, setClosed] = useState(false);

  function close() {
    setClosed(true);
  };

  return (closed
    ? <div></div>
    : <div className={style["modal"]}>
      <div className={style["modal__content"]}>
        <h2 className={style["modal__content-title"]}>
          DIQQAT
        </h2>

        <p className={style["modal__content-text"]}>
          Loyihada foydalanuvchilarni faqat tashkilot adminlardan ro'yxatdan o'tkazishadi.
          <br />
          Shu sababli foydalanuvchini o'zi ro'yxatdan o'tishi tadbiq qilinmagan.
          <br />
          <br />
          Bu sizning loyiha bilan tanishishingizga to'siq bo'lmasligi uchun,
          <br />
          quyidagi profillardan foydalanishingiz mumkin:
        </p>

        <p className={style["modal__content-profile"]}>
          Admin: [username: <span>"admin"</span>, password: <span>"admin"</span> ]
        </p>

        <p className={style["modal__content-profile"]}>
          User: [username: <span>"user"</span>, password: <span>"user"</span> ]
        </p>

        <div className={style["modal__content-button"]}>
          <button onClick={close}>TUSHUNARLI</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
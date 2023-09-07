import style from './loader.module.scss';

const Loader = () => {
  return (
    <div className={style["loader"]}>
      <h2  className={style["loader-title"]}>Loading. <br /> Please waiting</h2>
      <div className={style["loader_spinner"]}></div>
    </div>
  );
};

export default Loader;
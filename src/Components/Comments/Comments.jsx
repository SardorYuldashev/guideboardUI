import { useEffect, useState } from 'react';
import style from './comments.module.scss';
import user from '../../assets/images/user_avatar.webp'
import admin from '../../assets/images/admin_avatar.webp'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Comments = (guide_id) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');
  const user_id = localStorage.getItem('id');
  const [values, setValues] = useState({ content: "" });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getComments() {
      try {
        const { data } = await axios.get(`/comments/guide/${guide_id.guide_id}`);

        setComments(data.data);
        setLoading(false);
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      };
    }
    getComments();
  }, [refresh]);

  function handleInputChange(e) {
    setValues(ov => ({ ...ov, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (values.content.length < 1) {
      toast("Sharh kiritilmagan", { type: "error" });
      return;
    };

    try {
      await axios.post('/comments', { ...guide_id, ...values });

      setValues({ content: "" });
      setRefresh(!refresh)
    } catch (error) {
      toast(error.response.data.error, { type: "error" });
    };
  };

  async function deleteCommit(id) {
    let question = confirm("Rostdan ham sharhni o'chirmoqchimisiz?");
    if (!question) {
      return;
    };

    try {
      await axios.delete(`/comments/${id}`);

      toast("Sharh o'chirildi", { type: "success" });
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.error, { type: "warning" });
      setRefresh(!refresh);
    };
  };

  return (
    loading
      ? <div></div>
      : <div className={style["comments"]}>
        <div className="container">
          <div className={style["comments__content"]}>

            <h2 className={style["comments__content-title"]}>
              Sharhlar
            </h2>

            <form onSubmit={handleSubmit} className={style["comments__content-form"]}>
              <input
                type="text"
                name="content"
                value={values.content}
                onChange={handleInputChange}
                placeholder='Sharhni kiritng'
              />

              <button type='submit'>
                Yuborish
              </button>
            </form>

            <div className={style["comments__content-commentBox"]}>
              {
                comments.length === 0
                  ? <div className={style["comments__content-noComment"]}>
                    Sharhlar mavjud emas
                  </div>
                  : comments.map(item => (
                    <div key={item.id} className={style["comments__content-comment"]}>

                      <div className={style["comments__content-left"]}>
                        <div className={style["comments__content-imgBox"]}>
                          {
                            item.user.role === "admin"
                              ? <img src={admin} alt="" className={style["comments__content-img"]} />
                              : <img src={user} alt="" className={style["comments__content-img"]} />
                          }
                        </div>

                        <div className={style["comments__content-body"]}>
                          {
                            item.user.role === "admin"
                              ? <p className={style["comments__content-user"]}>
                                {item.user.first_name} {item.user.last_name} <span>{item.user.role}</span>
                              </p>
                              : <p className={style["comments__content-user"]}>
                                {item.user.first_name} {item.user.last_name}
                              </p>
                          }

                          <p className={style["comments__content-text"]}>
                            {item.content}
                          </p>
                        </div>
                      </div>

                      {
                        item.user.id === +user_id
                          ? <div className={style["comments__content-right"]}>
                            <Link to={`/comment/${item.id}`} className={style["comments__content-tool"]}>
                              <i className="fa-solid fa-pen"></i>
                            </Link>

                            <button onClick={() => deleteCommit(item.id)} className={style["comments__content-tool"]}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                          : item.user_id !== user_id && role === "admin"
                            ? <div className={style["comments__content-right"]}>
                              <button onClick={() => deleteCommit(item.id)} className={style["comments__content-tool"]}>
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                            : <div></div>
                      }

                    </div>
                  ))
              }
            </div>

          </div>
        </div>
      </div>
  );
};

export default Comments;
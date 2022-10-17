const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const link = process.env.JSON_SRV;

const doRequest = async (method, url, body = "") => {
  return await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body !== "" ? body : null,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

const addUser = async (uid, login) => {
  return await doRequest(
    "post",
    `${link}users`,
    JSON.stringify({ login, id: uid })
  )
    .then((res) => {
      return {
        status: "ok",
        text: `Пользователь ${login}(${uid}) зарегистрирован`,
      };
    })
    .catch((err) => {
      return { status: "err", text: `Ошибка в выполнении запроса` };
    });
};

const removeUser = async (uid) => {
  return await doRequest("delete", `${link}users/${uid}`)
    .then((res) => {
      return {
        status: "ok",
        text: `Пользователь (${uid}) удалён`,
      };
    })
    .catch((err) => {
      return { status: "err", text: `Ошибка в выполнении запроса` };
    });
};

const getLogged = async () => {
  return await doRequest("get", `${link}users`)
    .then((res) => {
      return res.text();
    })
    .catch(() => {
      return { status: "err", text: `Ошибка в выполнении запроса` };
    });
};

const saveMessage = async (login, message, uid) => {
  return await doRequest(
    "post",
    `${link}messages`,
    JSON.stringify({ login, message, uid })
  )
    .then((res) => {
      return {
        status: "ok",
        text: `Сообщение отправлено`,
      };
    })
    .catch(() => {
      return { status: "err", text: `Ошибка в выполнении запроса` };
    });
};

const getMessages = async () => {
  return await doRequest("get", `${link}messages`)
    .then((res) => {
      return res.text();
    })
    .catch(() => {
      return { status: "err", text: `Ошибка в выполнении запроса` };
    });
};

module.exports = { addUser, removeUser, getLogged, saveMessage, getMessages };

const LocalStorage = {
  set(key, strOrObj) {
    if (typeof strOrObj === 'string') {
      localStorage.setItem(key, strOrObj);
    } else if (typeof strOrObj === 'object') {
      try {
        localStorage.setItem(key, JSON.stringify(strOrObj));
      } catch (e) {
        console.error(`Could not stringify!\r\n\r\n${e}`, strOrObj);
      }
    }
  },

  get(key) {
    return localStorage.getItem(key);
  },

  getJson(key) {
    let json = null;

    try {
      json = JSON.parse(this.get(key));
    } catch (e) {
      console.error(`Could not parse!\r\n\r\n${e}`, this.get(key));
    }

    return json;
  },

  rm(key) {
    localStorage.removeItem(key);
  },
};

export default LocalStorage;

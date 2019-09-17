import axios from "axios";
import Qs from 'qs'
export default function fetch(url, param) {

  param = Qs.stringify(param);
  return axios.post(url, param).then((res) => {
    return Promise.resolve(res.data);
  })
}

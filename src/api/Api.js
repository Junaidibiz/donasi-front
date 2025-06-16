//import axios
import axios from "axios";

const Api = axios.create({
  //set default endpoint API
  baseURL: "http://donasi-dm.test/api", // <-- Ganti dengan URL API backend Laravel Anda
});

export default Api;

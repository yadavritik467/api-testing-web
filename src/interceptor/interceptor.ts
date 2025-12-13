// import axios, { AxiosResponse } from "axios";
// import { toast } from "react-toastify";
// import { AppURl } from "../AppUrl";

// const axiosInstance = axios.create({
//   baseURL: AppURl,
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig<any>) => {
//     try {
//       const token = sessionStorage.getItem("token") as string;
//       if (token && config.headers) {
//         config.headers.Authorization = token ? `${token}` : "";
//       }
//     } catch (error) {
//       console.error("Error retrieving token from localStorage", error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse<any, any>) => {
//     const method = response?.config?.method?.toUpperCase(); // Get HTTP method
//     if (
//       method === "POST" ||
//       method === "DELETE" ||
//       method === "PUT" ||
//       method === "PATCH"
//     ) {
//       toast.success(response?.data?.message, { autoClose: 1000 });
//     }

//     return response;
//   },
//   (error) => {
//     if (error?.config?.url !== "/myProfile") {
//       toast.error(error?.response?.data?.message, { autoClose: 3000 });
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

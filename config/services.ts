import axios from "axios";
import { REACT_APP_BLOCKCHAIN_API_PROXY } from "./index";
import { getLocalStorageItem } from "../utils/localStorage";

// let abortController;

export const API_SEVICES = {
  GetRequest: (
    EndPoint: string,
    // Token: string,
    sucessCallback: any,
    errorCallback: any
  ) => {
    // const Token = getLocalStorageItem('token')
    try {
      axios
        .get(`${EndPoint}`, {
          headers: {
            Authorization: `${getLocalStorageItem("token")}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          // timeout: 5000,
        })
        .then((resp) => {
          sucessCallback && sucessCallback(resp);
        })
        .catch((err) => {
          errorCallback && errorCallback(err);
        });
    } catch (error) {
      console.log(error);

    }
  },
  PostRequest: (
    EndPoint: string,
    sucessCallback: any,
    errorCallback: any,
    values: any,
    contentType?: string,
    token?: any
  ) => {
    token = getLocalStorageItem("token");

    try {
      axios
        .post(EndPoint, values, {
          headers: {
            authorization: ` ${token}`,
            "Content-Type": contentType || "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((resp) => {
          sucessCallback && sucessCallback(resp);
        })
        .catch((err) => {
          errorCallback && errorCallback(err);
        });
    } catch (error) {
      console.log(error);

    }
  },


  DeleteRequest: (
    EndPoint: string,
    // Token: string,
    sucessCallback: any,
    errorCallback: any,
    values: any
  ) => {
    const Token = getLocalStorageItem("token");
    axios
      .delete(`${EndPoint}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: { ...values },

        // timeout: 5000,
      })
      .then((resp) => {
        // console.log("resp", resp);
        sucessCallback && sucessCallback(resp);
      })
      .catch((err) => {
        errorCallback && errorCallback(err);
      });
  },
  PutRequest: (
    EndPoint: string,
    // Token: string,
    sucessCallback: any,
    errorCallback: any,
    values: any
  ) => {
    const Token = getLocalStorageItem("token");

    axios
      .put(`${EndPoint}`, values, {
        headers: {
          authorization: ` ${Token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((resp) => {
        sucessCallback && sucessCallback(resp);
      })
      .catch((err) => {
        // console.log("error",err);
        errorCallback && errorCallback(err);
      });
  },

};

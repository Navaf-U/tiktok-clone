import axios from "axios";

const axiosErrorManager = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      return (
        err.response.data?.message ||
        `Error: ${err.response.status} - ${err.response.statusText}`
      );
    } else if (err.request) {
      return "No response received from server";
    } else {
      return `Error in making request: ${err.message}`;
    }
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return "An unexpected error occurred, please try again";
  }
};

export default axiosErrorManager;

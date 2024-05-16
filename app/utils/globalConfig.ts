import { create } from "apisauce";
import { API_BASE_URL } from "./constants";

export const api = create({ baseURL: "https://ap.ugcinc.ca/ems/public/api" });

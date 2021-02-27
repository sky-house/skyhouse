import {createContext} from "react";
import {RootStore} from "./store";

export const rootStore = new RootStore()
export const StoreContext = createContext(rootStore)

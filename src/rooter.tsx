import React, { Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Loading } from "./components/atoms";

const Home = lazy(() => import("./components/pages/Home"));
const Room = lazy(() => import("./components/pages/Room"));
const PageNotFound = lazy(() => import("./components/pages/PageNotFound"));
const Test = lazy(() => import("./components/pages/Test"));

export const Rooter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/room/:roomId" component={Room} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

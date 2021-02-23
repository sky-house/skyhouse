import React, { Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const Home = lazy(() => import("./components/pages/Home"));
const Room = lazy(() => import("./components/pages/Room"));
const Test = lazy(() => import("./components/pages/Test"));

export const Rooter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/room" component={Room} />
          <Route exact path="/room/:roomId" component={Test} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Main from './components/Main';
import NotFound from './components/NotFound';
import Update from './components/Update';


const App = () => {   
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/texts/:id" component={Update} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};


export default App;

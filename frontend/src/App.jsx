import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Main from './components/Main';
import NotFound from './components/NotFound';
import Details from './components/TextDetails';
import Repeater from './components/Repeater';


const App = () => {   
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/texts/:id" component={Details} />
        <Route path="/repetition" component={Repeater} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};


export default App;

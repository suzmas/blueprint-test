import React from 'react';

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

import './App.css';

import { Navigation } from "./Navbar/Navigation";
import { FormGroupExample } from "./Form/Form";

function App() {
  return (
    <div className="App">
      <Navigation />
      <div className="section">
        <FormGroupExample />
      </div>
    </div>
  );
}

export default App;

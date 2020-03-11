import React from 'react';

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import './App.css';

import { Navigation } from "./Navigation";
import { Example } from "./Example";
import { FormGroupExample } from "./Form";

function App() {
  return (
    <div className="App">
      <Navigation />
      <div className="section">
        <Example header="Test out Blueprint" />
        <FormGroupExample />
      </div>
    </div>
  );
}

export default App;

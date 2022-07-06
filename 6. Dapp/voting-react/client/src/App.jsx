import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container-fluid">
          <Dashboard />
          <hr />
          <Demo />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;

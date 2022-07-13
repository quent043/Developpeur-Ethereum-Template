import {EthProvider} from "./contexts/EthContext";
import Dashboard from "./components/Dashboard";
import {ToastContainer} from "react-toastify";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';


function App() {
    return (
        <EthProvider>
            <ToastContainer />
            <Dashboard/>
        </EthProvider>
    );
}

export default App;

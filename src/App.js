import './App.css';
import Schedule from "./components/Schedule";


export default function App() {
  return (

    <div className="App">
      <h1 style={{ color: "blue" }}>RemitBee</h1>
      <h5>Manual / Automatic Scheduler in ReactJS</h5>
      <Schedule />
    </div>

  );
}

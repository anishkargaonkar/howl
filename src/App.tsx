import reactLogo from "./assets/react.svg";
import howlerLogo from "/howler.svg";
import "./App.css";
import { AudioMixer } from "./AudioMixer";

function App() {
  return (
    <>
      <div>
        <a href="https://howlerjs.com/" target="_blank">
          <img src={howlerLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Audio Mixer</h1>

      <div className="card">
        <AudioMixer />
      </div>
    </>
  );
}

export default App;

import "./App.css";
import TimeBar from "./components/TimeBar";
import Header from "./components/Header";
function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <TimeBar />
      </header>
    </div>
  );
}

export default App;

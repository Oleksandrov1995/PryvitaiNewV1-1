import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { MainDalleFirstImage } from './pages/MainDalleFirstImage/MainDalleFirstImage';
// import EditorWrapper from './components/Editor/EditorWrapper';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
               <Route path="/" element={<MainDalleFirstImage />} />
       
        </Routes>
      </div>
    </Router>
  );
}

export default App;

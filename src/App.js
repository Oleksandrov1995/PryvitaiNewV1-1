import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { MainDalleFirstImage } from './pages/MainDalleFirstImage/MainDalleFirstImage';
import Editor from './pages/Editor/Editor';
// import EditorWrapper from './components/Editor/EditorWrapper';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
               <Route path="/" element={<MainDalleFirstImage />} />
               <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

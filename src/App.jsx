import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HRUpload from "./pages/HRUpload";
import AllImages from "./pages/AllImages";
import Viewer from "./pages/Viewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />

        <Route path="/viewer" element={<Viewer />} />

        <Route path="/upload" element={<HRUpload />} />

        <Route path="/images" element={<AllImages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
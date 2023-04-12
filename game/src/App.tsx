import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Loading() {
  return <div>Loading</div>;
}

const Game = lazy(() => import("./pages/Game"));
const Admin = lazy(() => import("./pages/Admin"));
// const Admin = React.lazy(() => import("./pages/SuperAdmin"));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

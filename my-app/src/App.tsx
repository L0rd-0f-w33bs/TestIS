import { Route, Routes } from "react-router-dom";
import Home from "./home/page";
import Navbar from "./components/navbar";
import Search from "./search/page";
import DS from "./ds/page";
export default function App() {
  return (
    <Routes>
      <Route element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="ds" element={<DS />} />
      </Route>
    </Routes>
  );
}

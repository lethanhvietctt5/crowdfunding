import Banner from "./Banner";
import Footer from "./Footer";
import Header from "./Header";
import NotFound from "./NotFound";
import Project from "./Project";

const { Routes, Route, Navigate } = require("react-router-dom");

const Layout = ({ element }) => (
  <div className="flex flex-col justify-between w-full min-h-screen App">
    <div>
      <Header />
      {element}
    </div>
    <Footer />
  </div>
);

function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout element={<Banner />} />} />

      <Route path="/px/:addr" element={<Layout element={<Project />} />} />

      <Route path="404" element={<Layout element={<NotFound />} />} />
      <Route path="*" element={<Navigate to="404" />} />
    </Routes>
  );
}

export default MainRouter;

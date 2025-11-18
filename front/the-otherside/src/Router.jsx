import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import UpdatePost from "./pages/UpdatePost";
import Alien from "./pages/Alien";
import Conspiracion from "./pages/Conspiracion";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Home" element={<Home />}>
          {" "}
        </Route>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/NewPost" element={<NewPost />}></Route>
        <Route path="/Post/:id" element={<Post />}></Route>
        <Route path="/UpdatePost" element={<UpdatePost />}></Route>
        <Route path="/Alien" element={<Alien />}></Route>
        <Route path="/Conspiracion" element={<Conspiracion />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

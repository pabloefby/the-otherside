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
import Misterio from "./pages/Misterio";
import Brujeria from "./pages/Brujeria";
import Leyendas from "./pages/Leyendas";
import Creepypasta from "./pages/Creepypasta";
import Fantasma from "./pages/Fantasma";


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
        <Route path="/UpdatePost/:id" element={<UpdatePost />}></Route>
        <Route path="/Alien" element={<Alien />}></Route>
        <Route path="/Conspiracion" element={<Conspiracion />}></Route>
        <Route path="/Misterio" element={<Misterio />}></Route>
        <Route path="/Brujeria" element={<Brujeria />}></Route>
        <Route path="/Leyendas" element={<Leyendas />}></Route>
        <Route path="/Creepypasta" element={<Creepypasta />}></Route>
        <Route path="/Fantasma" element={<Fantasma />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

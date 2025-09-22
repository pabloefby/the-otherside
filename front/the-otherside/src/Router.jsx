import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";

function Router() {
    return (  

        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Register/>}></Route>
        </Routes>
        </BrowserRouter>


    );
}

export default Router;
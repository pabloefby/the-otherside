import { Navbar } from "../components/Navbar";
import { Navigate } from "react-router-dom";

function Home() {
  const user = localStorage.getItem("user");

  if(!user) 
    return  <Navigate to="/" replace /> 

  return (
      <div>
      <Navbar />
      <h1>Bienvenido al culto {user}</h1>
    </div>
    
    
  );
}

export default Home;

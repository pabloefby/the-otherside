import { Navbar } from "../components/Navbar";

function Home() {
  const user = localStorage.getItem("user");

  return (
    <div>
      <Navbar />
      <h1>Bienvenido al culto {user}</h1>
    </div>
  );
}

export default Home;

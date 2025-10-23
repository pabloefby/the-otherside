import styles from "./Profile.module.css";
import { Navbar } from "../components/Navbar";
import { Navigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";

function Profile() {
  const user = localStorage.getItem("user");

  return (
    <div className={styles.body}>
      <Navbar />
      <h1>hola prueba</h1>
    </div>
  );
}

export default Profile;

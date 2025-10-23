import styles from "./Profile.module.css";
import { Navbar } from "../components/Navbar";
import { PostPreview } from "../components/PostPreview";
import { Navigate } from "react-router-dom";
import skullIcon from "../assets/skullIcon.png";

function Profile() {
  const user = localStorage.getItem("user");

  return (
    <div className={styles.body}>
      <Navbar />
      
    </div>
  );
}

export default Profile;
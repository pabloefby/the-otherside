import styles from "./NewPost.module.css";
import { Navbar } from "../components/Navbar";

function NewPost() {
  return (
    <div className={styles.body}>
      <Navbar></Navbar>
      <div className={styles.newPost}></div>
    </div>
  );
}

export default NewPost;

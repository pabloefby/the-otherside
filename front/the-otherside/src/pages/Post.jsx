import styles from "./Post.module.css";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Post() {
  return (
    <div className={styles.body}>
      <Navbar />
    </div>
  );
}

export default Post;

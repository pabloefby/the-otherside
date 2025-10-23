import React from 'react'
import styles from "./NewPost.module.css";
import { Navbar } from '../components/Navbar';

export default function NewPost() {
  return (
    <div className={styles.body}>
    <Navbar></Navbar>
    <div className={styles.newPost}>
      
    </div>
    </div>
  )
}

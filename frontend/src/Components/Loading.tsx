import React from "react";
import styles from "./Loading.module.css";

export default function Loading(props: any) {
  return <div className={styles.loader} {...props}></div>;
}
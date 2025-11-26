import React, { useEffect } from "react";
import styles from "./Loader.module.css";
import Image from "next/image";

interface LoaderProps {
  loadingMessage?: string | null;
  isLoading?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loadingMessage, isLoading }) => {
  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <div className={isLoading ? styles.loaderActive : styles.loaderHidden}>
      <div className={styles.backdrop} />

      <div
        className={styles.imageWrapper}
      >
        <Image
          src="/logos/dmd-logo-vector.svg"
          alt="Loading"
          fill
          className={`${styles.image} ${styles.pulse}`}
        />
      </div>

      <p className={styles.loadingMsg}>{loadingMessage}</p>
    </div>
  );
};

export default Loader;

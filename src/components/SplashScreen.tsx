"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1700);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${visible ? "" : "splash-screen--hidden"}`} aria-hidden={!visible}>
      <div className="splash-screen__orb" />
      <div className="splash-screen__card">
        <span className="brand-mark brand-mark--large">卍</span>
        <h1>Manjiro Scripts</h1>
        <p>Carregando loja premium FiveM</p>
        <div className="splash-loader">
          <span />
        </div>
      </div>
    </div>
  );
}

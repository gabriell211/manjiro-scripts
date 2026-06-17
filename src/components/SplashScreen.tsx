"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
        <div className="brand-mark brand-mark--large" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/logo.png" alt="Manjiro Scripts" width={76} height={76} style={{ borderRadius: 24 }} />
        </div>
        <h1>Manjiro Scripts</h1>
        <p>Carregando loja premium FiveM</p>
        <div className="splash-loader">
          <span />
        </div>
      </div>
    </div>
  );
}

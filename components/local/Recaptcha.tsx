import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Recaptcha({
  captchaRef,
}: {
  captchaRef: React.RefObject<ReCAPTCHA>;
}) {
  return (
    <ReCAPTCHA
      ref={captchaRef}
      sitekey="6LdLiKAqAAAAAJnKW-kymFteqQkhxOHRyV08QuFB"
    />
  );
}

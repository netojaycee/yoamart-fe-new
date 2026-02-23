// hooks/useCaptcha.ts
import { useRef, useState } from "react";
import { ReCAPTCHA } from "react-google-recaptcha";

export const useCaptcha = () => {
    const captchaRef = useRef<ReCAPTCHA | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    // Function to get CAPTCHA token
    const getCaptchaToken = () => {
        const token = captchaRef.current?.getValue();
        if (token) {
            setCaptchaToken(token);
        }
        return token;
    };

    // Function to reset CAPTCHA
    const resetCaptcha = () => {
        captchaRef.current?.reset();
        setCaptchaToken(null);
    };

    return {
        captchaRef,
        captchaToken,
        getCaptchaToken,
        resetCaptcha,
    };
};

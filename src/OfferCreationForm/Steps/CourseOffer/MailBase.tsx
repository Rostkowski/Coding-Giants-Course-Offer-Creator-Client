import React from 'react';
import translations from "./translations";
interface IMailBase {
currentLanguage: string;
currentCountryCode: string;
mainContactDetails: { mainPhone: string; mainEmail: string };
}
const MailBase: React.FC<IMailBase> = (props) => {
  const currentTranslation = translations.find(
    (translation) => translation.language === props.currentLanguage
  );
  return (
    <div style={{ alignItems: "center", textAlign: "center" }}>
      <div style={{ textAlign: "center" }}>
        <img
          src="https://giganciprogramowania.edu.pl/images/szablon_gora_strony.png"
          style={{ width: "100%" }}
          alt=""
        ></img>
      </div>
      <p>{currentTranslation?.greeting}</p>
      <p>{currentTranslation?.afterGreetingSumUp}</p>
      <p>{props.mainContactDetails.mainEmail} | {props.mainContactDetails.mainPhone}</p>
    </div>
  );
};

export default MailBase;

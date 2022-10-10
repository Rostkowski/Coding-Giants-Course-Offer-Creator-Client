import translations from "./translations";

const MailBase = () => {
  const currentTranslation = translations.find(
    (translation) => translation.language === "en-US"
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
    </div>
  );
};

export default MailBase;

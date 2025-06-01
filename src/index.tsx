import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/survey.min.css"; // ✅ optional if you modified styles
import "./css/index.css"; // ✅ your custom styles
import "survey-react/survey.css"; // ✅ SurveyJS default theme for survey-react
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import surveyData from "./data/survey.json";
import contentData from "./data/content.json";
import { ReactQuestionFactory } from "survey-react";
import { CustomRadiogroup } from "./components/CustomRadioGroup";
import { initializeIcons } from "@fluentui/react/lib/Icons";

initializeIcons();

ReactQuestionFactory.Instance.registerQuestion("radiogroup", (props) => {
  return React.createElement(CustomRadiogroup, props);
});

ReactDOM.render(
  <React.StrictMode>
    <App surveyData={surveyData} contentData={contentData} />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();

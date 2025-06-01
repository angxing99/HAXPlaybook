import { SurveyQuestionRadiogroup } from "survey-react";
import * as React from "react";
import contentData from "../data/content.json";
import RadioDefinition from "./RadioDefinition";
import HelpButton from "./HelpButton";

export class CustomRadiogroup extends SurveyQuestionRadiogroup {
  protected getItems(cssClasses: any): Array<any> {
    const items = super.getItems(cssClasses, this.question.visibleChoices);
    const contentQuestion: any = contentData.questions.find(
      (q) => q.name === this.question.name
    );

    const renderedItems = this.question.visibleChoices.map((choice, index) => {
      const contentChoice = contentQuestion?.choices?.find(
        (cq: any) => cq.name === choice.value
      );

      // If no matching content found, return just the choice
      if (!contentChoice) return items[index];

      return (
        <div key={`${this.question.name}-${choice.value}`}>
          {items[index]}
          <HelpButton name={choice.text} examples={contentChoice.examples} />
          <RadioDefinition definition={String(contentChoice.definition)} />
        </div>
      );
    });

    return renderedItems;
  }
}

export default CustomRadiogroup;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useState } from "react";
import { SurveyModel, Survey } from "survey-react";
import Intro from "./components/Intro";
import TaskList from "./components/TaskList";
import CategoryTags from "./components/CategoryTags";
import { TaskCard } from "./models/Types";
import { SurveyValueChangedOptions } from "./models/SurveyCallbackTypes";
import GithubExportForm from "./components/GithubExportForm";
import ExportDialog from "./components/ExportDialog";
import LinkDialog from "./components/LinkDialog";
import {
  BsArrowCounterclockwise,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { saveAs } from "file-saver";
import { getCategorySectionId, isNullOrEmpty } from "./util/Utils";

interface AppProps {
  surveyData: any;
  contentData: any;
}

export let surveyModel: SurveyModel;
let isFirstRender = true;
let isDeserializing = false;
let autoscroll = true;

function createTaskMap(contentData: any) {
  if (!surveyModel) {
    console.warn("Survey model is not yet initialized.");
    return new Map();
  }

  const questions = surveyModel.getAllQuestions();
  const taskMap = new Map<string, TaskCard[]>();
  questions.forEach((q) => {
    const tc = TaskCard.fromQuestionChoice(q.name, q.value);
    if (tc != null) {
      const category: any = contentData.questions.find(
        (cq: any) => cq.name === q.name
      )?.category;
      let categoryTasks = taskMap.get(category);
      if (categoryTasks) {
        const filtered = categoryTasks.filter(
          (t: TaskCard) => t.question !== q.name
        );
        filtered.push(tc);
        categoryTasks = filtered;
      } else {
        categoryTasks = [tc];
      }
      taskMap.set(category, categoryTasks);
    }
  });
  return taskMap;
}

function isWideScreen() {
  return window.innerWidth > 425;
}

const App: React.FunctionComponent<AppProps> = ({
  surveyData,
  contentData,
}) => {
  const [showIntro, setShowIntro] = useState(true);
  const [isMobileLayout, setMobileLayout] = useState(!isWideScreen());

  const handleAfterRender = (sender: SurveyModel) => {
    surveyModel = sender;
  };

  const taskMap = createTaskMap(contentData);
  const instructionHeader = contentData.surveyInstructions?.title;
  const instructionsMsg = contentData.surveyInstructions?.message;
  const scenarioHeader = contentData.taskInstructions?.title;
  const scenarioMsg = contentData.taskInstructions?.message;
  const categories = Array.from(taskMap.keys());
  const highContrastBorder = "solid #ccc 1px";
  const numTasks =
    categories.length === 0
      ? 0
      : categories
          .map((category) => TaskCard.filterTasks(taskMap.get(category) ?? []))
          .flat()
          .map((card) => card.tasks)
          .map((tasks) => tasks.length)
          .reduce((prev, n) => prev + n);

  useEffect(() => {
    if (
      showIntro &&
      (!contentData.introduction || contentData.introduction.length === 0)
    ) {
      setShowIntro(false);
    }
  }, [showIntro, contentData]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobileLayout && isWideScreen()) {
        setMobileLayout(false);
      } else if (!isMobileLayout && !isWideScreen()) {
        setMobileLayout(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileLayout]);

  if (!surveyData || !contentData) {
    return <div>Error: Missing surveyData or contentData.</div>;
  }

  if (showIntro) {
    return (
      <div className="row justify-content-center">
        <Intro
          introduction={contentData.introduction}
          onStartClick={() => setShowIntro(false)}
        />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 border-end">
          <h2>{instructionHeader}</h2>
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{ __html: instructionsMsg }}
          />
          <Survey json={surveyData} onAfterRenderPage={handleAfterRender} />
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center">
            <h2>{scenarioHeader}</h2>
            <div>
              <span>Total scenarios:</span>
              <div
                className="badge bg-primary ms-2"
                style={{ border: highContrastBorder }}
              >
                {numTasks}
              </div>
            </div>
          </div>
          {scenarioMsg && (
            <div
              className="mb-3"
              dangerouslySetInnerHTML={{ __html: scenarioMsg }}
            />
          )}
          <CategoryTags
            taskMap={taskMap}
            onClick={(category) => {
              const el = document.getElementById(
                getCategorySectionId(category)
              );
              el?.scrollIntoView({ behavior: "smooth" });
              el?.focus();
            }}
            isHighContrast={false}
          />
          <TaskList taskMap={taskMap} isHighContrast={false} />
        </div>
      </div>
    </div>
  );
};

export default App;

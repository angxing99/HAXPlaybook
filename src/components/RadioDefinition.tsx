// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";

interface RadioDefinitionProps {
  definition: any; // allow object or string
}

const RadioDefinition: React.FunctionComponent<RadioDefinitionProps> = ({
  definition,
}) => {
  const safeHtml =
    typeof definition === "string"
      ? definition
      : JSON.stringify(definition, null, 2); // fallback to readable string

  return (
    <div className="radio-definition">
      <span
        className="light-text"
        aria-label="definition of survey choice"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  );
};

export default RadioDefinition;

export const AREA_MODULES = [
  "../content/areas/long-branch.js",
  "../content/areas/ravensworth.js",
  "../content/areas/west-springfield.js",
  "../content/areas/north-springfield.js",
  "../content/areas/burke-centre.js",
];

// Section ids each page must contain, mapped from the content structure in its prompt.
// Executive summary, metrics, FAQs and references are rendered by the shared component.
export const REQUIRED_SECTIONS = {
  "long-branch-va-real-estate": ["geography", "hydrology", "history", "housing", "structure", "schools", "transportation", "parks", "tax"],
  "ravensworth-va-real-estate": ["geography", "history", "housing", "structure", "schools", "transportation", "parks", "tax"],
  "west-springfield-va-real-estate": ["geography", "history", "housing", "structure", "schools", "transportation", "parks", "tax"],
  "north-springfield-va-real-estate": ["geography", "history", "housing", "structure", "schools", "transportation", "parks", "tax"],
  "burke-centre-va-real-estate": ["geography", "history", "planned-community", "housing", "structure", "schools", "transportation", "parks", "tax"],
};

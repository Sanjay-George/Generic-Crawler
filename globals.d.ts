declare const DomUtils: {
    findSimilarElementsByTreePath: (selectedTargets: any[]) => any[];
    getQuerySelector: (element: any) => string;
    addUnloadListener: () => void;
    removeUnloadListener: () => void;
};
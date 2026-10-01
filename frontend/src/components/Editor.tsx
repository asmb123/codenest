import { Editor } from "@monaco-editor/react";

export const EditorComponent = ({ language }: { language: string }) => {
    const languageMap: Record<string, string> = {
        "base-nodejs": "javascript",
        "base-python": "python",
        "base-go": "go",
        "base-react": "javascript",
    };

    const monacoLanguage = languageMap[language] ?? "javascript";

    return (
        <Editor
            theme="vs-dark"
            defaultLanguage={monacoLanguage}
            language={monacoLanguage}
        />
    );
};
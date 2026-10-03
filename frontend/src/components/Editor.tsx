import { Editor } from "@monaco-editor/react";

export const EditorComponent = ({ language, value }: { language: string, value: string }) => {
    return (
        <Editor
            value={value}
            theme="vs-dark"
            // defaultLanguage={"markdown"}
            language={language}
        />
    );
};
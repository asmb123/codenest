import { useParams } from "react-router";
import axios from "axios";
import { Spinner } from '@heroui/react';
import { EditorComponent } from '../components/Editor';
import { useEffect, useState } from "react";

export const CodeEditor = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editorText, setEditorText] = useState<string>("");
  const [codebase, setCodebase] = useState<Map<string, string>>(new Map());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { userId, lang } = useParams<{
    userId: string;
    lang: string;
  }>();

  useEffect(() => {

    const getFiles = async (url: string) => {

      const textExtensions = [
        ".ts", ".tsx", ".js", ".jsx",
        ".json", ".html", ".css",
        ".md", ".txt",
        ".go", ".mod", ".sum",
        ".py", ".java", ".c", ".cpp",
        ".h", ".hpp",
        ".yaml", ".yml",
        ".toml", ".env",
        ".sh"
      ];

      const textFileNames = [
        ".gitignore",
        "Dockerfile",
        "Makefile"
      ];

      const binaryExtensions = [
        ".png", ".jpg", ".jpeg", ".gif",
        ".webp", ".ico",
        ".pdf",
        ".zip", ".gz", ".tar",
        ".woff", ".woff2", ".ttf",
        ".mp3", ".mp4"
      ];

      const mp = new Map<string, string>();
      const parsedUrl = new URL(url);
      const filePath = decodeURIComponent(
        parsedUrl.pathname.slice(1)
      );
      const lowerPath = filePath.toLowerCase();
      const txt = await axios.get(url, { responseType: "arraybuffer" });
      const contentType = String(txt.headers["content-type"]) || "";

      const hasTextMimeType =
        contentType.startsWith("text/") ||
        contentType.includes("application/json") ||
        contentType.includes("application/javascript") ||
        contentType.includes("application/xml");

      const hasTextExtension =
        textExtensions.some(ext => lowerPath.endsWith(ext)) ||
        textFileNames.some(name => lowerPath.endsWith(name.toLowerCase()));

      const hasBinaryExtension =
        binaryExtensions.some(ext => lowerPath.endsWith(ext));

      const isTextFile =
        !hasBinaryExtension &&
        (hasTextMimeType || hasTextExtension);

      if (!isTextFile) {
        console.log("Skipping binary file:", filePath, contentType);
        return null;
      }

      const content = new TextDecoder("utf-8").decode(txt.data);


      mp.set(filePath, content);
      // const payl1 = url.split('/');
      // const payl2 = payl1[4];
      // let fileName = "";

      // let i = 0;
      // while (payl2[i] != '?') {
      //   if (payl2[i] == '?') break;
      //   fileName += payl2[i];
      //   i++;
      // }

      // const txt = await axios.get(url);
      // mp.set(fileName, txt.data);
      return mp;
    }

    const fetchData = async () => {
      try {
        setLoader(true);
        setError(null);

        // Get presigned URLs
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/base-folders`,
          { lang },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const presignedUrls: string[] = response.data.data;


        const mp = new Map<string, string>();
        const promises = presignedUrls.map((url) => {
          return getFiles(url);
        })
        const res = await Promise.all(promises);
        res.forEach((temp) => {
          if (!temp) return;
          temp.forEach((val, key) => {
            mp.set(key, val);
          });
        });
        // for (const url of presignedUrls) {
        //   const temp = await getFiles(url);
        //   temp.forEach((val, key) => {
        //     mp.set(key, val)
        //   })
        // }

        setCodebase(mp);
        const first = mp.entries().next().value;
        if (!first) return;
        setSelectedFile(first[0]);
        setEditorText(first[1]);
        // setSelectedFile(mp.)
        setLoader(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load files');
        setLoader(false);
      }
    };

    fetchData();

  }, [lang, userId]);

  const handleFileClick = (key: string, val: string) => {
    setEditorText(val);
    setSelectedFile(key);
  }

  const getEditorLanguage = (filename: string | undefined) => {
    if (!filename) return "plaintext";

    const extension = filename.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "js":
      case "jsx":
        return "javascript";

      case "ts":
      case "tsx":
        return "typescript";

      case "md":
        return "markdown";

      case "go":
        return "go";

      case "css":
        return "css";

      case "html":
        return "html";

      case "c":
        return "c";

      case "cpp":
      case "cc":
      case "cxx":
        return "cpp";

      case "py":
        return "python";

      case "json":
        return "json";

      case "yaml":
      case "yml":
        return "yaml";

      case "sh":
        return "shell";

      default:
        return "plaintext";
    }
  };

  if (!userId || !lang) {
    return <div>Invalid URL</div>;
  }

  if (error) {
    return <div>
      {error}
    </div>
  }

  return (
    <main className="w-screen h-screen bg-black text-white flex justify-center items-center">
      {loader ? (
        <Spinner />
      ) : (
        <div className="p-4 w-full h-full flex gap-2">
          <div className="w-[20vw] py-2 px-5 h-full border border-white flex flex-col gap-1 overflow-y-auto">
            {Array.from(codebase?.entries()).map(([key, val], ind) => (
              <button key={ind} onClick={() => handleFileClick(key, val)} className={`${selectedFile === key ? 'bg-gray-950' : ''} rounded-sm bg-gray-900 p-2 hover:cursor-pointer text-sm`}>{key}</button>
            ))}

          </div>
          <div className="w-[80vw] py-2 px-5 h-full border border-white flex flex-col overflow-y-auto">
            <EditorComponent
              value={editorText}
              language={getEditorLanguage(String(selectedFile))} />
          </div>
        </div>
      )}
    </main>
  );
};
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
      const mp = new Map<string, string>();
      const parsedUrl = new URL(url);
      const filePath = decodeURIComponent(
        parsedUrl.pathname.slice(1)
      );
      const txt = await axios.get(url, { responseType: "arraybuffer" });
      const contentType = String(txt.headers["content-type"]) || "";

      const isTextFile =
        contentType.startsWith("text/") ||
        contentType.includes("application/json") ||
        contentType.includes("application/javascript") ||
        contentType.includes("application/xml");

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
              language={(() => {
                const filename = selectedFile;
                const extension = filename ? filename.split('.').pop() : '';

                if (extension === "js" || extension === "jsx") {
                  return "javascript";
                } else if (extension === "ts" || extension === "tsx") {
                  return "typescript";
                } else if (extension === "md") {
                  return "markdown";
                } else if (extension === "go" || extension === "golang") {
                  return "go";
                } else if (extension === "css") {
                  return "css";
                } else if (extension === "html") {
                  return "html";
                } else if (extension === "c") {
                  return "c";
                } else if (extension === "cpp") {
                  return "cpp";
                } else if (extension === "py") {
                  return "python";
                } else if (extension === "json") {
                  return "json";
                } else {
                  return "plaintext";
                }
              })()} />
          </div>
        </div>
      )}
    </main>
  );
};
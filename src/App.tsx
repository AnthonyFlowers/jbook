import * as esbuild from "esbuild-wasm";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

function App() {
  const ref = useRef<any>();
  const [input, setInput] = useState("import 'bulma/css/bulma.css';");
  const [code, setCode] = useState("");

  async function startService() {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
    // console.log(service);
  }

  useEffect(() => {
    startService();
  }, []);

  async function onClick() {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
    });

    console.log(result);
    setCode(result.outputFiles[0].text);
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default App;

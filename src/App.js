import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
const App = () => {
  let input = [];
  function createStdin() {
    let inputIndex = 0;
    function stdin() {
      if (inputIndex < input.length) {
        let character = input[inputIndex];
        inputIndex++;
        return character;
      } else {
        throw new Error("Input value is empty");
      }
    }
    return stdin;
  }
  const runScript = async (timeout) => {
    const overallCode =
      '{"code_content":"\\"count = 0\\\\nwhile (count <3):\\\\n    count = count + 1\\\\n    print(\\\\\\"Hello Geek\\\\\\")\\"","code_language":"PYTHON39","inputs":["\\"\\""]}';

    const overallParseCode = JSON.parse(overallCode);
    const code_content = JSON.parse(overallParseCode.code_content);
    //console.log(code_content);
    const code_input = JSON.parse(overallParseCode.inputs);
    if (code_input.length > 0) {
      const myArray = code_input.split("\n");
      input = myArray;
      console.log(myArray);
    }
    const pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
      stdin: createStdin(),
    });

    let outputBuffer = "";
    const printFunc = pyodide.globals.get("print");
    pyodide.globals.set("print", function (text) {
      outputBuffer += text + "\n";
      printFunc(text);
    });

    let timer = setTimeout(() => {
      console.log("hell");
      pyodide.gilRelease();
      throw new Error(" TIME LIMIT EXCEDED");
    }, 0.00001);
    let result = "";
    if (code_content.includes('if __name__ == "__main__":')) {
      result = await pyodide.runPython(code_content + "\n" + "main()");
      clearTimeout(timer);
    } else {
      result = await pyodide.runPython(code_content);
      clearTimeout(timer);
    }
    console.log(outputBuffer);
    console.log(result);
  };

  useEffect(() => {
    const run = async () => {
      const out = await runScript(5000);
    };
    run();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p></p>
      </header>
    </div>
  );
};

export default App;

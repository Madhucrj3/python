import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
const App = () => {
  const [resullt, setResullt] = useState([]);
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
  const handleOutput = (msg) => {
    console.log(msg);
    setResullt((prevState) => [...prevState, msg]);
  };
  const runScript = async () => {
    const overallCode =
      //'{"code_content":"\\"i=1\\\\nwhile(i==1):\\\\n    print(i)\\\\n\\"","code_language":"PYTHON38_AIML","inputs":["\\"\\""]}';

      '{"code_content":"\\"# Python code for implementation of Naive Recursive\\\\n# approach\\\\ndef isPalindrome(x):\\\\n\\\\treturn x == x[::-1]\\\\n\\\\n\\\\ndef minPalPartion(string, i, j):\\\\n\\\\tif i >= j or isPalindrome(string[i:j + 1]):\\\\n\\\\t\\\\treturn 0\\\\n\\\\tans = float(\'inf\')\\\\n\\\\tfor k in range(i, j):\\\\n\\\\t\\\\tcount = (\\\\n\\\\t\\\\t\\\\t1 + minPalPartion(string, i, k)\\\\n\\\\t\\\\t\\\\t+ minPalPartion(string, k + 1, j)\\\\n\\\\t\\\\t)\\\\n\\\\t\\\\tans = min(ans, count)\\\\n\\\\treturn ans\\\\n\\\\n\\\\ndef main():\\\\n\\\\tstring = \\\\\\"ababbbabbababa\\\\\\"\\\\n\\\\tprint(\\\\n\\\\t\\\\\\"Min cuts needed for Palindrome Partitioning is \\\\\\",\\\\n\\\\tminPalPartion(string, 0, len(string) - 1),\\\\n\\\\t)\\\\n\\\\nif __name__ == \\\\\\"__main__\\\\\\":\\\\n\\\\tmain()\\\\n\\\\n# This code is contributed by itsvinayak\\\\n\\"","code_language":"PYTHON38_AIML","inputs":["\\"\\""]}';
    const overallParseCode = JSON.parse(overallCode);
    const code_content = JSON.parse(overallParseCode.code_content);

    const code_input = JSON.parse(overallParseCode.inputs);
    if (code_input.length > 0) {
      const myArray = code_input.split("\n");
      input = myArray;
    }
    const pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/",
      args: ["1", "2", "3"],
      stdin: createStdin(),
      stdout: (msg) => handleOutput(msg),
      stderr: (msg) => console.log(msg),
    });
    let result = "";
    try {
      result = await pyodide.runPythonAsync(code_content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const run = async () => {
      const out = await runScript();
    };
    run();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {resullt}
      </header>
    </div>
  );
};
export default App;

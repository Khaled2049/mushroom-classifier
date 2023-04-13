import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState<any>();
  const [predicton, setpredicton] = useState<Number | null>(null);

  function handleChange(event: any) {
    setFile(event.target.files[0]);
  }

  const predict = (pred: any) => {
    if (pred > 0.5) {
      return (
        <h4>
          I can say that this mushroom is{" "}
          <span style={{ color: "red" }}>Poisonous</span> with 69% accuracy
        </h4>
      );
    } else {
      return (
        <h4>
          I can say that this mushroom is{" "}
          <span style={{ color: "green" }}>Edible</span>
          with 69% accuracy
        </h4>
      );
    }
  };

  function handleSubmit(event: any) {
    event.preventDefault();
    const url = "http://localhost:3001/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response: any) => {
      console.log(response.data);
      const { prediction } = response.data;
      setpredicton(parseFloat(prediction));
    });
  }

  useEffect(() => {
    fetch("http://127.0.0.1:3001")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // return data;
      })
      .catch((err: any) => console.log(err));
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>MUSHROOM CLASSIFIER</h1>
        <img
          style={{ width: "200px" }}
          src="../public/R.png"
          alt="mushroom image"
        />
        <h2>Upload Mushroom image to see if it's edible or not!</h2>
        <input
          style={{ border: "solid 2px black" }}
          type="file"
          onChange={handleChange}
        />
        <button type="submit">Upload</button>
      </form>
      {predicton ? predict(predicton) : null}
    </div>
  );
}

export default App;

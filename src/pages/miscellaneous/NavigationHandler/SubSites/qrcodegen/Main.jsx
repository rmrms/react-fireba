import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Main() {
  const [temp, setTemp] = useState("");
  const [word, setWord] = useState("ET");
  const [size, setSize] = useState(100);
  const [bgColor, setBgColor] = useState("ffffff");
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setQrCode(
      `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        word
      )}&size=${size}x${size}&bgcolor=${bgColor}`
    );
  }, [word, size, bgColor]);

  function handleClick() {
    setWord(temp);
  }

  const handleTextChange = (e) => {
    setTemp(e.target.value);
  };

  const handleColorChange = (e) => {
    setBgColor(e.target.value.replace("#", ""));
  };

  const handleDimensionChange = (e) => {
    setSize(e.target.value);
  };

  return (
    <div className="container py-5">
      <h3 className="text-center text-primary mb-4">QR Code Gen</h3>
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter text to encode"
              onChange={handleTextChange}
            />
            <button className="btn btn-success" onClick={handleClick}>
              Generate
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6 mb-4">
          <div className="card p-3">
            <h5 className="text-info">Background Color:</h5>
            <input
              type="color"
              className="form-control form-control-color"
              defaultValue="#ffffff"
              onChange={handleColorChange}
            />
            <h6 className="text-muted">{`#${bgColor}`}</h6>
          </div>

          <div className="card p-3 mt-4">
            <h5 className="text-info">Dimension:</h5>
            <input
              type="range"
              min="200"
              max="300"
              value={size}
              className="form-range"
              onChange={handleDimensionChange}
            />
            <h6 className="text-muted">
              {size}px x {size}px
            </h6>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <img
          src={qrCode}
          alt="Generated QR Code"
          className="img-fluid shadow-lg rounded"
        />
      </div>

      <div className="text-center mt-3">
        <a href={qrCode} download="QRCode">
          <button className="btn btn-warning btn-lg">Download</button>
        </a>
      </div>

      <div className="mt-4 text-center">
        <button
          className="btn btn-dark btn-lg w-100 py-3"
          onClick={() => navigate("/navigationhandler")}
        >
          Back to Nav handler
        </button>
      </div>
    </div>
  );
}

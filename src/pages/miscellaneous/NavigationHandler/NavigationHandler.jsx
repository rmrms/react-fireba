import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/navigation-handler.css";
import FormHandler from "./SubSites/forms/Forms";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Main from "./SubSites/qrcodegen/Main";

const NavigationHandler = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Navigation Handler</h1>
      <p className="lead text-muted">This is where my practice projects go.</p>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <section className="mb-3">
            <button
              onClick={() => navigate("/boxgame")}
              className="btn btn-danger w-100"
            >
              #1 🎮 The BoxGame 🎮 (final exam practice, abandoned / unfinished)
            </button>
          </section>
          <section className="mb-3">
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/formhandlerpractice")}
            >
              #2 Form Practice
            </button>
          </section>
          <section className="mb-3">
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/qrcodegen")}
            >
              #3 QR Code Gen
            </button>
          </section>
          <section>
            <button
              className="btn btn-secondary w-100"
              onClick={() => navigate("/home")}
            >
              ← Back To Home Page
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NavigationHandler;

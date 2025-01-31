import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";

const fetchUserData = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        name: "Don Jhoe",
        email: "donjhoe@fanfiction.com",
        phone: "123-456-7890",
      });
    }, 2500)
  );
};

const FormHandler = () => {
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetchUserData()
      .then((data) => {
        setUserData(data);
        setFormData(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  const resetForm = () => {
    setFormData(userData);
  };

  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center text-uppercase fw-bold mb-4">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="name">Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone">Phone</label>
          </div>
          <button type="submit" className="btn btn-success w-100 py-2">
            💾 Save Profile (It is not connected to either firebase or
            localstorage.)
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={resetForm}
          >
            🔄 Reset to Original
          </button>
        </form>
        <button
          className="btn w-100 py-5"
          onClick={() => navigate("/navigationhandler")}
        >
          Back to Nav handler
        </button>
      </div>
    </div>
  );
};

export default FormHandler;

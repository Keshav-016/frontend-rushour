import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "styled-components";

const Shopcam = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fff;
  `;

  const UploadButton = styled.label`
    display: inline-block;
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.helper};
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.8rem;
    cursor: pointer;
    transition: background-color 0.3s linear;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }

    input[type="file"] {
      display: none;
    }
  `;

  const LoadingIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `;

  const loadingStyle = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/jpeg") {
      setSelectedFile(file);
      sendImageToAPI(file);
    } else {
      setSelectedFile(null);
      alert("Please select a valid JPG file.");
    }
  };

  const sendImageToAPI = async (file) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(response.data.images);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending the image:", error);
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <UploadButton>
        {selectedFile ? "Change JPG File" : "Upload JPG File"}
        <input type="file" accept=".jpg" onChange={handleFileUpload} />
      </UploadButton>
      {selectedFile && (
        <div>
          <p>Selected file: {selectedFile.name}</p>
        </div>
      )}
      {isLoading ? (
        <LoadingIcon>
          <RingLoader css={loadingStyle} size={150} color={"#123abc"} />
        </LoadingIcon>
      ) : response ? (
        <div>
          <h2>API Response:</h2>
          <div className="image-grid">
            {response.map((base64Data, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64, ${base64Data}`}
                alt={`Image ${index}`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
};

export default Shopcam;

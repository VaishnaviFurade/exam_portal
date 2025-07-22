import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js'; // Make sure face-api.js is installed correctly

const Proctoring = () => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    const MODEL_URL = '/face_models';

    const loadModels = async () => {
      try {
        // Load the tiny face detector model only
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("✅ Models loaded");
        startVideo();
      } catch (err) {
        console.error('❌ Failed to load face-api models:', err);
        alert("❌ Failed to load face detection models.");
        setLoading(false);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              setLoading(false);
              intervalRef.current = setInterval(detectFaces, 4000);
            };
          }
        })
        .catch((err) => {
          console.error('❌ Camera access denied:', err);
          alert("⚠️ Please allow camera access for proctoring to work.");
          setLoading(false);
        });
    };

    const detectFaces = async () => {
      if (!videoRef.current) return;

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (!detections || detections.length === 0) {
        setWarning('⚠️ Face not detected');
      } else if (detections.length > 1) {
        setWarning('🚨 Multiple faces detected!');
      } else {
        setWarning('');
      }
    };

    loadModels();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h3>👁️ Online Proctoring</h3>
        {loading ? (
          <p style={styles.loading}>⏳ Loading face detection models...</p>
        ) : (
          <>
            <video
              ref={videoRef}
              width="320"
              height="240"
              autoPlay
              muted
              style={{
                ...styles.video,
                borderColor: warning ? 'red' : '#ccc',
              }}
            />
            {warning && <p style={styles.warningText}>{warning}</p>}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
  card: {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  video: {
    borderRadius: '10px',
    border: '2px solid',
    transition: 'border 0.3s ease',
  },
  warningText: {
    color: 'red',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  loading: {
    color: '#555',
    fontStyle: 'italic',
  },
};

export default Proctoring;

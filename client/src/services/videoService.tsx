import { useState, useRef, useContext } from 'react';
import ChatwsContext from '../components/providers/chatws/chatwsContext';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const mimeType = 'video/webm; codecs="opus,vp8"';

const VideoRecorder = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { sendData } = useContext(ChatwsContext);

  const [permission, setPermission] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const liveVideoFeed = useRef<HTMLVideoElement | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'inactive' | 'recording'>('inactive');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    //get video and audio permissions and then stream the result media stream to the videoSrc variable
    if ('MediaRecorder' in window) {
      try {
        const videoConstraints = {
          audio: false,
          video: true,
        };
        const audioConstraints = { audio: true };

        // create audio and video streams separately
        const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);
        const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints);

        setPermission(true);

        //combine both audio and video streams

        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);

        setStream(combinedStream);

        if (liveVideoFeed.current) {
          liveVideoFeed.current.srcObject = videoStream;
        }
      } catch (err) {
        alert(err);
      }
    } else {
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };

  const startRecording = async () => {
    if (!stream) return; 
    setRecordingStatus('recording');
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localVideoChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };

    setVideoChunks(localVideoChunks);
  };

  const stopRecording = () => {
    if (!mediaRecorder.current) return;
    setPermission(false);
    setRecordingStatus('inactive');
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);

      setRecordedVideo(videoUrl);
      console.log(videoUrl+'video')
      // sendData(('video;'+videoUrl), groupId);
      setVideoChunks([]);
    };
  };

  return (
    <div>
      <div className="video-controls">
        {!permission ? (
          <button onClick={getCameraPermission} type="button">
            📹
          </button>
        ) : null}
        {permission && recordingStatus === 'inactive' ? (
          <Button onClick={startRecording} >
            Записать
          </Button>
        ) : null}
        {recordingStatus === 'recording' ? (
          <Button onClick={stopRecording}>
            Отправить
          </Button>
        ) : null}
      </div>

      <div className="video-player">
        {!recordedVideo ? (
          <video ref={liveVideoFeed} autoPlay className="live-player"></video>
        ) : null}
        {recordedVideo ? (
          <div className="recorded-player">
            <video className="recorded" src={recordedVideo} controls></video>
            <a download href={recordedVideo}></a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VideoRecorder;

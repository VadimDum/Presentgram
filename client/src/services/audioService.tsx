import { Box, Button } from '@mui/material';
import { useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ChatwsContext from '../components/providers/chatws/chatwsContext';


const mimeType = 'audio/webm';

const AudioRecorder: React.FC = () => {
  const { groupId } = useParams();
  const { sendDataAudio } = useContext(ChatwsContext);

  const [permission, setPermission] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>('inactive');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(mediaStream);
      } catch (err) {
        alert(err);
      }
    } else {
      alert('Ваш браузер не поддерживает запись аудио.');
    }
  };

  const startRecording = async () => {
    if (!stream) return;
    setRecordingStatus('recording');
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus('inactive');
    if (mediaRecorder.current !== null) {
      mediaRecorder.current.stop();

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
      

        setAudio(audioUrl);
        // sendData('audio;' + audioUrl, groupId);
        sendDataAudio(audioBlob, groupId);
        setAudioChunks([]);
      };
    }
  };

  return (
    <Box>
      <div>
        <Button className="audio-controls">
          {!permission ? <Button onClick={getMicrophonePermission}>🎤</Button> : null}
          {permission && recordingStatus === 'inactive' ? (
            <Button onClick={startRecording}>Записать</Button>
          ) : null}
          {recordingStatus === 'recording' ? (
            <Button onClick={stopRecording}>Остановить</Button>
          ) : null}
        </Button>
        {audio ? (
          <Button>
            <a download href={audio}></a>
          </Button>
        ) : null}
      </div>
    </Box>
  );
};

export default AudioRecorder;

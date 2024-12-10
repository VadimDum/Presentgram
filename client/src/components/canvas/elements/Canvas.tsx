import { useContext, useEffect, useRef } from 'react';
import './Canvas.scss';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import ChatwsContext from '../../providers/chatws/chatwsContext';
import { useAppSelector } from '../../providers/hooks';

const CanvasPage = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { sendDataDraw } = useContext(ChatwsContext);
  const draw = useAppSelector((store) => store.chat.draw);

  useEffect(() => {
    if (canvasRef.current) {canvasState.setCanvas(canvasRef.current);
    toolState.setTool(new Brush(canvasRef.current));
    toolState.setTool(new Rect(canvasRef.current));
    toolState.setTool(new Circle(canvasRef.current));
    toolState.setTool(new Eraser(canvasRef.current));
    toolState.setTool(new Line(canvasRef.current));}
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const img = new Image();
      img.src = draw;
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      };
    }
  }, [draw]);

  const mouseDownHandler = () => {
    if (canvasRef.current) canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  return (
    <div className="canvas">
      <canvas
        onMouseUp={() => {
          if (canvasRef.current) sendDataDraw(canvasRef.current.toDataURL());
        }}
        onMouseDown={() => mouseDownHandler()}
        ref={canvasRef}
        width={1000}
        height={450}
      />
    </div>
  );
});

export default CanvasPage;

import './ToolBar.scss';
import './Canvas.scss';
import { Button, Input, Typography } from '@mui/material';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';

function ToolBar(): JSX.Element {
  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    toolState.setStrokeColor(e.target.value);
    toolState.setFillColor(e.target.value);
  };

  const download = () => {
    if (canvasState.canvas) {
      const dataUrl = canvasState.canvas.toDataURL();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = Math.round(Math.random() * 1e9) + '.jpeg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="toolbar" style={{ top: 100 }}>
      <Button
        className="toolbar-button brush"
        onClick={() => {
          if (canvasState.canvas) {
            toolState.setTool(new Brush(canvasState.canvas));
          }
        }}
      ></Button>
      <Button
        className="toolbar-button rect"
        onClick={() => {
          if (canvasState.canvas) {
            toolState.setTool(new Rect(canvasState.canvas));
          }
        }}
      ></Button>
      <Button
        className="toolbar-button circle"
        onClick={() => {
          if (canvasState.canvas) {
            toolState.setTool(new Circle(canvasState.canvas));
          }
        }}
      ></Button>
      <Button
        className="toolbar-button eraser"
        onClick={() => {
          if (canvasState.canvas) {
            toolState.setTool(new Eraser(canvasState.canvas));
          }
        }}
      ></Button>
      <Button
        className="toolbar-button line"
        onClick={() => {
          if (canvasState.canvas) {
            toolState.setTool(new Line(canvasState.canvas));
          }
        }}
      ></Button>

      <Typography>Цвет фигуры:</Typography>
      <Input
        onChange={changeColor}
        style={{ marginLeft: 10 }}
        type="color"
        className="toolbar-button"
      ></Input>
      <Button className="toolbar-button undo" onClick={() => canvasState.undo()}></Button>
      <Button className="toolbar-button redo" onClick={() => canvasState.redo()}></Button>
      <Button className="toolbar-button save" onClick={() => download()}></Button>
    </div>
  );
}

export default ToolBar;

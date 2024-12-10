import './ToolBar.scss';
import './Canvas.scss';
import { Input, Typography } from '@mui/material';
import toolState from '../store/toolState';

function SettingsBar(): JSX.Element {
  return (
    <div className="setting-bar" style={{ top: 140 }}>
      <Typography>Толщина фигуры:</Typography>
      <Input
        onChange={(e) => toolState.setLineWidth(Number(e.target.value))}
        style={{ margin: '0 10px', width: '40px' }}
        type="number"
        defaultValue={20}
      />
      <Typography>Цвет границ:</Typography>
      <Input
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
        className="toolbar-button"
        style={{ margin: '0 10px' }}
        id="stroke-color"
        type="color"
      />
    </div>
  );
}

export default SettingsBar;

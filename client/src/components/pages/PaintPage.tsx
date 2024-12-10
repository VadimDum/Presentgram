import CanvasPage from '../canvas/elements/Canvas';
import '../canvas/elements/Canvas.scss';
import { Box, Typography, List, ListItemText, Paper, ListItemButton } from '@mui/material';
import SettingsBarPage from '../canvas/elements/SettingsBar';
import ToolBarPage from '../canvas/elements/ToolBar';
import { useAppSelector } from '../providers/hooks';

function PaintPage(): JSX.Element {
  const users = useAppSelector((store) => store.chat.users);

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#E3F2FD' }}>
      <Box
        sx={{
          width: 250,
          backgroundColor: 'white',
          padding: 2,
          borderRight: '1px solid #ddd',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Пользователи
        </Typography>
        <List sx={{ padding: 0 }}>
          {users.map((user) => (
            <ListItemButton key={user.id} component="li">
              <ListItemText primary={user.name} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper
          sx={{
            flex: 1,
            margin: 2,
            padding: 2,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
          }}
        >
          <Box
            className="appcanvas"
            sx={{ marginBottom: 2 }}
          >
                  <ToolBarPage />
                  <SettingsBarPage />
                  <CanvasPage />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default PaintPage;

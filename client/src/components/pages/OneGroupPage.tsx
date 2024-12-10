import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Menu,
  MenuItem,
  Modal,
  CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../providers/hooks';
import ChatwsContext from '../providers/chatws/chatwsContext';
import ChatBar from '../ui/ChatBar';
import EmojiPicker from 'emoji-picker-react';
import { MessageT } from '../../schemas/messageSchema';
import IconButton from '@mui/material/IconButton';
import { getAllGroups } from '../providers/group/groupThunk';
import InfoIcon from '@mui/icons-material/Info';

export default function OneGroupPage(): JSX.Element {
  const messages = useAppSelector((store) => store.chat.messages);
  const user = useAppSelector((state) => state.auth.user);

  const { sendData, editMessage, deleteMessage } = useContext(ChatwsContext);

  const { groupId } = useParams();

  const [input, setInput] = useState('');
  const groupmessages = messages.filter((message) => message.groupid === Number(groupId));
  const userGroups = useAppSelector((store) => store.groups.groups);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMessageId, setCurrentMessageId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(true);

  const currentGroup = userGroups.filter((group) => group.id === Number(groupId));
  const handleEmoji = (emoji: any): void => {
    setInput((input) => input + emoji.emoji);
  };

  const [openInfo, setOpenInfo] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      console.log('Запрос на загрузку групп...');
      setIsLoading(true);

      try {
        await dispatch(getAllGroups());
      } catch (error) {
        console.error('Ошибка при загрузке групп:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [dispatch, groupId, userGroups.length]);

  const handleOpenInfo = async () => {
    await dispatch(getAllGroups());

    setOpenInfo(true);
  };
  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, messageId: number, text: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentMessageId(messageId);
    setEditingText(text);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentMessageId(null);
  };

  const handleDelete = () => {
    console.log(`Deleting message with id: ${currentMessageId}`);
    if (currentMessageId !== null) {
      deleteMessage(currentMessageId, Number(groupId));
      handleClose();
    }
  };

  const handleEdit = () => {
    setIsEditing(currentMessageId);
    handleClose();
  };

  const handleForward = () => {
    console.log(`Forwarding message with id: ${currentMessageId}`);
    handleClose();
  };

  const handleSave = () => {
    if (isEditing !== null && editingText.trim()) {
      editMessage(isEditing, editingText, Number(groupId));
      setIsEditing(null);
    }
  };

  const handlePlayTTS = (messageText: string) => {
    const utterance = new SpeechSynthesisUtterance(messageText);
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#E3F2FD' }}>
      <ChatBar />

      <Box sx={{ display: 'flex', height: '90vh', width: '100%', backgroundColor: '#E3F2FD' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 2,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>
              {currentGroup[0]?.title}
            </Typography>
            <IconButton edge="end" aria-label="more" onClick={handleOpenInfo}>
              <InfoIcon />
            </IconButton>
          </Box>
          <Modal open={openInfo} onClose={handleCloseInfo}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Информация о чате
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Описание: {currentGroup[0]?.description.toString()}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Владелец: {currentGroup[0]?.Owner.nick.toString()}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Пользователи:
                {currentGroup[0]?.GroupUser.length > 1
                  ? currentGroup[0]?.GroupUser.map((user) => ` ${user.nick} `)
                  : currentGroup[0]?.GroupUser.length === 1
                    ? ` ${currentGroup[0]?.GroupUser[0].nick} `
                    : 'No users'}
              </Typography>
            </Box>
          </Modal>
          <Paper
            sx={{
              flex: 1,
              margin: 2,
              padding: 2,
              overflowY: 'auto',
              maxWidth: '1200px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
            }}
          >
            <Box sx={{ marginBottom: 2 }}>
              {groupmessages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    marginBottom: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '600px',
                    wordWrap: 'break-word',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ marginRight: 1 }}>
                      <Link to={`/profile/${message.authorid}`}>{message.authorName}</Link>
                    </Typography>
                    {isEditing === message.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <TextField
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ marginRight: 1 }}
                        />

                        <IconButton color="primary" onClick={handleSave}>
                          <CheckIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="body1"
                          sx={{
                            marginLeft: 2,
                            wordWrap: 'break-word',
                            maxWidth: '500px',
                          }}
                        >
                          {message.text}
                        </Typography>
                        {message.isEdited && (
                          <Typography
                            variant="body2"
                            sx={{ fontStyle: 'italic', color: 'grey', marginLeft: 1 }}
                          >
                            ред.
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>

                  <Button
                    onClick={(event) => handleClick(event, message.id, message.text)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    ...
                  </Button>
                </Box>
              ))}
            </Box>
          </Paper>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const text = formData.get('text');
              if (!text || typeof text !== 'string' || !text.trim()) {
                return console.log('Сообщение не может быть пустым');
              }
              sendData(text, groupId);
              setInput('');
              return e.currentTarget.reset();
            }}
            sx={{
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              position: 'sticky',
              bottom: 0,
              backgroundColor: '#fff',
            }}
          >
            <TextField
              name="text"
              fullWidth
              variant="outlined"
              label="Напишите сообщение..."
              sx={{ marginRight: 2 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => setOpen(!open)} style={{ margin: '20px' }}>
              ✌️
            </Button>
            <Box
              display={open ? 'none' : 'block'}
              sx={{
                position: 'absolute',
                top: '-250%',
                left: '70%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Button onClick={() => setOpen(!open)}>Скрыть</Button>
              <EmojiPicker onEmojiClick={handleEmoji} />
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ height: '100%' }}>
              Отправить
            </Button>
          </Box>
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {user?.id ===
          messages.find((message: MessageT) => message.id === currentMessageId)?.authorid && (
          <>
            <MenuItem onClick={handleDelete} sx={{ color: 'red', fontSize: '0.875rem' }}>
              Удалить
            </MenuItem>
            <MenuItem onClick={handleEdit} sx={{ fontSize: '0.875rem' }}>
              Редактировать
            </MenuItem>
          </>
        )}
        <MenuItem
          onClick={() => {
            const messageText = messages.find(
              (message: MessageT) => message.id === currentMessageId,
            )?.text;
            if (messageText) {
              handlePlayTTS(messageText);
            } else {
              console.warn('Сообщение не найдено или текст отсутствует.');
            }
          }}
          sx={{ fontSize: '0.875rem' }}
        >
          Озвучить
        </MenuItem>
        <MenuItem onClick={handleForward} sx={{ fontSize: '0.875rem' }}>
          Переслать
        </MenuItem>
      </Menu>
    </Box>
  );
}

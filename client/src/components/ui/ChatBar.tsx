import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../providers/hooks';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { getAllUsers } from '../providers/users/userThunk';
import ChatwsContext, { groupDataType } from '../providers/chatws/chatwsContext';
import { getAllGroups } from '../providers/group/groupThunk';

export default function ChatBar(): JSX.Element {
  const [open, setOpen] = useState(false);

  const [groupTitle, setGroupTitle] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selected, setSelected] = useState('');
  const groups = useAppSelector((store) => store.chat.groups);
  const users = useAppSelector((store) => store.users.users);
  const user = useAppSelector((state) => state.auth.user);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { sendGroupData } = useContext(ChatwsContext);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().startsWith(searchQuery.toLowerCase()),
  );

  // const filteredGroups = groups.filter((group))

  console.log(groups)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    void dispatch(getAllUsers());
    void dispatch(getAllGroups());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setGroupTitle('');
    setGroupDescription('');
    setSelectedUsers([]);
    setSearchQuery('');
  };

  const handleUserChange = (userId: string) => {
    console.log('Toggling user:', userId);
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSubmitGroup = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting group data:', { groupTitle, groupDescription, selectedUsers });
    const newGroupData: groupDataType = {
      title: groupTitle,
      description: groupDescription,
      chatflag: false,
      ownerid: user.id,
      users: selectedUsers,
    };

    sendGroupData(newGroupData);


    handleClose();
  };

  const handleSelect = (groupId: string) => {
    setSelected(groupId);
    navigate(`/group/${groupId}`);
  };

  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: 'white',
        padding: 2,
        borderRight: '1px solid #ddd',
        maxHeight: '700px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Чаты
          </Typography>
          <Button onClick={handleOpen} sx={{}}>
            <AddCircleOutlineIcon />
          </Button>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Создание группы
            </Typography>
            <TextField
              label="Название группы"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Описание группы"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
              Выберите пользователей:
            </Typography>
            <TextField
              label="Поиск пользователей"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            {searchQuery &&
              filteredUsers.map((user) => (
                <FormControlLabel
                  key={user.id}
                  control={
                    <Checkbox
                      checked={selectedUsers.includes(String(user.id))}
                      onChange={() => handleUserChange(String(user.id))}
                    />
                  }
                  label={user.name}
                />
              ))}
            <Button variant="contained" onClick={handleSubmitGroup} sx={{ marginTop: 2 }}>
              Создать группу
            </Button>
          </Box>
        </Modal>
      </Box>
      <List sx={{  padding: 0,
    maxHeight: '600px', 
    overflowY: 'auto'}}>
        {groups.map((group: groupDataType) => {
          if (!group.id) return null;
          const cropTitle =
            group.title.length > 20 ? group.title.slice(0, 20) + '...' : group.title;
          return (
            <ListItem
              key={group.id?.toString()}
              sx={{
                backgroundColor: group.id === selected ? 'lightblue' : 'white',
              }}
              onClick={() => handleSelect(group.id!)}
            >
              <ListItemText primary={cropTitle} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

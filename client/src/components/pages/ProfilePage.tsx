import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../providers/hooks';
import { useEffect, useState } from 'react';
import { loadWallPostsThunk } from '../providers/wall/postsThunk';
import { useParams } from 'react-router-dom';
import { addImagePost, addPost, deletePost } from '../providers/wall/postsSlice';
import axiosInstance from '../../services/axiosInstance';
import EmojiPicker from 'emoji-picker-react';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [uploaded, setUploaded] = useState(null as string | null);

  const user = useAppSelector((state) => state.auth.user);
  const users = useAppSelector((state) => state.users)
  const userpage = users.users.find((elem)=> elem.id === Number(params.id));

  const [open, setOpen] = useState(true);
  const [input, setInput] = useState('');
  const handleEmoji = (emoji: any): void => {
    setInput((input) => input + emoji.emoji);
  };

  useEffect(() => {
    if(params.id) {
    void dispatch(loadWallPostsThunk(params.id))};
  }, []);

  const posts = useAppSelector((store) => store.post.posts); 

const file2Base64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = (error) => reject(error);
  });
};

const addPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  if (e.target.files === null) return;
  if (e.target.files.length === 0) return;
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('img', file);
  const image = await file2Base64(file)
  try {
    dispatch(
      addImagePost({
        authorid: user.id,
        userid: Number(params.id),
        wallreaction: null,
        wallreactionimg: null,
        wallreactionimgcurrent: image,
        Userwallauthor: user,
      }),
    );
    axiosInstance.post(
      `/wallelements/${Number(params.id)}/${user.id}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  } catch (error) {
    console.error('Error adding picture:', error);
  }
};

const editImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  if (user.id !== Number(params.id)) return;
  if (e.target.files === null) return;
  if (e.target.files.length === 0) return;
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('img', file); 
  const image = await file2Base64(file);
  setUploaded(image);
  try {
    await axiosInstance.patch(`/users/${user.id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#E3F2FD' }}>
      <Box
        sx={{
          width: 500,
          backgroundColor: 'white',
          padding: 2,
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: 450,
            backgroundColor: 'white',
            padding: 2,
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            component="img"
            sx={{
              width: 200,
              height: 200,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
              padding: 2,
              borderRight: '1px solid #ddd',
              display: 'flex',
              flexDirection: 'column',
            }}
            src={!uploaded ? `http://localhost:3000/img/${userpage?.avatar}` : uploaded}
            alt="avatar"
          ></Box>
          <Box
            sx={{
              width: 234,
              height: 200,
              backgroundColor: 'white',
              padding: 2,
              borderRight: '1px solid #ddd',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Обо мне:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {userpage?.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {userpage?.nick}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {userpage?.email}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: 450,
            height: 50,
            padding: 2,
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <form>
            <Button variant="contained" color="primary" component="label">
              Заменить аватар
              <input
                accept="image/png,image/jpeg,image/gif"
                type="file"
                id="file-edit"
                onChange={editImage}
                name="img"
                hidden
              />
            </Button>
          </form>
        </Box>
        <Box
          sx={{
            width: 450,
            height: 500,
            backgroundColor: 'white',
            padding: 2,
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" gutterBottom></Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
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
          <Box className="wallposts" sx={{ marginBottom: 2 }}>
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const text = formData.get('text');
                if (typeof text === 'string') {
                  dispatch(
                    addPost({
                      authorid: user.id,
                      userid: Number(params.id),
                      wallreaction: text,
                      wallreactionimg: null,
                      Userwallauthor: user,
                    }),
                  );
                }
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
                label="Оставить сообщение на стене...."
                sx={{ marginRight: 2 }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={() => setOpen(!open)} style={{ margin: '5px' }}>
                ✌️
              </Button>
              <Box
                display={open ? 'none' : 'block'}
                sx={{
                  position: 'absolute',
                  top: '330%',
                  left: '80%',
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
              <Button
                style={{ margin: '5px' }}
                variant="contained"
                color="primary"
                sx={{ height: '100%' }}
                component="label"
              >
                Изображение
                <input
                  accept="image/png,image/jpeg,image/gif"
                  type="file"
                  id="file-edit"
                  onChange={addPicture}
                  name="img"
                  hidden
                />
              </Button>
            </Box>
            <Box sx={{ marginBottom: 1 }}>
              {posts?.map((post) => (
                <Typography key={post.id}>
                  <Typography variant="body2" fontWeight="bold">
                    Автор: {post?.Userwallauthor?.name}
                  </Typography>
                  {post.wallreaction !== '' && post.wallreaction !== null ? (
                    <Typography variant="body1" sx={{ marginLeft: 2 }}>
                      {post.wallreaction}
                    </Typography>
                  ) : (
                    <Box
                      component="img"
                      sx={{
                        maxHeight: { xs: 400, md: 300 },
                        maxWidth: { xs: 600, md: 600 },
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      src={
                        post.wallreactionimg !== null
                          ? `http://localhost:3000/img/${post.wallreactionimg}`
                          : post.wallreactionimgcurrent !== null
                            ? post.wallreactionimgcurrent
                            : undefined
                      }
                      alt="img"
                    ></Box>
                  )}
                  <Button
                    onClick={() => {
                      if (post.id !== undefined) dispatch(deletePost(post.id));
                    }}
                  >
                    Удалить
                  </Button>
                </Typography>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage;

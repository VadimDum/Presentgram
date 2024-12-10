import type { AxiosInstance } from 'axios';
import axiosInstance from './axiosInstance';
import type { AuthType } from '../schemas/authSchema';
import { backendAuthSchema, UserStatusEnum } from '../schemas/authSchema';

class AuthService {
  constructor(private readonly client: AxiosInstance) {}

  async login(formData: { email: string; password: string }): Promise<AuthType> {
    const response = await this.client.post('/auth/login', formData);
    console.log('formData в сервисе логина', formData);
    const authData = backendAuthSchema.parse(response.data);
    console.log('Запрос данных:', authData);
    return {
      ...authData,
      user: { ...authData.user, status: UserStatusEnum.logged },
    };
  }

  async signup(formData: { name: string; email: string; password: string }): Promise<AuthType> {
    const response = await this.client.post('/auth/signup', formData);
    console.log('formData в сервисе регистрации', formData);
    const authData = backendAuthSchema.parse(response.data);
    console.log('Запрос данных:', authData);
    return {
      ...authData,
      user: { ...authData.user, status: UserStatusEnum.logged },
    };
  }

  async check(): Promise<AuthType> {
    const response = await this.client.get('/tokens/refresh');
    console.log('response >>>>>>>', response);
    const authData = backendAuthSchema.parse(response.data);
    return {
      ...authData,
      user: { ...authData.user, status: UserStatusEnum.logged },
    };
  }

  async logout(): Promise<void> {
    return this.client
      .post('/auth/logout')
      .then((response) => {
        console.log('Логаут успешен:', response);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn('Путь для логаута не найден на сервере');
        } else {
          console.error('Ошибка при логауте:', error);
        }
      });
  }
}

const authService = new AuthService(axiosInstance);

export default authService;

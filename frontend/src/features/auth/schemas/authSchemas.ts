export interface FieldErrorMap {
  email?: string;
  password?: string;
  confirmPassword?: string;
  userName?: string;
  token?: string;
}

const EMAIL_REGEX = /\S+@\S+\.\S+/;

export const authSchemas = {
  login: (payload: { email: string; password: string }): FieldErrorMap => {
    const errors: FieldErrorMap = {};
    if (!payload.email || !EMAIL_REGEX.test(payload.email.trim())) {
      errors.email = 'Vui long nhap email hop le.';
    }
    if (!payload.password || payload.password.length < 6) {
      errors.password = 'Mat khau phai co toi thieu 6 ky tu.';
    }
    return errors;
  },

  register: (payload: { userName: string; email: string; password: string; confirmPassword: string }): FieldErrorMap => {
    const errors = authSchemas.login({ email: payload.email, password: payload.password });
    if (!payload.userName || !payload.userName.trim()) {
      errors.userName = 'Vui long nhap ten hien thi.';
    }
    if (!payload.confirmPassword || payload.confirmPassword.length < 6) {
      errors.confirmPassword = 'Vui long nhap lai mat khau.';
    } else if (payload.confirmPassword !== payload.password) {
      errors.confirmPassword = 'Mat khau nhap lai khong khop.';
    }
    return errors;
  },

  resetPassword: (payload: { token: string | null; password: string; confirmPassword: string }): FieldErrorMap => {
    const errors: FieldErrorMap = {};
    if (!payload.token) {
      errors.token = 'Link khong hop le.';
    }
    if (!payload.password || payload.password.length < 6) {
      errors.password = 'Mat khau toi thieu 6 ky tu.';
    }
    if (!payload.confirmPassword || payload.confirmPassword !== payload.password) {
      errors.confirmPassword = 'Mat khau nhap lai khong khop.';
    }
    return errors;
  },
};

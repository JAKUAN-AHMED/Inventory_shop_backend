import config from '../../config';

import { prisma } from '../../prisma/client';
import { ILoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { IUser } from '../User/user.interface';
import { createToken, verifyToken } from './auth.utils';
import AppError from '../../errors/AppError';
import { sendPasswordResetEmail } from '../../helpers/emailSender/emails';

const register = async (payload: IUser) => {
  // Hash the password
  const password = await bcrypt.hash(
    payload.password,
    Number(config.salt_round),
  );

payload.password=password;
console.log(payload,'checking paylod');
  // Create the user
  const result = await prisma.user.create({
    data: {...payload}
  })
  return result;
};



const login = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      email:true,
      id: true,
      name: true,
      password:true,
      role: true
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Invalid credentials');
  }
  const JwtPayload={
    email:user.email,
    role: user.role
  }


  const accessToken=await createToken(JwtPayload,config.access_token_secret as string,config.access_token_expires);
  return accessToken;
};


const forgotPassword = async (email: string) => {

  if (!email) {
    throw new Error('Email is required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User not found with this email');
  }
  
  const token = crypto.randomBytes(32).toString('hex');
  const link = `${config.live_url}/reset-password?email=${email}&token=${token}`;
  const res = await sendPasswordResetEmail(email, link);

  return res;
};

export const resetPassword = async (
  email: string,
  token: string,
  password: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User not found with this email');
  }


  const hashedPassword = await bcrypt.hash(password, Number(config.salt_round));

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User not found with this email');
  }

  const isPasswordMatched: boolean = await bcrypt.compare(
    oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Invalid credentials password not matched!');
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.salt_round),
  );

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }
  const decoded = verifyToken(
    refreshToken,
    config.refress_token_secret as string,
  );

  if (!decoded) {
    throw new Error('Invalid or expired refresh token!');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw new Error('User not found with this refresh token');
  }

  const JwtPayload = {
    email: user.email,
  };
  const accessToken = createToken(
    JwtPayload,
    config.access_token_secret as string,
    Number(config.access_token_expires),
  );

  return { accessToken };
};


interface IMakeAdmin {
  name: string;
  password: string;
  email: string;
  phone: string;

}

const makeAdmin = async (payload: IMakeAdmin) => {
  const { name, email, password, phone } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    throw new AppError(400, 'User already exists with this email');
  }

  const result = await prisma.user.create({
    data: {
      name,
      email,
      role:"ADMIN",
      password: await bcrypt.hash(password, Number(config.salt_round)),
      phone
    },
  });

  return result;
};

export const AuthServices = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  makeAdmin,
};

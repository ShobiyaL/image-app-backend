import bcrypt from 'bcryptjs';

export const encryptFunc = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPasssword = await bcrypt.hash(plainTextPassword, salt);
  return hashedPasssword;
};

export const decryptFunc = async (plainTextPassword, hashedPasssword) => {
  const result = await bcrypt.compare(plainTextPassword, hashedPasssword);
  return result ? true : false;
};

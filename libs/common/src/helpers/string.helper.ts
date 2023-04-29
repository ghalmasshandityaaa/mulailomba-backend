export const GenerateRandomCode = (length: number) => {
  let token = '';
  for (let i = 0; i < length; i++) {
    token = token + Math.floor(Math.random() * (9 - 1 + 1) + 1);
  }

  return token;
};

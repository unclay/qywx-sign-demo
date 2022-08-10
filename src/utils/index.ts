export const randomString = (length = 32) => {
  const stringPool = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const stringPoolLength = stringPool.length;
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += stringPool.charAt(Math.floor(Math.random() * stringPoolLength));
  }
  return result;
};
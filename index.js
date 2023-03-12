const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file 🤕');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err);
      resolve('File written ✏️');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    await writeFilePromise(`${__dirname}/dog-image.txt`, res.body.message);
    console.log(`File written 👍`);
  } catch (err) {
    throw `Error ❌: ${err.message}`;
  }

  return '2: Ready 🐶';
};

(async () => {
  try {
    console.log('1: Will get dog pic ⏲');
    const result = await getDogPic();
    console.log(result);
    console.log('3: Got dog pic 📷');
  } catch (err) {
    console.log(`Error ❌: ${err.message}`);
  }
})();

// readFilePromise('./dog.txt')
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePromise('./dog-image.txt', res.body.message);
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(`Error ❌: ${err.message}`);
//   });

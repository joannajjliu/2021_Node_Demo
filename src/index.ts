import express from 'express';

const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});
app.listen(port, () => {
  try {
    return console.log(`server is listening on ${port}`);
  } catch {
    return console.log(`opps, failed`);
  }
}); 
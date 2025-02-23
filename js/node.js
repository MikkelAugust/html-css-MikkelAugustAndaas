const express = require('express');
const app = express();

app.delete('/blog/posts/:name/:id', (req, res) => {
  const { name, id } = req.params;
  
  console.log(`Request to delete post with name: ${name} and id: ${id}`);

  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
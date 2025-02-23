const express = require('express');
const app = express();

// DELETE /blog/posts/:name/:id
// Deletes a post based on its id.
app.delete('/blog/posts/:name/:id', (req, res) => {
  const { name, id } = req.params;
  
  // TODO: Add your deletion logic here.
  // For example, if you're using a database, find and delete the post by id.
  console.log(`Request to delete post with name: ${name} and id: ${id}`);

  // If deletion is successful, send a 204 No Content response.
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

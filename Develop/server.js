const express = require('express');
const path = require('path'); //for working with file paths

const app = express();  //create an Express application

app.get('/notes', (req, res) => {
    const notesFilePath = path.join(__dirname, 'public', 'notes.html');
    res.sendFile(notesFilePath);
});

app.get('*', (req, res) => {
    const indexFilePath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexFilePath);
})

app.get('/api/notes', (req, res) => {
    //read the db.json file an return all saved notes as JSON
})

app.post('/api/notes', (req, res) => {
    // receive a new note to save on the request body, add it to the db.json file, 
    //and then return the new note to the client. You'll need to find a way to give 
    //each note a unique id when it's saved (look into npm packages that could do this for you).
})


//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
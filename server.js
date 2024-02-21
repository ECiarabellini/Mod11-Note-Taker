const express = require('express');
const path = require('path'); //for working with file paths
const fs = require('fs');
const util = require('util');
const uuid = require('uuid');


const app = express();  //create an Express application
app.use(express.json()); //body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//start the server
const PORT = process.env.PORT || 3000;

//GET notes API path
app.get('/api/notes', (req, res) => {
    //read the db.json file an return all saved notes as JSON
    fs.readFile('db/db.json','utf8',(err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);
            res.json(parsedNotes);
        }
    });
});

//POST notes API path
app.post('/api/notes', (req, res) => {
    // receive a new note to save on the request body, add it to the db.json file, 
    //and then return the new note to the client.
    console.info(`${req.method} request received to add a note`);   // Log that a POST request was received
    const {title, text} = req.body;
    const newNote = {
        id: uuid.v4(),
        title: title,
        text: text
    }

    if(!newNote.title || !newNote.text){
        return res.status(400).json('Please include note title and text.')
    }

// Obtain existing notes
fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data); // Convert string into JSON object
            parsedNotes.push(newNote);            // Add the new note
    
            // Write updated notes back to the file
            fs.writeFile('db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
                writeErr
                ? console.error(writeErr)
                : res.send(newNote), console.info('Successfully updated notes!')
            );
        }
    });
});

app.delete('/api/notes/:noteID', (req, res) => {
    console.log('Request received to delete note ID: ', req.params.noteID)
    const idToDelete = req.params.noteID;
    // Obtain existing notes
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data); // Convert string into JSON object
            console.log('parsedNotes before', parsedNotes);
            const newList = parsedNotes.filter(note => note.id !== idToDelete);   // delete the specified note
            console.log('after', newList);

            // Write updated notes to the file
            fs.writeFile('db/db.json',
            JSON.stringify(newList, null, 4),
            (writeErr) =>
                writeErr
                ? console.error(writeErr)
                : res.send(newList), console.info('Successfully deleted note')
            );
        }
    });

});

//GET Notes HTML path
app.get('/notes', (req, res) => {
    const notesFilePath = path.join(__dirname, './public/notes.html');
    res.sendFile(notesFilePath);
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'))
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
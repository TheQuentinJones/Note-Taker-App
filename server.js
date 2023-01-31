const express = require('express');
const path = require('path');
const fs = require('fs')
// const uuid = require('./helpers/uuid');
const uuid = require('./helper/uuid');

const port = process.env.PORT || 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET Route for feedback page
app.get('/notes', (req, res) => {
    
    res.sendFile(path.join(__dirname, '/public/pages/notes.html'));
});

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {

    res.sendFile(path.join(__dirname, './db/db.json')); 
});
//Write to File
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
// Read and Append
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };
// POST Route for a new note
app.post('/api/notes', (req, res) => {

    const { title, text } = req.body

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }; 

        console.log(newNote)

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully 🚀`);

    } else {

        res.error('Error in adding note')
    }    
})

app.delete('/api/notes/:id', (req, res) => {
    res.send("DELETE Request Called")

    const {id} = req.params;
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {

        
        if (err) {
          console.error(err);
        } else {
          const parsedData = JSON.parse(data);
            //   console.log(parsedData)
        

            for (let i = 0; i < parsedData.length; i++) {
	    
	            if (err) {
                     console.error(err);   
                } else if (parsedData[i].id === id) {
	            parsedData.splice( i, 1 )
                    
                writeToFile('./db/db.json', parsedData)
	            }                
                

            }

        }
    
    })
     


    
    
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});



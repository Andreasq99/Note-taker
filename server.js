const fs = require('fs');
const express = require('express');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/notes', (req,res)=>{
    fs.readFile('./public/notes.html','utf-8',(err,data)=>{
        if(err){console.log(err);}
        res.send(data);
    });
});

app.get('/api/notes',(req,res)=>{
    fs.readFile('./db/db.json','utf-8',(err,data)=>{
        if(err){console.log(err);}
        res.send(data);
    });
});

app.post('/api/notes', (req,res)=>{
    const newNote = req.body;
    newNote.id=uuid.v1();
    const dbArr = '';
    fs.readFile('./db/db.json','utf-8',(err,data)=>{
        if(err){console.log(err);}
        dbArr = JSON.parse(data);
    });
    dbArr.push(newNote);
    fs.writeFile('./db/db.json',JSON.stringify(dbArr),(err)=>{
        if(err){console.log(err);}
        else{console.log('Successfully added new note!');}
    });
});

app.get('*', (req,res)=>{
    fs.readFile('./public/index.html','utf-8',(err,data)=>{
        if(err){console.log(err);}
        res.send(data);
    });
});



app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
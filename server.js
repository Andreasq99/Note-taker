const fs = require('fs');
const express = require('express');
const uuid = require('uuid');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));


app.get('/notes', async (req,res)=>{
    //const data = await rw.read('./public/notes.html');
    //const data = await fs.readFileSync('./public/notes.html');
    //console.log(data);
    res.sendFile(path.join(__dirname,'/public/notes.html'));
});

app.get('/api/notes', async(req,res)=>{
    //const data = await rw.read('./db/db.json');
    //console.log(data);
    //res.send(data);
    res.sendFile(path.join(__dirname,'/db/db.json'));
});

app.post('/api/notes', async (req,res)=>{
    /* const newNote = req.body;
    newNote.id=uuid.v1();
    var dbArr = [];
    rw.read('./db/db.json')
    .then((dbTxt)=>{
        console.log('dbTxt: '+dbTxt);
        dbArr = JSON.parse(dbTxt);
        dbArr.push(newNote);
        return JSON.stringify(dbArr);
    })
    .then((dbTxt)=>{
        rw.write(dbTxt);
    })
    .then(()=>{res.send('Successfully added new note!')});
     */

    const newNote = req.body; 
    newNote.id = uuid.v1();
    var dbArr = [];
    fs.readFile('./db/db.json', 'utf-8', (err,data)=>{
        if(err){console.log(err)}
        dbArr = JSON.parse(data);
        dbArr.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(dbArr),(err)=>{
            if(err){console.log(err)}
            else{console.log('Successfully added a new note!')}
            
        });
    });

//    await fs.readFile('./db/db.json','utf-8',(err,data)=>{
//        if(err){console.log(err);}
//        dbArr = JSON.parse(data);
//        console.log(dbArr);
//        dbArr.push(newNote); 
//        fs.writeFile('./db/db.json',JSON.stringify(dbArr),(err)=>{
//            if(err){console.log(err);}
//            else{console.log('Successfully added new note!');}
//            });
//    });
//    .then(()=>{
//    })
//    .then(()=>{
//    });
//    res.send('Successfully added new note!');
});

app.delete('/api/notes/:id',async (req,res)=>{
    /* const dbTxt = await rw.read('./db/db.json');
    const dbArr = JSON.parse(dbTxt);
    var index = -1;
    for(var i = 0; i<dbArr.length;i++){
        if(req.params.id == dbArr[i]){
            index = i;
        }
    }
    await req.dbDelete(index);
    return 'Successfully deleted the note!'; */

    fs.readFile('./db/db.json', 'utf-8', (err,data)=>{
        if(err){console.log(err)}
        const dbArr = JSON.parse(data);
        var index = -1;
        for(i=0;i<dbArr.length;i++){
            if(dbArr[i].id === req.params.id){
                index = i;
            }
        }
        if(index === -1){
            console.log('Could not find note!');
            return;
        }
        dbArr.splice(index,1);
        fs.writeFile('./db/db.json', JSON.stringify(dbArr),(err)=>{
            if(err){console.log(err)}
            else{console.log(`Successfully deleted note ${req.params.id}!`)}
            
        });
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
  
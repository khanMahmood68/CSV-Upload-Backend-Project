// Using multer for file upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Using csv-parser to convert the data into JSON format
const csv = require('csv-parser')
// Array containig the names of the uploaded files
const uploadedFileNames = []


// Setting up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Setting the destination folder for uploaded files
      cb(null,path.join(__dirname,'../', '/uploads'));
    },
    filename: (req, file, cb) => {
      // Setting the filename for uploaded files
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.originalname + '-' + uniqueSuffix);
    },
  });

//   Creating a file filter function to accept only CSV files
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
        cb(null, true); // Accept the file
        } else {
        cb(new Error('Only CSV files are allowed'), false); // Reject the file
        }
    };
  
    // Initializing multer
    const upload = multer({storage:storage,fileFilter:fileFilter}).single('uploaded_file');

    // For uploading the file to the uploads folder
    module.exports.upload = (req, res)=>{
        upload(req, res, (err)=>{
            if(err instanceof multer.MulterError){
                console.log("****Multer error",err);
                return;
            } else if(err){
                console.log('multer error',err);
                return;
            }else if(req.file){
                uploadedFileNames.push(req.file.filename);
            }return res.redirect('back')
        })
    }

    // Exporting Array
    module.exports.uploadedFileNames = ()=>{
        return uploadedFileNames;
    }

    // For opening the csv file and display it's content in a tabular form
    module.exports.open = (req, res)=>{

        // Array  which stores the data in JSON format
        const csvParsedData = [];
        const index = req.query.index;

        //seeting up the path for file upload
        fs.createReadStream(path.join(__dirname,'../','/uploads',uploadedFileNames[index])) 
        .pipe(csv())
        .on('data', (data) => csvParsedData.push(data))
        .on('end', () => {

          return res.render('tabular_view',{
            title:'CSV Reader | Tabular',
            csvData: csvParsedData
          });
        });
    }

    // For deleting a particular csv file
    module.exports.delete = (req, res)=>{
      let index = req.query.index;
      try { var files = fs.readdirSync(path.join(__dirname,'..','/uploads')); }
    catch(e) { return; }
    if (files.length > 0){
        var filePath = path.join(__dirname,'..','/uploads',uploadedFileNames[index]);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
    }
    uploadedFileNames.splice(index,1);
    return res.redirect('back');
    }


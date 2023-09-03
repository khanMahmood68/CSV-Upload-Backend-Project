const fileController = require('./file_controller');


const uploadedFileNames = fileController.uploadedFileNames;
// Array containig the csv filename
const array = uploadedFileNames()


module.exports.home = (req, res)=>{
    return res.render('home',{
        title:'CSV Upload Homepage',
        files:array
    })
}
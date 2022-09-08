import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network portmn.
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  app.get("/filteredimage/", async( req , res) => {
let {image_url}=req.query;
console.log(image_url);
const invalidurl=image_url.match(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/);
if (invalidurl==null){
  return res.status(400).send("invalid url try again");
}
if (!image_url){
  return res.status(400).send("invalid url");
}
else {
try{
  const filterimg=await filterImageFromURL(image_url);
  if (filterimg===undefined||filterimg===null){
    return res.status(400).send("filtering image failed");
  }
  else{
    res.status(200).sendFile(filterimg +'');
    res.on('finish',() => deleteLocalFiles([filterimg]));  
    
  }
} catch (error) {
  return res.status(400).send("filtering image failed");
} 
}
});
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
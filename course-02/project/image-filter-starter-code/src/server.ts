import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    let { image_url } = req.query;
    if ( !image_url ) {
      return res.status(400).send(`Url is required`);
    }
    let filteredPath: string;
    try {
      filteredPath = await filterImageFromURL(image_url);
    } catch (error) {
      return res.status(422).send(`Image not available for processing`);
    }
    res.status(200).sendFile(filteredPath, async() => {
      await deleteLocalFiles ([ filteredPath ]);
    });
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
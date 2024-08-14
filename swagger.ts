// import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerAutogen from 'swagger-autogen';
import * as swaggerFile from './swagger-output.json';

const options = {
    info: {
        title: 'Web Automator API',
        description: "API endpoints for the Web Automator",
        version: '1.0.0',
    },
    host: `localhost:5000`,
    basePath: "/",
    apis: ['./router/*.js'],
}
const outputFile = './swagger-output.json';
const routes = ['./server.js'];
swaggerAutogen()(outputFile, routes, options);


function swaggerDocs(app, port) {
    // Serve Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerFile)
    })
    console.log(`Swagger docs available at http://localhost:${port}/docs`)
}


export default swaggerDocs
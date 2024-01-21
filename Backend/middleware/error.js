const generateErrorPage = (message) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AutoAid - Page Not Found</title>
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    background-color: #f8f8f8;
                    color: #fff;
                    text-align: center;
                    margin: 35vh auto;
                }
                h1 {
                    color: black;
                }
                h2 {
                    color: grey;
                }
            </style>
        </head>
        <body>
            <h1>AutoAid</h1>
            <h2>${message}</h2>
        </body>
        </html>
    `;
};

module.exports = generateErrorPage;
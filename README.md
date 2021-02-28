# Pogoda24/7

![Logo](https://github.com/MBelniak/pogoda24/blob/master/frontend/src/public/src/img/logo-wHalo.png)

### Official website of Pogoda24/7 FB page.

Weather forecasts, warnings, articles and more to come in the future.

##### Visit at [e-pogoda24.info](https://www.e-pogoda24.info)
##### Facebook: [https://www.facebook.com/Polska24nadobe](https://www.facebook.com/Polska24nadobe)
##### Instagram: [https://www.instagram.com/pogoda24_7](https://www.instagram.com/pogoda24_7)
##### GMail: [epogoda24@gmail.com](mailto:epogoda24@gmail.com)

### For contributors:

If you want to contribute, please reach me through [my GitHub email](mailto:belniakm@wp.pl) or [epogoda24@gmail.com](mailto:epogoda24@gmail.com).<br>

Requirements:
Java 1.8, Maven

The project consists of two main modules: frontend and backend (what a surprise).
To build the whole project run ```mvn clean install``` in root directory.

The backend module is a simple Spring Boot project communicating with Firestore via Firebase SDK.
Nothing special there and I don't think there is a reason to explain anything.
To run the server, run ```mvn spring-boot:run``` in backend directory. Server will run on port 8080.

The frontend module uses React library, TypeScript library and Webpack for bundling. 
It is split into two parts: public and admin. These parts are separate bundle entries, with separate HTML files - all taken care by Webpack.
To run webpack devServer run ```npm start``` in frontend directory. Application will start on port 3000.
With that, you don't have to authenticate to admin pages.

Unfortunately, now there is no non-production database, so connection with db does not work without specific files.
I hope to change it soon.


# Con-Planner

* Con-Planner is a web application that allows organizers to let game masters add their games and users to sign up to those games. Maximum number of signups can be set for each game. There can be multiple conventions. 

* The technologies are selected to allow the application to be hosted for free by being under the free tier limits of all it's services.

* Ideally all vendor-locking technologies should be avoided so that it can be easily hosted on the currently free platform. The application should be able to be hosted on any platform that supports NodeJS and MongoDB.



<img src="readme_image.png" alt="Con-planner in action" width="70%" height="auto"/>




## Entities

1. Convention (Con) - A convention that has multiple games
2. Game - A game that is played at a convention. Game can have multiple signups.
3. Signup - A sign up for a game

## There are no users or accounts

To avoid the need for usser accounts the application uses a resource creation time set delete-password. This password is used to delete the resource. By default the delete-password is swordfish in honor of the really bad movie.

## Avoiding the need to collect user information

Player nicknames are used to sign up to games. This allows the user to avoid giving out their real name or any identifiable information.

## The app uses Atlas Mongo DB

The connection string is set in the environment variable MONGODB_URI. The demosite is hosted by Render.com and uses Atlas Mongo DB from whitelisted Reader addresses.

## Setting up your own Render hosted NodeJS-instance

1. Fork your own repo.
2. Create a new project in Render.com.
3. Create Atlas Mongo DB account.
4. Create a new database in Atlas Mongo DB.
5. Create a new user in Atlas Mongo DB.
6. Whitelist the IP address of your Render.com instance.
7. Set the environment variable MONGODB_URI to the connection string of your Atlas Mongo DB instance.

## Setting up your own Render hosted NodeJS-instance with Docker

Instead of pointing Render.com to your repo, you can point Render.com to your Docker image. In the advanced section add your MONGODB_URI connection string as an environment variable.

## Running the app locally

1. Clone the repo.
2. Install the dependencies.
3. Set the environment variable MONGODB_URI to the connection string of your Atlas Mongo DB instance.
4. Run the app with node.

## Issues and todos

* Salt the resource level delete-passwords
* Add tests that cover the main MVP features
* Add Discord bot to notify game masters of signups
* Add Discord bot to notify users of new games
* Add install instructions to more NodeJS / MongoDB free-tier platforms

## Deploying to Azure App Service

I found the the best way to accomplish this was to use docker. Running docker build locally and then pushing the image to Azure Container Registry. Then using the Azure App Service deployment center to deploy the image to the App Service. 

Visual Studio Code has a nice Docker and Azure App Service extensions that makes it easy to set up. After the Docker image is pushed into Azure Container Registry you can right click the image in Docker extension and select to push it to Azure App Service. After that it is mostly about whitelisting the outbound IP addresses to Mongo DB.

However without the free-tier eligibility these settings seemed to start making actual charges (0.2 Euros before I stopped them). 


So I decided to stay with Render.com.Seems like most of the costs were from API Management. Maybe there is some way to avoid those.

<img src="readme_image_azure.png" alt="Costs from Azure" width="20%" height="auto"/>


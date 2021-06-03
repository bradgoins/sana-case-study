# Getting Started

This project is intended to run in a docker environment, so `docker` and `docker-compose` will need to be installed. The UI and API can be run outside of docker but it will not be covered in this readme. For addtional information about `docker-compose` please see the online documentation `https://docs.docker.com/compose/`.

Open the project in terminal. Enter the command `docker-compose up`

Docker will starup 3 services.

1. A MongoDB services which will run on port `270171`
2. A NodeJS service which will run on port `3001`
3. A React app which will ron on port `3000`

Each of these ports will need to be available.

To open the app on the host machine enter `http://localhost:3000` in a browser

# Additional Notes
The intention of this app is to provide a demonstration of a general implementation pattern and coding patterns. Due to the expected timeframe there are areas that would be considered incomplete and not production ready. 


## Work that has been done
- There are 4 pages that have been stood up
    1. Login Screen
    2. Signup Screen
    3. Profile Screen
    4. Tool Screen
- Theming is generated automatically via materials
- Components are pulled from a Material library `https://material-ui.com/`
- Email accounts must be unique and must follow typical email formats. This is enforce anywhere an email address is used.
- When logging in a Bearer token is generated and required for any additional communication with the API
- If a token is not present the user is redirected to the Login page.
- The user information is currently stored in memory
- The profile screen allows the user to update thier name, email and password.
- The tool screen allows a user to set location and threashold. When they apply those settings the data is stored with their profile and the message is updated to reflect their settings.
    - The message is also updated to reflect the user preferences when it first loads
    - There are 3 different types of messages
        1. Info - Showed if they having endered the needed information. It provideds a brief set of instructions.
        2. Success - Showed if the air quality is below their threshold.
        3. Warning - Showed if the air quality is above their threshold
        4. Error - Shoed if they enter a Location that doesn't exist. 
- Portions of the API were pulled from a previous project to move more quickly.
    - Database connections and framework
    - Resource class that provides some advanced searching. The requirements of this app doesn't leverage all the features, but those include pagination, sorting, and grouping filters to apply AND/OR behaviors in combination.

## Work that needs to be done
- No automated testing has be set up. A full testing suite needs to be implemented.
- There are a number of package dependencies that need to be updated for security patches.
- There is some performance tuning that needs to happen.
    - There are a couple extra api calls made due to rendering behavior
    - There are a couple cases of data being updated outside of the component lifecycle which causes a console error and is flagged as a potential memory leak. The user doesn't appear to be impacted by this.
- There are a couple warnings in the console that needs to be resolved, but it doesn't impact the user experience
- There is room for some refactoring to clean up duplicate code.
- If "session" behavior is desired then logic would need to be implemented to store the token in Local or Session storage and used to collect user information on refresh or reload
- The token that is provided for `https://aqicn.org/api/` is currently stored and used in the UI. For security reasons it would be good to store that token in the API and make the calls to `https://aqicn.org/api/` though the NodeJS service, and set up an endpoint for the ui to call that would envoke that request via the API.
- Threshold doesn't for numberic values. Validation or enforcement needs to be implemented.
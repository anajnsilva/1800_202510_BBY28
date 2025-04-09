
# Project Name
BeCool

## Overview
Our team BBY28, is developing an application that allows users to visualize the contents of a community fridge from the comfort of their homes, and edit contents from within a specified radius of distance from the fridge, helping to remove blockers that hold people back from visiting community fridges.

---

## Features

- Browse fridges and look at their contents!
- Get directions to any fridge in the lower mainland
- Favorite fridge to easily find them later
---

## Technologies Used

Example:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase for hosting, JavaScript
- **Database**: Firestore
- **API**: MapBox API

---

## Usage
s
Example:
1. Open your browser and visit `https://becool-bby28.web.app/`.
2. Create an account 
3. Browse fridges near you! (in lower mainland)
4. Select "see fridge" to view its contents
5. Allow users to donate/take items from fridges virtually when within 2 km of it physically
6. Get directions to a fridge!


---

## Project Structure


```
C:.
|   .gitignore
|   aboutus.html
|   before_login.html
|   contents.html
|   favourites.html
|   fridgebrowse.html
|   landingpage.html
|   login.html
|   map.html
|   profile.html
|   README.md
|   template.html
|
+---.vscode
|       launch.json
|       settings.json
|
+---images
|       AboutUsCommunityFridge.jpg
|       becoolgs.png
|       bell.png
|       DEF.png
|       f1.png
|       f2.png
|       favicon.ico
|       favourite-heart-after.png
|       favourite-heart-before.png
|       foodguide.png
|       Fridge1.jpg
|       Fridge2.jpg
|       Fridge3.jpeg
|       he-was-forced-to.gif
|       heart.png
|       home.png
|       KCCF.png
|       KF.png
|       KitF.png
|       MPF.png
|       RPF.png
|       setting.png
|       user.png
|       WPGF.png
|
+---scripts
|       authentication.js
|       contents.js
|       favourites.js
|       firebaseAPI_BBY28.js
|       fridgebrowse.js
|       landingpage.js
|       map.js
|       notifications.js
|       profile.js
|       script.js
|       skeleton.js
|
+---styles
|       style.css
|
\---text
        footer.html
        footer_before_login.html
        nav_after_login.html
        nav_before_login.html
```

---

## Contributors
- Wynn Le
- Ana Silva
- Luka Poledica

---

## Acknowledgments

Example:
- Map data sourced from [MapBox](https://www.mapbox.com/).
- Code snippets for geolocational distance algoirthm were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- Icons sourced from [flaticon]https://www.flaticon.com/uicons/interface-icons

---

## Limitations and Future Work
### Limitations

- Currently donation input is textbox, so it doesnt allow for shift of quantity,
- When taking, you can only take the full amount and not a partial amount.
- MapBox routes break when laitude is above/below +-90 latitude respectively.
- Bcit scrambles IP, which messes with geolocational algorithm

### Future Work

- Implement a food item database, so that users select from existing items and can only edit the quantity
- Allow for notifications when items are removed from fridge
- Sort fridge based on distance
- Adding shelf life


---

## License

Example:
This project's license is NOLICENSE

CMPUT404-project-socialdistribution
===================================


### The Project is also deployed on Heroku at:
[Frontend](https://cmput404-project-socialdistribution.herokuapp.com/)

[Backend](https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/swagger)

### Demo [Video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

##### This project was created for the course CMPUT 404 following a set of [requirements](https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org) 
## Setup
> Install the packages for the Django backend

```shell
pip install -r requirements.txt
python manage.py migrate
```

> Install the packages the Vite+React frontend

```
npm i
```

> Run the frontend and backend concurrently

```
cd frontend
npm run dev
```

```
cd backend
cd socialdistribution
python manage.py runserver
```





Contributors / Licensing
========================

Authors:
    
* Gabriel Giang
* Jake Hennig
* Kai Jie Lee
* Jack Geiger
* Caleb Lonson

Copyright 2023 Gabriel Giang, Jake Hennig, Kai Jie Lee, Jack Geiger, and Caleb Lonson

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

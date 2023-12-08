CMPUT404-project-socialdistribution
===================================
#### Warnings
Running too many instances of the app might cause Heroku to crash. If this happens, please wait a few minutes and try again. If components are missing/not rendering, refresh the page.

SOME PICTURES USED IN POSTS ARE FROM (https://picsum.photos/200), WHICH IS A RANDOM IMAGE GENERATOR, THIS COULD CAUSE SOME IMAGES TO CHANGE UPON REFRESH

### The Project is also deployed on Heroku at:
[Frontend](https://packet-pirates-frontend-46271456b73c.herokuapp.com/)

[Backend](https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/swagger/)

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

## User Stories Progress

   - :white_check_mark: As an author I want to make public posts.
   - :white_check_mark: As an author I want to edit public posts.
   - :white_check_mark: As an author, posts I create can link to images.
   - :white_check_mark: As an author, posts I create can be images.
   - :white_check_mark: As a server admin, images can be hosted on my server.
   - :white_check_mark: As an author, posts I create can be private to another author
   - :white_check_mark: As an author, posts I create can be private to my friends
   - :white_check_mark: As an author, I can share other author's public posts
   - :white_check_mark: As an author, I can re-share other author's friend posts to my friends
   - :white_check_mark: As an author, posts I make can be in simple plain text
   - :white_check_mark: As an author, posts I make can be in CommonMark
   - :white_check_mark: As an author, I want a consistent identity per server
   - :white_check_mark: As a server admin, I want to host multiple authors on my server
   - :white_check_mark: As a server admin, I want to share public images with users
     on other servers.
   - :white_check_mark: As an author, I want to pull in my github activity to my "stream"
   - :white_check_mark: As an author, I want to post posts to my "stream"
   - :white_check_mark: As an author, I want to delete my own public posts.
   - :white_check_mark: As an author, I want to befriend local authors
   - :white_check_mark: As an author, I want to befriend remote authors
   - :white_check_mark: As an author, I want to feel safe about sharing images and posts
     with my friends -- images shared to friends should only be
     visible to friends. [public images are public]
   - :white_check_mark: As an author, when someone sends me a friends only-post I want to
     see the likes.
   - :black_square_button: As an author, comments on friend posts are private only to me the
     original author.
   - :white_check_mark: As an author, I want un-befriend local and remote authors
   - :white_check_mark: As an author, I want to be able to use my web-browser to manage
     my profile
   - :white_check_mark: As an author, I want to be able to use my web-browser to manage/author
     my posts
   - :white_check_mark: As a server admin, I want to be able add, modify, and remove
     authors.
   - :white_check_mark: As a server admin, I want to OPTIONALLY be able allow users to sign up but
     require my OK to finally be on my server
   - :white_check_mark: As a server admin, I don't want to do heavy setup to get the
     posts of my author's friends.
   - :white_check_mark: As a server admin, I want a restful interface for most operations
   - :white_check_mark: As an author, other authors cannot modify my public post
   - :white_check_mark: As an author, other authors cannot modify my shared to friends post.
   - :white_check_mark: As an author, I want to comment on posts that I can access
   - :white_check_mark: As an author, I want to like posts that I can access
   - :white_check_mark: As an author, my server will know about my friends
   - :white_check_mark: As an author, When I befriend someone (they accept my friend request) I follow them, only when
     the other author befriends me do I count as a real friend -- a bi-directional follow is a true friend.
   - :white_check_mark: As an author, I want to know if I have friend requests.
   - :white_check_mark: As an author I should be able to browse the public posts of everyone
   - :white_check_mark: As a server admin, I want to be able to add nodes to share with
   - :white_check_mark: As a server admin, I want to be able to remove nodes and stop
     sharing with them.
   - :white_check_mark: As a server admin, I can limit nodes connecting to me via
     authentication.
   - :white_check_mark: As a server admin, node to node connections can be authenticated
     with HTTP Basic Auth
   - :white_check_mark: As a server admin, I can disable the node to node interfaces for
     connections that are not authenticated!
   - :white_check_mark: As an author, I want to be able to make posts that are unlisted,
     that are publicly shareable by URI alone (or for embedding images)

## API Documentation

The API documentation is done via SWAGGER and can be found [here](https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/swagger)

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

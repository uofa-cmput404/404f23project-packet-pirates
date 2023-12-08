from django.test import TestCase
from login.models import AppAuthor
from post.models import *
from django.contrib import auth
from django.contrib.auth.models import User, Permission
from rest_framework.authtoken.models import Token
import json
# Create your tests here.

# Test make post
# Test get posts of author by username
# Test get author feed by username
# Test get author feed by id
class PostTests(TestCase):
    def setUp(self):
        
        #Create user
        tempAuthor = AppAuthor.objects.create_user('CMPUT404', 'cmput404')
        tempAuthor.is_staff = True
        tempAuthor.is_superuser = False
        tempAuthor.is_active = True
        tempAuthor.save()
        self.token, created1 = Token.objects.get_or_create(user=tempAuthor)

        author1 = AppAuthor.objects.create(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.create(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.create(username="Tester3", password = "PassTester3")

        textPost = Post.objects.create(author = author1, title = 'testPost1', is_private = False, url = None, likes_count = 2,
                                    content_type = ('text/plain', 'plaintext'), content = 'test', 
                                    source = None, origin = None, image_file = None, image_url = None, unlisted = False)
        
        imagePost = Post.objects.create(author = author2, title = 'testPost2', is_private = False, url = None, likes_count = 0,
                                    content_type = ('text/plain', 'plaintext'), content = 'test', 
                                    source = None, origin = None, image_file = None, image_url = "https://picsum.photos/200", unlisted = False)
        
        unlistedPost = Post.objects.create(author = author3, title = 'testPost3', is_private = False, url = None, likes_count = 0,
                                    content_type = ('text/plain', 'plaintext'), content = 'test', 
                                    source = None, origin = None, image_file = None, image_url = None, unlisted = True)
        
    #Check cannot get posts without auth
    def testPostAuth(self):

        author = AppAuthor.objects.get(username="Tester1", password = "PassTester1")
        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author.user_id) + '/authorposts')
        self.assertEqual(response.status_code, 401)

    #Check each test post exists in the database
    def testPostsExist(self):
        self.assertEquals(Post.objects.get(title = 'testPost1').title, "testPost1")
        self.assertEquals(Post.objects.get(title = 'testPost2').title, "testPost2")
        self.assertEquals(Post.objects.get(title = 'testPost3').title, "testPost3")

    #Check each test post obtainable from API when authenticated by user id
    def testPostsGetByAuthorID(self):
        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        author1 = AppAuthor.objects.get(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.get(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.get(username="Tester3", password = "PassTester3")

        response1 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author1.user_id) + '/authorposts',
                                    **headers)
        response2 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author2.user_id) + '/authorposts',
                                    **headers)
        response3 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author3.user_id) + '/authorposts',
                                    **headers)

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.status_code, 200)


    #Check each test post obtainable from API when authenticated by username
    def testPostsGetByAuthorUsername(self):

        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        author1 = AppAuthor.objects.get(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.get(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.get(username="Tester3", password = "PassTester3")

        response1 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author1.username) + '/feedposts_byusername',
                                    **headers)
        response2 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author2.username) + '/feedposts_byusername',
                                    **headers)
        response3 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author3.username) + '/feedposts_byusername',
                                    **headers)

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.status_code, 200)

    #Check GetFeedPosts view
    def testGetFeed(self):

        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        author1 = AppAuthor.objects.get(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.get(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.get(username="Tester3", password = "PassTester3")

        response1 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author1.user_id) + '/feedposts',
                                    **headers)
        response2 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author2.user_id) + '/feedposts',
                                    **headers)
        response3 = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(author3.user_id) + '/feedposts',
                                    **headers)

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.status_code, 200)


    #Test Create Post through Posting to API
    def testCreatePost(self): 

        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        author1 = AppAuthor.objects.get(username="Tester1", password = "PassTester1")

        data = {
            "author" : author1,
            "title" : 'testPost4',
            'content_type' : 'text/plain',
            'image_file': '',
            'image_url': "http://picsum.photos/200/300",
            'content' : 'test',
        }

        response = self.client.post('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/postViews', data,
                                    **headers)

        self.assertEqual(response.status_code, 201)

        self.assertEquals(Post.objects.get(title = 'testPost4').title, "testPost4")

    # Add EditPost, DeletePosts, through API once they are implemented
    def testDeletePost(self): 

        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        author1 = AppAuthor.objects.get(username="Tester1", password = "PassTester1")

        data = {
            "author" : author1,
            "title" : 'testPost4',
            'content_type' : 'text/plain',
            'image_file': '',
            'image_url': "http://picsum.photos/200/300",
            'content' : 'test',
        }

        response = self.client.post('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/postViews', data,
                                    **headers)

        self.assertEqual(response.status_code, 201)

        post_object = Post.objects.get(title = 'testPost4')
        self.assertEquals(post_object.title, "testPost4")

        response = self.client.delete('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/' + str(post_object.post_id) + '/postViews',
                                    **headers)

        self.assertEqual(response.status_code, 200)
    
    def testEditPost(self):
        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        author1 = AppAuthor.objects.get(username="Tester1", password = "PassTester1")

        data = {
            "author" : author1,
            "title" : 'testPost4',
            'content_type' : 'text/plain',
            'image_file': '',
            'image_url': "http://picsum.photos/200/300",
            'content' : 'test',
        }

        response = self.client.post('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/postViews', data,
                                    **headers)

        self.assertEqual(response.status_code, 201)

        post_object = Post.objects.get(title = 'testPost4')
        self.assertEquals(post_object.title, "testPost4")

        data = {
            "author" : author1,
            "title" : 'testPost20',
            'content_type' : 'text/plain',
            'image_file': '',
            'image_url': "http://picsum.photos/200/300",
            'content' : 'test',
        }

        response = self.client.post('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(post_object.post_id) + '/editpost', data,
                                    **headers)

        self.assertEqual(response.status_code, 200)
        post_object = Post.objects.get(title = 'testPost20')
        self.assertEquals(post_object.title, "testPost20")

# Test make comment
# Test get comments on post
# Test delete comment
class CommentTests(TestCase):
    def setUp(self):
        
        #Create user
        tempAuthor = AppAuthor.objects.create_user('CMPUT404', 'cmput404')
        tempAuthor.is_staff = True
        tempAuthor.is_superuser = False
        tempAuthor.is_active = True
        tempAuthor.save()
        self.token, created1 = Token.objects.get_or_create(user=tempAuthor)

        testAuthor = AppAuthor.objects.create(username="Tester1", password = "PassTester1")

        testPost = Post.objects.create(author = testAuthor, title = 'testPost1', is_private = False, url = None, 
                                    content_type = ('text/plain', 'plaintext'), content = 'test', 
                                    source = None, origin = None, image_file = None, image_url = None, unlisted = False)
        
        testComment1 = Comment.objects.create(post = testPost, author = testAuthor, author_picture = None, author_username = 'Tester1', text = 'test1')

        testComment2 = Comment.objects.create(post = testPost, author = testAuthor, author_picture = None, author_username = 'Tester1', text = 'test2')

        testComment3 = Comment.objects.create(post = testPost, author = testAuthor, author_picture = None, author_username = 'Tester1', text = 'test3')

    #Check cannot get comments without auth
    def testCommentAuth(self):

        post = Post.objects.get(title = 'testPost1')
        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(post.post_id) + '/postcomments')
        self.assertEqual(response.status_code, 401)

    #Check each test comment exists in the database
    def testCommentsExist(self):

        self.assertEquals(Comment.objects.get(text = 'test1').text, "test1")
        self.assertEquals(Comment.objects.get(text = 'test2').text, "test2")
        self.assertEquals(Comment.objects.get(text = 'test3').text, "test3")

    #Check getting comments on post through API
    def testCommentsGet(self):

        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        post = Post.objects.get(title = 'testPost1')
        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(post.post_id) + '/postcomments',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Comments']), 3)


    #Check creating comment though API
    def testCommentsPost(self):

        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        testPost = Post.objects.get(title = 'testPost1')
        testAuthor = AppAuthor.objects.get(username="Tester1", password = "PassTester1")
        
        data = {
            'author' : testAuthor.user_id,
            'author_picture' : '',
            'author_username' : 'Tester1',
            'text' : 'test4',
        }

        #IN POST/VIEWS.PY, need to comment out setting the 'post' field. Test requests are immutable.
        response = self.client.post('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(testPost.post_id) + '/postcomments', data,
                                    **headers)

        self.assertEqual(response.status_code, 201)

        self.assertEquals(Comment.objects.get(text = 'test4').text, "test4")


# Test like post
# Test get likes of post
# Test removing like
class PostLikeTests(TestCase):
    def setUp(self):
        
        #Create user
        tempAuthor = AppAuthor.objects.create_user('CMPUT404', 'cmput404')
        tempAuthor.is_staff = True
        tempAuthor.is_superuser = False
        tempAuthor.is_active = True
        tempAuthor.save()
        self.token, created1 = Token.objects.get_or_create(user=tempAuthor)

        author1 = AppAuthor.objects.create(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.create(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.create(username="Tester3", password = "PassTester3")

        textPost = Post.objects.create(author = author1, title = 'testPost1', is_private = False, url = None, 
                                    content_type = ('text/plain', 'plaintext'), content = 'test', 
                                    source = None, origin = None, image_file = None, image_url = None, unlisted = False)
        
        imagePost = Post.objects.create(author = author2, title = 'testPost2', is_private = False, url = None, 
                                    content_type = ('text/plain', 'plaintext'), content = 'test', 
                                    source = None, origin = None, image_file = None, image_url = "https://picsum.photos/200", unlisted = False)
        
        unlistedPost = Post.objects.create(author = author3, title = 'testPost3', is_private = False, url = None, 
                                    content_type = ('text/plain', 'plaintext'), content = 'test', 
                                    source = None, origin = None, image_file = None, image_url = None, unlisted = True)
        

        like1 = PostLike.objects.create(author = author1, post_object = textPost)
        like2 = PostLike.objects.create(author = author2, post_object = textPost)

    # #Check each test like exists in the database
    def testLikesExist(self):

        author1 = AppAuthor.objects.get(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.get(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.get(username="Tester3", password = "PassTester3")

        self.assertEquals(PostLike.objects.get(author = author1).author, author1.username)
        self.assertEquals(PostLike.objects.get(author = author2).author, author2.username)


    # #Check getting likes through API
    def testLikesGet(self):

        self.client.login(username='CMPUT404', password='cmput404')

        post = Post.objects.get(title = 'testPost1')

        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        #Add third like to post
        author = AppAuthor.objects.get(username="Tester2", password = "PassTester2")
        like = PostLike.objects.create(author = author, post_object = post)
        
        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(post.post_id) + '/postlikes',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Post Likes']), 3)

    # #Check posting a like through API
    def testLikesPost(self):

        self.client.login(username='CMPUT404', password='cmput404')

        post = Post.objects.get(title = 'testPost3')
      
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        author = AppAuthor.objects.get(username="Tester3", password = "PassTester3")
        
        data = {
            'author': author.user_id,
            'post_object' : post.post_id,
            'like_count': 1
        }
        

        #IN POST/VIEWS.PY, need to comment out setting the 'post_object_id' field. Test requests are immutable.
        response = self.client.post('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(post.post_id) + '/testlikes', data,
                                    **headers)

        self.assertEqual(response.status_code, 201)

        self.assertEquals(PostLike.objects.get(post_object = post).post_object, post)
        self.assertEquals(Post.objects.get(title = 'testPost3').likes_count, 1)

    # Can not test like deletes because self.client.delete can not take in a request body.
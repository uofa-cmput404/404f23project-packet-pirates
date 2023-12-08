from django.test import TestCase
from login.models import AppAuthor
from post.models import *
from feed.models import *
from django.contrib import auth
from django.contrib.auth.models import User, Permission
from rest_framework.authtoken.models import Token
# Create your tests here.


class FeedTests(TestCase):
    
    def setUp(self):
        tempAuthor = AppAuthor.objects.create_user('CMPUT404', 'cmput404')
        self.token, created1 = Token.objects.get_or_create(user=tempAuthor)

        tempAuthor.is_staff = True
        tempAuthor.is_superuser = False
        tempAuthor.is_active = True
        tempAuthor.save()

        self.author1 = AppAuthor.objects.create(username="Tester1", password = "PassTester1")
        self.author2 = AppAuthor.objects.create(username="Tester2", password = "PassTester2")
        self.author3 = AppAuthor.objects.create(username="Tester3", password = "PassTester3")

        self.token1, created1 = Token.objects.get_or_create(user=self.author1)
        self.token2, created2 = Token.objects.get_or_create(user=self.author2)
        self.token3, created3 = Token.objects.get_or_create(user=self.author3)
        
        # print(f'Token for Tester1: {token1.key}')
        # print(f'Token for Tester2: {token2.key}')
        # print(f'Token for Tester3: {token3.key}')
        # messages = [('Liked your post', 'liked'), ('Commented on your post', 'commented')]
        
        #Notification test setup
        notification = Notifications.objects.create(author=self.author1.user_id, notification_author = self.author2.user_id, notif_author_pfp = None, 
                                                    notif_author_username = self.author2.username, message = ('Liked your post', 'liked'), url = None)

        # True friend test setup
        trueFriends1 = Friends.objects.create(author=self.author1.user_id, friend= self.author2.user_id, friend_pfp = None, friend_username = self.author2.username)
        trueFriends2 = Friends.objects.create(author=self.author2.user_id, friend= self.author1.user_id, friend_pfp = None, friend_username = self.author1.username)

        friend1 = Friends.objects.create(author=self.author1.user_id, friend= self.author3.user_id, friend_pfp = None, friend_username = self.author3.username)
        friend2 = Friends.objects.create(author=self.author2.user_id, friend= self.author3.user_id, friend_pfp = None, friend_username = self.author3.username)

        
    # True Friend Exists
    def testTrueFriendsExist(self):
        
        self.client.login(username="CMPUT404", password="cmput404")

        # author1 = AppAuthor.objects.get(username = 'Tester1', password="PassTester1")
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(self.author1.user_id) + '/truefriends',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 1)


    # #Test Get all Authors that an Author Follows
    def testAuthorFollows(self):

        self.client.login(username='CMPUT404', password='cmput404')

        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(self.author1.user_id) + '/authorfollowing',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 1)


        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(self.author3.user_id) + '/authorfollowing',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 2)


    #Test Get all Authors following an Author
    def testAllAuthorsFollowingAuthor(self):

        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        
        response = self.client.get('hhttps://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(self.author1.user_id) + '/authorfollowers',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 2)

        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(self.author3.user_id) + '/authorfollowers',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 0)


    #Test if Notifications Exist
    def testNotificationsExist(self):
        
        self.client.login(username='CMPUT404', password='cmput404')
        
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/' + str(self.author1.user_id) + '/authornotifications',
                                   **headers)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Notifications']), 1)
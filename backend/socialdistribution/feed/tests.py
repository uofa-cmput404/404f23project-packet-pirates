from django.test import TestCase
from login.models import AppAuthor
from post.models import *
from feed.models import *
from django.contrib import auth
# Create your tests here.


class FeedTests(TestCase):
    
    def setUp(self):
        tempAuthor = AppAuthor.objects.create_user('CMPUT404', 'cmput404')
        tempAuthor.is_staff = True
        tempAuthor.is_superuser = False
        tempAuthor.is_active = True
        tempAuthor.save()

        author1 = AppAuthor.objects.create(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.create(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.create(username="Tester3", password = "PassTester3")

        # messages = [('Liked your post', 'liked'), ('Commented on your post', 'commented')]
        
        #Notification test setup
        notification = Notifications.objects.create(author=author1, notification_author = author2, notif_author_pfp = None, 
                                                    notif_author_username = author1.username, message = ('Liked your post', 'liked'), url = None)

        # True friend test setup
        trueFriends1 = Friends.objects.create(author=author1, friend= author2, friend_pfp = None, friend_username = author2.username)
        trueFriends2 = Friends.objects.create(author=author2, friend= author1, friend_pfp = None, friend_username = author1.username)

        friend1 = Friends.objects.create(author=author1, friend= author3, friend_pfp = None, friend_username = author3.username)
        friend2 = Friends.objects.create(author=author2, friend= author3, friend_pfp = None, friend_username = author3.username)

        
    # True Friend Exists
    def testTrueFriendsExist(self):
        
        self.client.login(username='CMPUT404', password='cmput404')
        
        author = AppAuthor.objects.get(username = 'Tester1', password="PassTester1")

        response = self.client.get('http://127.0.0.1:8000/api/author/' + str(author.user_id) + '/truefriends')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 1)


    #Test Get all Authors that an Author Follows
    def testAuthorFollows(self):

        self.client.login(username='CMPUT404', password='cmput404')
        
        author1 = AppAuthor.objects.get(username = 'Tester1', password="PassTester1")

        response = self.client.get('http://127.0.0.1:8000/api/author/' + str(author1.user_id) + '/authorfollowing')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 1)


        author2 = AppAuthor.objects.get(username = 'Tester3', password="PassTester3")

        response = self.client.get('http://127.0.0.1:8000/api/author/' + str(author2.user_id) + '/authorfollowing')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 2)


    #Test Get all Authors following an Author
    def testAllAuthorsFollowingAuthor(self):

        self.client.login(username='CMPUT404', password='cmput404')
        
        author1 = AppAuthor.objects.get(username = 'Tester1', password="PassTester1")

        response = self.client.get('http://127.0.0.1:8000/api/author/' + str(author1.user_id) + '/authorfollowers')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 2)


        author2 = AppAuthor.objects.get(username = 'Tester3', password="PassTester3")

        response = self.client.get('http://127.0.0.1:8000/api/author/' + str(author2.user_id) + '/authorfollowers')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Friends']), 0)


    #Test if Notifications Exist
    def testNotificationsExist(self):
        
        self.client.login(username='CMPUT404', password='cmput404')
        
        author1 = AppAuthor.objects.get(username = 'Tester1', password="PassTester1")

        response = self.client.get('http://127.0.0.1:8000/api/author/' + str(author1.user_id) + '/authornotifications')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data['Notifications']), 1)
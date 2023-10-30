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

        
    # True Friend Exists
    def testTrueFriendsExist(self):
        pass

    #Test Get all Authors that an Author Follows
    def testAuthorFollows(self):
        pass

    #Test Get all Authors following an Author
    def testAllAuthorsFollowingAuthor(self):
        pass

    #Test if Notifications Exist
    def testNotificationsExist(self):
        pass

    #Test AllAuthorsFriends()
    def AllAuthorsFriends(self):
        pass
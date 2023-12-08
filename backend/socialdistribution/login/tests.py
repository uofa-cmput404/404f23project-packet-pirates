from django.test import TestCase
from login.models import AppAuthor
from django.contrib import auth
from django.contrib.auth.models import User, Permission
from rest_framework.authtoken.models import Token

class AuthorTestCase(TestCase):
    def setUp(self):
        author1 = AppAuthor.objects.create(username="Tester1", password = "PassTester1")
        author2 = AppAuthor.objects.create(username="Tester2", password = "PassTester2")
        author3 = AppAuthor.objects.create(username="Tester3", password = "PassTester3", display_name = "Dummy Author")
    
    def testAuthorExists(self):
        author1 = AppAuthor.objects.get(username = 'Tester1')
        author2 = AppAuthor.objects.get(username = 'Tester2')
        author3 = AppAuthor.objects.get(username= "Tester3")

        self.assertEqual(author1.password, 'PassTester1')
        self.assertEqual(author2.password, 'PassTester2')

        self.assertEqual(author3.password, 'PassTester3')
        self.assertEqual(author3.display_name, 'Dummy Author')

        self.assertEqual(author3.first_name, None)
        self.assertEqual(author3.last_name, None)
        self.assertEqual(author3.date_of_birth, None)
        self.assertEqual(author3.url, '')
        self.assertEqual(author3.github, '')

class AuthenticateTestCase(TestCase):
    def setUp(self):
        tempAuthor = AppAuthor.objects.create_user('CMPUT404', 'cmput404')
        tempAuthor.is_staff = True
        tempAuthor.is_superuser = False
        tempAuthor.is_active = True
        tempAuthor.save()
        self.token, created1 = Token.objects.get_or_create(user=tempAuthor)

    def testLogin(self):
        self.client.login(username='CMPUT404', password='cmput404')
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author',
                                   **headers)
                                   
        self.assertEqual(response.status_code, 200)

    def testNotLoggedIn(self):
        response = self.client.get('https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author',)
        self.assertEqual(response.status_code, 401)

    def testLogout(self):
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        response = self.client.get('hhttps://packet-pirates-backend-d3f5451fdee4.herokuapp.com/logout',
                                   **headers)
        self.assertEqual(response.status_code, 200)



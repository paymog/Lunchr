Feature: Navigating between unauthenticated screens

Scenario: Moving from the 'Login' screen to the 'Register' screen
Given I launch the app
Then I should be on the Login screen

When I touch 'Create Account'
Then I should be on the Register screen

Scenario: Moving from 'Register' to 'Login'
When I navigate back
Then I should be on the Login screen


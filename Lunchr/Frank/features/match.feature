Scenario: User is hungry and wants to be matched
Given I've successfully logged in
Then I should see "Find me a match"
And I should not see a hidden button marked "Finished Eating"
And I should not see an element of class "Label"

When I touch the button marked "Find me a match"
Then I should see an element of class "Label" with name "matchingLabel"
And I should see an element of class "Button" with name "finisheEatingButton"
And I should not see a hidden button marked "Find me a match"

Scenario: When a user being matched logs out and logs back in
Given I successfully logged in
And I touch the button marked "Find me a match"
When I touch the button marked "Logout"
Then I should be on the Login screen
When  I type paymahn1@gmail.com in the emailField text field
And I type password in the passwordField text field
And I touch the button marked 'Login'
Then I should be on the Home screen
And I should see an element of class "Label" with name "matchingLabel"
And I should see an element of class "Button" with name "finisheEatingButton"
And I should not see a hidden button marked "Find me a match"

Scenario: When a user does not want to be matched anymore
Given I successfully log in
And I touch the button marked "Find me a match"
When I touch the button marked "Finished Eating"
Then I should see "Find me a match"
And I should not see a hidden button marked "Finished Eating"
And I should not see an element of class "Label"

# Note, we can't test actual matching because the server will never
# match two iOS users.  
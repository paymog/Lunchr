# this presumes that register was run first

Scenario: Successfully logging in
Given I am on the Login screen
And I type paymahn1@gmail.com in the emailField text field
And I type password in the passwordField text field
When I touch the button marked 'Login'
Then I should be on the Home screen

Scenario: Unfilled fields during Login
Given I am on the Login screen
And I type paymahn1@gmail.com in the emailField text field
# And I type password in the passwordField text field ## unfilled
When I touch the button marked 'Login'
Then I should be on the Login screen
And I should see an element of class Label with name errorLabel